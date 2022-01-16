import React, { Component } from "react";
import "./GraphSaveControls.css";
import { VALID_GRAPH_NAME_PATTERN } from "../../utils/graph-store";

export class GraphSaveControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originalFilename: this.props.filename,
      filename: this.props.filename,
      blockedFilenames: this.props.blockedFilenames,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filename !== this.props.filename) {
      this.setState({
        ...this.state,
        originalFilename: this.props.filename,
        filename: this.props.filename,
        blockedFilenames: this.props.blockedFilenames,
      });
    }
  }

  updateFilename = e => {
    const cleanFilename = e.target.value.trim();
    if (e.target.value !== cleanFilename) e.target.value = cleanFilename;
    this.setState({
      ...this.state,
      ...{
        filename: cleanFilename,
      },
    })
  }

  save = () => this.props.save(this.state.filename);

  render() {
    const { filename, originalFilename, blockedFilenames } = this.state;
    let save = {
      text: "Save",
      title: "Overwrite",
      disabled: false,
    };
    if (!VALID_GRAPH_NAME_PATTERN.test(filename)) {
      save.title = "Invalid file name";
      save.disabled = true;
    } else if (blockedFilenames.includes(filename)) {
      save.title = "Cannot overwrite";
      save.disabled = true;
    } else if (originalFilename !== filename) {
      save.text = "Save as...";
      save.title = "Create new";
    }

    // TODO: Make GraphSaveControls sticky
    return (
      <div>
        <input
          type={"text"}
          value={filename}
          onKeyUp={this.updateFilename}
          onChange={this.updateFilename}
        />
        <button
          className={"fileSaveButton"}
          title={save.title}
          disabled={save.disabled}
          onClick={this.save}
        >
          {save.text}
        </button>
      </div>
    );
  }

}
