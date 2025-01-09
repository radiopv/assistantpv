import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

export async function loadFaceDetectionModels() {
  if (modelsLoaded) return;
  
  // If already loading, return the existing promise
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // Added for better detection
  ]).then(() => {
    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
  }).catch((error) => {
    console.error('Error loading face detection models:', error);
    modelsLoaded = false;
    loadingPromise = null;
    throw error;
  });

  return loadingPromise;
}

export async function detectFace(imgElement: HTMLImageElement): Promise<string> {
  try {
    await loadFaceDetectionModels();

    // Try with SSD MobileNet first
    let detection = await faceapi.detectSingleFace(imgElement);
    
    // If no face found, try with TinyFaceDetector
    if (!detection) {
      detection = await faceapi.detectSingleFace(
        imgElement,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 })
      );
    }
    
    if (detection) {
      const { box } = detection;
      const imgWidth = imgElement.naturalWidth;
      const imgHeight = imgElement.naturalHeight;
      
      // Calculate center position as percentage
      const centerX = ((box.x + box.width / 2) / imgWidth) * 100;
      const centerY = ((box.y + box.height / 2) / imgHeight) * 100;
      
      // Ensure values stay within reasonable bounds
      const boundedX = Math.max(0, Math.min(100, centerX));
      const boundedY = Math.max(0, Math.min(100, centerY));
      
      return `${boundedX}% ${boundedY}%`;
    }
  } catch (error) {
    console.error('Error detecting face:', error);
  }
  
  // Default fallback position if no face detected or error occurs
  return '50% 20%';
}