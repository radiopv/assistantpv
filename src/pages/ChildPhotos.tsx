import { useParams } from 'react-router-dom';
import { ChildPhotoAlbum } from '@/components/AssistantPhotos/ChildPhotoAlbum';

const ChildPhotos = () => {
  const { childId } = useParams<{ childId: string }>();

  if (!childId) {
    return <div>Child ID is required</div>;
  }

  return <ChildPhotoAlbum childId={childId} />;
};

export default ChildPhotos;