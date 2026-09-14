import SimpleMessageModal from './SimpleMessageModal';

interface DetailsErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailsErrorModal = ({ isOpen, onClose }: DetailsErrorModalProps) => (
  <SimpleMessageModal
    isOpen={isOpen}
    onClose={onClose}
    message={
      <>
        모든 정보를 입력해야 합니다.
        <br />
        입력한 정보를 다시 확인해주세요.
      </>
    }
  />
);

export default DetailsErrorModal;
