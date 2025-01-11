import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let loadingPromise: Promise<void> | null = null;
const detectionCache = new Map<string, string>();

const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

export async function loadFaceDetectionModels() {
  if (modelsLoaded) return;
  
  // If already loading, return the existing promise
  if (loadingPromise) return loadingPromise;
  
  console.log('Starting to load face detection models...');
  
  loadingPromise = Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
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
  const imgSrc = imgElement.src;
  
  // Check cache first
  if (detectionCache.has(imgSrc)) {
    return detectionCache.get(imgSrc)!;
  }

  try {
    if (!modelsLoaded) {
      await loadFaceDetectionModels();
    }

    const detection = await faceapi.detectSingleFace(
      imgElement,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 })
    );
    
    let result = '50% 20%'; // Default fallback position
    
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
      
      result = `${boundedX}% ${boundedY}%`;
    }

    // Cache the result
    detectionCache.set(imgSrc, result);
    return result;
    
  } catch (error) {
    console.error('Error in face detection:', error);
    return '50% 20%'; // Default fallback position
  }
}

// Clear cache when it gets too large
export function clearDetectionCache() {
  if (detectionCache.size > 100) {
    detectionCache.clear();
  }
}