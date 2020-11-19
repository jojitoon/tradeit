import { storage } from '../configs/firebase';

const handleFireBaseUpload = async (imageFile) => {
  if (!imageFile) return null;

  const uploadTask = await storage
    .ref(`/images/${imageFile.name}`)
    .put(imageFile);

  const imageUrl = await uploadTask.ref.getDownloadURL();

  return imageUrl;
};

export default handleFireBaseUpload;
