import { useRef, useState } from "react";
import Webcam from "react-webcam";

const useWebCam = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const webCamRef = useRef<Webcam | null>(null);

  const handleToggleCamera = () => {
    setIsCameraOpen((prevState) => !prevState);
  };

  const capture = () => {
    if (webCamRef.current) {
      const imageSrc = webCamRef.current.getScreenshot();
      setImageSrc(imageSrc);
    } else {
      console.warn("La referencia a la cámara no está disponible.");
    }
  };

  return {
    isCameraOpen,
    imageSrc,
    webCamRef,
    handleToggleCamera,
    capture,
  };
};

export default useWebCam;
