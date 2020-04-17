import React, { Component } from "react";
import mime from "mime-types";

import FileModal from "./FileModal";

const initialState = {
  file: null,
  authorized: ["image/jpeg", "image/png"],
};

class FileModalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({
        file,
      });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        // send file
        const metadata = {
          contentType: mime.lookup(file.name),
        };
        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  };

  isAuthorized = (filename) => {
    const { authorized } = this.state;
    return authorized.includes(mime.lookup(filename));
  }

  clearFile = () => this.setState({ file: null });

  render() {
    const { modal, closeModal } = this.props;
    return (
      <FileModal
        closeModal={closeModal}
        modal={modal}
        addFile={this.addFile}
        sendFile={this.sendFile}
      />
    );
  }
}

export default FileModalContainer;
