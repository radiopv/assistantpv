// Stub functions that replace face-api.js functionality
export async function loadFaceDetectionModels(): Promise<void> {
  console.log('Face detection disabled');
  return Promise.resolve();
}

export async function detectFace(imgElement: HTMLImageElement): Promise<string> {
  // Return a default object position that works well for most photos
  return '50% 20%';
}