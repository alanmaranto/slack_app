import React from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import FileModalContainer from "./FileModalContainer";
import ProgressBar from "../../core/ProgressBar/ProgressBar";
import "./style.css";
const MessageForm = ({
  message,
  loading,
  errors,
  modal,
  onChange,
  sendMessage,
  openModal,
  closeModal,
  uploadFile,
  uploadState,
  percentUploaded,
}) => {
  return (
    <Segment className="message_form">
      <Input
        fluid
        name="message"
        value={message}
        onChange={onChange}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        className={
          errors.some((error) => error.message.includes("message"))
            ? "error"
            : ""
        }
        placeholder="Write your message"
      />
      <Button.Group icon widths="2">
        <Button
          onClick={sendMessage}
          disabled={loading}
          color="orange"
          content="Add reply"
          labelPosition="left"
          icon="edit"
        />
        <Button
          color="teal"
          disabled={uploadState === 'uploading'}
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
          onClick={openModal}
        />
      </Button.Group>
      <FileModalContainer
        modal={modal}
        closeModal={closeModal}
        uploadFile={uploadFile}
      />
      <ProgressBar
        uploadState={uploadState}
        percentUploaded={percentUploaded}
      />
    </Segment>
  );
};

export default MessageForm;
