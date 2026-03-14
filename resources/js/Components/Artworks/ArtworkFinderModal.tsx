import { Modal } from "antd";
import ArtworkFinder from "./ArtworkFinder";

type Props = {
  show: boolean;
  onClose: () => void;
  onSelect?: (artwork: any) => void;
}

function ArtworkFinderModal({ show, onClose, onSelect }: Props) {

  function handleSelect(artwork: any) {
    onSelect && onSelect(artwork);
    onClose();
  }

  return (
    <Modal
      title="Find Artwork"
      open={show}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <ArtworkFinder
        onSelect={handleSelect}
      />
    </Modal>
  );
}

export default ArtworkFinderModal;
