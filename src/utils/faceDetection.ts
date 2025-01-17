import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;
const processedImages = new Map<string, string>();

const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

export async function loadFaceDetectionModels() {
  if (modelsLoaded) return;
  
  // If already loading, return the existing promise
  if (loadingPromise) return loadingPromise;
  
  console.log('Starting to load face detection models from CDN...');
  
  loadingPromise = Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  ]).then(() => {
    modelsLoaded = true;
    console.log('Face detection models loaded successfully from CDN');
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
    const photoUrl = imgElement.src;
    
    // Check if we already processed this image
    if (processedImages.has(photoUrl)) {
      console.log('Using cached face position for:', photoUrl);
      return processedImages.get(photoUrl) || '50% 20%';
    }

    if (!modelsLoaded) {
      console.log('Models not loaded, attempting to load from CDN...');
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
      
      const position = `${boundedX}% ${boundedY}%`;
      
      // Cache the result
      processedImages.set(photoUrl, position);
      console.log(`Face detected and cached for ${photoUrl}, position: ${position}`);
      
      return position;
    }
  } catch (error) {
    console.error('Detailed error in face detection:', error);
  }
  
  // Cache default position for failed detections to avoid retrying
  const defaultPosition = '50% 20%';
  processedImages.set(imgElement.src, defaultPosition);
  console.log('Using default fallback position');
  return defaultPosition;
}