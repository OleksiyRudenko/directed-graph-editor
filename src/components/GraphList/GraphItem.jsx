import React, { Component } from "react";
// TODO: import as styles
import "./GraphItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export class GraphItem extends Component {
  load = () => {
    const { name, loadFile } = this.props;
    loadFile(name);
  }

  delete = () => {
    const { name, deleteFile } = this.props;
    deleteFile(name);
  }

  render() {
    const { name, readonly } = this.props;
    return (
      <div className={`filenameControlsContainer`}>
        <button
          title={`Load ${name}`}
          className={`filenameButton`}
          onClick={this.load}
        >
          <span className={`filenameButtonText`}>{name}</span>
        </button>
        <button
          title={readonly ? `You cannot delete a preset` : `Delete`}
          className={readonly ? `inactive` : `critical`}
          disabled={readonly}
          onClick={readonly ? undefined : this.delete}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    );
  }
}
