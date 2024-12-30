import { Box, Button, Modal } from "@mui/material";

interface ReviewListModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReviewListModal({ open, onClose }: ReviewListModalProps) {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
      >
        <Box>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={onClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </>
  );
}
