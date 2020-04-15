import React, { Component } from "react";
import FileModal from "./FileModal";


class FileModalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { modal, closeModal } = this.props;
    return (
      <FileModal
        closeModal={closeModal}
        modal={modal}
      />
    );
  }
}

export default FileModalContainer;
