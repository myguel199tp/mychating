import { Modal } from "complexes-next-components";
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function ModalWallet({ isOpen, onClose, title }: Props) {
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} title={title}>
        handleToggleCamer
      </Modal>
    </div>
  );
}
