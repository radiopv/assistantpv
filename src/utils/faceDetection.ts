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
  ]).then(() => {
    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
  }).catch((error) => {
    console.error('Error loading face detection models:', error);
    // Reset loading state so we can try again
    loadingPromise = null;
    throw error;
  });

  return loadingPromise;
}

export async function detectFace(imgElement: HTMLImageElement): Promise<string> {
  try {
    await loadFaceDetectionModels();

    const detection = await faceapi.detectSingleFace(imgElement);
    
    if (detection) {
      const { box } = detection;
      const centerX = (box.x + box.width / 2) / imgElement.naturalWidth * 100;
      const centerY = (box.y + box.height / 2) / imgElement.naturalHeight * 100;
      return `${centerX}% ${centerY}%`;
    }
  } catch (error) {
    console.error('Error detecting face:', error);
  }
  
  return 'center 20%'; // Default fallback position
}