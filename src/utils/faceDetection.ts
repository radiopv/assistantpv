import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;

export async function loadFaceDetectionModels() {
  if (modelsLoaded) return;
  
  // If already loading, return the existing promise
  if (loadingPromise) return loadingPromise;
  
  console.log('Starting to load face detection models...');
  
  // Check if models directory exists
  try {
    const response = await fetch('/models/tiny_face_detector_model-weights_manifest.json');
    if (!response.ok) {
      throw new Error('Models directory not found. Please ensure models are in /public/models/');
    }
  } catch (error) {
    console.error('Error checking models directory:', error);
    throw new Error('Face detection models not found in /public/models/. Please ensure all required models are present.');
  }
  
  loadingPromise = Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  ]).then(() => {
    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
  }).catch((error) => {
    console.error('Detailed error loading face detection models:', error);
    modelsLoaded = false;
    loadingPromise = null;
    throw new Error(`Failed to load face detection models: ${error.message}`);
  });

  return loadingPromise;
}

export async function detectFace(imgElement: HTMLImageElement): Promise<string> {
  try {
    if (!modelsLoaded) {
      console.log('Models not loaded, attempting to load...');
      await loadFaceDetectionModels();
    }

    // Try with SSD MobileNet first
    let detection = await faceapi.detectSingleFace(imgElement);
    
    // If no face found, try with TinyFaceDetector
    if (!detection) {
      console.log('No face detected with SSD MobileNet, trying TinyFaceDetector...');
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
      
      console.log(`Face detected, position: ${boundedX}% ${boundedY}%`);
      return `${boundedX}% ${boundedY}%`;
    }
  } catch (error) {
    console.error('Detailed error in face detection:', error);
  }
  
  console.log('Using default fallback position');
  return '50% 20%';
}