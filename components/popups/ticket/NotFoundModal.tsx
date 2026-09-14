import SimpleMessageModal from './SimpleMessageModal';

interface NotFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotFoundModal = ({ isOpen, onClose }: NotFoundModalProps) => (
  <SimpleMessageModal
    isOpen={isOpen}
    onClose={onClose}
    message={
      <>
        입력한 정보가 일치하지 않습니다.
        <br />
        다시 확인해주세요.
      </>
    }
  />
);

export default NotFoundModal;
