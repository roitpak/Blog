export interface ModalProps {
  isVisible: boolean;
  buttons?: ModalButton[];
  title?: string;
  text?: string;
}

interface ModalButton {
  label: string;
  onClick: () => void | Promise<void>;
}

export interface ModalContextType {
  isVisible: boolean;
  openModal: (modalProps: Omit<ModalProps, 'isVisible'>) => void;
  closeModal: () => void;
}
