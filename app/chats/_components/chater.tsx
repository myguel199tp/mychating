import { useEffect, useState } from "react";
import { initializeSocket } from "./socket";
import { Socket } from "socket.io-client";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Button,
  Buton,
  InputField,
  Avatar,
  Text,
  Title,
} from "complexes-next-components";
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import { TbScreenShare, TbScreenShareOff } from "react-icons/tb";
import { IoSend } from "react-icons/io5";
import Webcam from "react-webcam";
import Image from "next/image";
import { MdNoPhotography, MdPhotoCamera } from "react-icons/md";
import { SiAffinityphoto } from "react-icons/si";
import { RiArchiveStackFill } from "react-icons/ri";
import useAudioRecording from "./record-aud";
import useScreenRecorder from "./record-screen";
import useWebCam from "./web-cam";
import Form from "./registers/_components/form";
import { GiWallet } from "react-icons/gi";
import ModalWallet from "./modal/modal-wallet";

const Chat = () => {
  const [messages, setMessages] = useState<
    {
      id: string;
      userId: string;
      name: string;
      message: {
        text?: string;
        audioUrl?: string;
        imageUrl?: string;
      };
    }[]
  >([]);
  const [message, setMessage] = useState<string>("");
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [username, setUsername] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [toogle, setToggle] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchModal, setSearchModal] = useState<boolean>(false);

  const filterClients = () => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filterMessages = () => {
    return messages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.text?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    if (socket) {
      socket.on(
        "on-message",
        (data: {
          id: string;
          userId: string;
          name: string;
          message: { name: string; message: string; audioUrl?: string };
        }) => setMessages((prevMessages) => [...prevMessages, data])
      );

      socket.on("on-clients-changed", (updatedClients) => {
        setClients(updatedClients);
      });

      socket.on("on-private-message", (data) => {
        console.log("Mensaje privado: ", data);
      });

      return () => {
        socket.off("on-message");
        socket.off("on-clients-changed");
        socket.off("on-private-message");
        socket.disconnect();
      };
    }
  }, [socket]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    document.getElementById("file-input")?.click();
  };

  const sendMessage = () => {
    if ((message || image) && socket) {
      const messageData = {
        name: username,
        message: message,
        imageUrl: image,
      };

      socket.emit("send-message", messageData);
      setMessage("");
      setImage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      const newSocket = initializeSocket(username, "fj4jr3r");
      setSocket(newSocket);

      newSocket.emit("set-username", username);

      const socketId = newSocket.id ? newSocket.id : "default-id";

      setClients((prevClients) => [
        ...prevClients,
        { id: socketId, name: username },
      ]);

      localStorage.setItem("name", username);
      setUsername("");
    }
  };

  const addEmoji = (emojiData: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  /**
   * record aud
   **/
  const { isRecordingAud, startRecordingAud, stopRecordingAud } =
    useAudioRecording(socket, username);

  /**
   * record screen
   **/
  const { isRecording, startRecording, stopRecording, videoUrl } =
    useScreenRecorder();
  /**
   * webcam
   **/
  const { capture, handleToggleCamera, imageSrc, isCameraOpen, webCamRef } =
    useWebCam();
  return (
    <div>
      {searchModal && (
        <ModalWallet
          isOpen={searchModal}
          onClose={() => setSearchModal(false)}
          title="Billetera"
        />
      )}

      {socket && socket.connected ? (
        <>
          <div className="flex">
            <section className="bg-gray-100 p-4 rounded shadow-md">
              <InputField
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Title size="xs" font="bold" className="m-2">
                Conectados
              </Title>
              <ul>
                {filterClients().map((client) => (
                  <li key={client.id} className="mb-1">
                    <div className="flex items-center gap-4 hover:bg-slate-300 p-2 rounded-md cursor-pointer">
                      <Avatar
                        shape="rounded"
                        alt={client.name}
                        size="md"
                        border="none"
                        src="https://th.bing.com/th/id/R.5109ba1cf72642b6f68a35f37491b340?rik=K7O6n7sQB%2flV7g&riu=http%3a%2f%2fimages6.fanpop.com%2fimage%2fphotos%2f36800000%2f-Luffy-monkey-d-luffy-36845039-1280-800.jpg&ehk=QePyEB4V6cBr7rKXkraLr1oH9rovNLHvMEn0RG9%2f1ek%3d&risl=&pid=ImgRaw&r=0"
                      />
                      <div>
                        <Text size="md" font="bold">
                          {client.name}
                        </Text>
                        <Text size="sm"> este es mi motivo y el mensaje </Text>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <section className="flex flex-row-reverse justify-center items-center gap-4 w-full">
              <div className="bg-slate-300 p-4 w-full">
                {isCameraOpen && (
                  <div className="relative w-full">
                    <div className="absolute z-20 right-0 p-2">
                      <Webcam
                        className="rounded-lg"
                        audio={false}
                        height={400}
                        width={400}
                        screenshotFormat="image/png"
                        ref={webCamRef}
                      />
                    </div>
                  </div>
                )}
                <section className="flex">
                  <Buton
                    size="sm"
                    rounded="sm"
                    colVariant="default"
                    borderWidth="thin"
                  >
                    grupo
                  </Buton>
                  <Buton
                    size="sm"
                    rounded="sm"
                    colVariant="default"
                    borderWidth="thin"
                  >
                    grupo
                  </Buton>
                  <Buton
                    size="sm"
                    rounded="sm"
                    colVariant="default"
                    borderWidth="thin"
                  >
                    grupo
                  </Buton>
                  <Buton
                    size="sm"
                    rounded="sm"
                    colVariant="default"
                    borderWidth="thin"
                  >
                    grupo
                  </Buton>
                </section>
                <div className="bg-black h-[600px] p-2 rounded">
                  {videoUrl && (
                    <div>
                      <h2>Video grabado:</h2>
                      <video src={videoUrl} controls width="600" />
                      <a href={videoUrl} download="grabacion.webm">
                        Descargar video
                      </a>
                    </div>
                  )}
                  {imageSrc && (
                    <Image
                      src={imageSrc}
                      alt="imagen de camara"
                      width={200}
                      height={200}
                    />
                  )}
                  {filterMessages().map((msg, index) => (
                    <div
                      className="flex items-center gap-2 bg-slate-300 p-2 rounded-md"
                      key={index}
                      style={{ margin: "3px", padding: "2px" }}
                    >
                      <Avatar
                        shape="rounded"
                        alt={msg.name}
                        size="md"
                        border="none"
                        src="https://th.bing.com/th/id/R.5109ba1cf72642b6f68a35f37491b340?rik=K7O6n7sQB%2flV7g&riu=http%3a%2f%2fimages6.fanpop.com%2fimage%2fphotos%2f36800000%2f-Luffy-monkey-d-luffy-36845039-1280-800.jpg&ehk=QePyEB4V6cBr7rKXkraLr1oH9rovNLHvMEn0RG9%2f1ek%3d&risl=&pid=ImgRaw&r=0"
                      />
                      <Text font="semi" size="sm">
                        {msg.name ? String(msg.name) : "Usuario desconocido"}:
                      </Text>
                      {msg.message && (
                        <Text size="sm">{String(msg.message)}</Text>
                      )}
                      {msg.message?.audioUrl && (
                        <audio controls src={msg.message.audioUrl}></audio>
                      )}
                      {msg.message?.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={msg.message.imageUrl}
                          alt="Mensaje"
                          style={{ maxWidth: "200px" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2 justify-center items-center w-full">
                  <div className="relative">
                    {showEmojiPicker && (
                      <div className="absolute bottom-full mb-2 z-10">
                        <div className="emoji-picker bg-white shadow-lg rounded">
                          <EmojiPicker onEmojiClick={addEmoji} />
                        </div>
                      </div>
                    )}
                    <Button
                      colVariant="success"
                      className="ml-4"
                      size="md"
                      rounded="lg"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      😊
                    </Button>
                  </div>
                  <InputField
                    className="w-full"
                    rounded="lg"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje"
                  />

                  <Button
                    className="flex-grow-0"
                    colVariant="primary"
                    rounded="lg"
                    size="md"
                    onClick={sendMessage}
                  >
                    <IoSend />
                  </Button>
                </div>
                <div className="flex gap-2 justify-center mt-1">
                  <Buton
                    colVariant="success"
                    size="md"
                    rounded="md"
                    onClick={() => setSearchModal(true)}
                  >
                    <GiWallet color="green" />
                  </Buton>
                  {isRecordingAud ? (
                    <Buton
                      colVariant="danger"
                      size="sm"
                      rounded="lg"
                      onClick={stopRecordingAud}
                    >
                      <FaMicrophoneAlt color="red" />
                    </Buton>
                  ) : (
                    <Buton
                      onClick={startRecordingAud}
                      colVariant="success"
                      size="md"
                      rounded="md"
                    >
                      <FaMicrophoneAltSlash color="green" />
                    </Buton>
                  )}
                  {isRecording && <p style={{ color: "red" }}>Grabando...</p>}
                  <Buton
                    colVariant="success"
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? (
                      <TbScreenShareOff color="red" />
                    ) : (
                      <TbScreenShare color="green" />
                    )}
                  </Buton>

                  <Buton
                    colVariant="success"
                    size="md"
                    rounded="md"
                    onClick={handleToggleCamera}
                  >
                    {isCameraOpen ? (
                      <MdPhotoCamera color="red" />
                    ) : (
                      <MdNoPhotography color="green" />
                    )}
                  </Buton>
                  {isCameraOpen && (
                    <Button
                      colVariant="success"
                      size="md"
                      rounded="md"
                      onClick={capture}
                    >
                      <SiAffinityphoto color="blue" />
                    </Button>
                  )}

                  <div>
                    <Buton
                      colVariant="success"
                      size="md"
                      rounded="md"
                      onClick={handleButtonClick}
                    >
                      <RiArchiveStackFill color="green" />
                    </Buton>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      ) : (
        <div className="center">
          <div className="flex bg-blue-400 w-auto justify-center rounded-full">
            <Button
              size="full"
              rounded="lg"
              colVariant={toogle ? "success" : "primary"}
              onClick={() => setToggle(!toogle)}
            >
              Registarse
            </Button>
            <Button
              size="full"
              rounded="lg"
              colVariant={!toogle ? "success" : "primary"}
              onClick={() => setToggle(!toogle)}
            >
              Iniciar sesion
            </Button>
          </div>
          {toogle && <Form />}
          {!toogle && (
            <form className="form" onSubmit={handleSubmit}>
              <InputField
                placeholder="Tu nombre"
                type="text"
                rounded="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button colVariant="success" size="md" rounded="md" type="submit">
                Conectar
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
