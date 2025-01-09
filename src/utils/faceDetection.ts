import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadFaceDetectionModels() {
  if (modelsLoaded) return;
  
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    ]);
    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
  } catch (error) {
    console.error('Error loading face detection models:', error);
  }
}

export async function detectFace(imgElement: HTMLImageElement): Promise<string> {
  try {
    if (!modelsLoaded) {
      await loadFaceDetectionModels();
    }

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