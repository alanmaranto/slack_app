import React from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

const FileModal = ({ 
  modal, 
  closeModal, 
  addFile, 
  sendFile,
 }) => {
  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image First</Modal.Header>
      <Modal.Content>
        <Input
          onChange={addFile}
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={sendFile} color="green" inverted>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" onClick={closeModal} inverted>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
