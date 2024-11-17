import { useRef, useState } from "react";

const useScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunks = useRef<Blob[]>([]);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Nuevo chunk de video recibido");
          videoChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("Grabación detenida. Generando URL de video...");
        const blob = new Blob(videoChunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        videoChunks.current = [];
      };

      mediaRecorderRef.current.start();
      console.log("Grabación iniciada...");
      setIsRecording(true);
    } catch (error) {
      console.error("Error al intentar acceder a la pantalla: ", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      console.log("Deteniendo la grabación...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      console.warn("No hay una grabación activa.");
    }
  };

  return {
    isRecording,
    videoUrl,
    startRecording,
    stopRecording,
  };
};

export default useScreenRecorder;
