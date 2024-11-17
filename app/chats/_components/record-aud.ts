import { useState, useCallback, useRef } from "react";
import { Socket } from "socket.io-client";

const useAudioRecording = (socket: Socket | null, username: string) => {
  const [isRecordingAud, setIsRecordingAud] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecordingAud = useCallback(() => {
    if (!window.webkitSpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecordingAud(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      if (socket) {
        socket.emit("send-message", {
          name: username,
          message: transcript,
        });
      }
      setIsRecordingAud(false);
    };

    recognition.onerror = (error) => {
      console.error("Speech recognition error:", error);
      setIsRecordingAud(false);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsRecordingAud(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [socket, username]);

  const stopRecordingAud = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecordingAud(false);
    }
  }, []);

  return { isRecordingAud, startRecordingAud, stopRecordingAud };
};

export default useAudioRecording;
