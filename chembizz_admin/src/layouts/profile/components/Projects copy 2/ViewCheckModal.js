// Import necessary components from React and Material UI
import React from "react";
import Modal from "@mui/material/Modal";
import MDBox from "components/MDBox";
import cancel from "../../../../assets/images/cancel-check.webp"

const ViewCheckModal = ({ isOpen, onClose, checkPhotoUrl }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <MDBox p={4} bgcolor="background.paper" boxShadow={24}>
          {/* Display check photo */}
          <img src={checkPhotoUrl} alt="image not found" style={{ maxWidth: "100%", maxHeight: "100%" }} />
        </MDBox>
      </div>
    </Modal>
  );
};

export default ViewCheckModal;
