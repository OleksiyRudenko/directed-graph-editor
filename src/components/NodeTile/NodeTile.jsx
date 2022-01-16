import React, { Component, Fragment } from "react";
// TODO: import as styles
import "./NodeTile.css";
import {
  DEFAULT_MODE,
  EDIT_MODE,
  MANIPULATE_MODE,
  CONNECTION_START_MODE,
  NODE_CREATION_MODE,
  CONNECTION_BUILD_MODE
} from "../editor-mode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// faTrashAlt, faExternalLinkAlt
import { faRecycle, faLink, faPen, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

export class NodeTile extends Component {
  getStyleClass(node, incomes) {
    if (incomes && incomes.length > 1 && node.next && node.next.length > 1)
      return "nodePurple"; // styles.nodePurple;
    if (incomes && incomes.length > 1) return "nodeOrange"; // styles.nodeOrange; "nodeOrange"
    if (node.next && node.next.length > 1) return "nodeGreen"; // styles.nodeGreen;
    return "nodeBlue"; // styles.nodeBlue;
  }

  renderText(label) {
    return (
        <div
          className="label"
        >
          {label}
        </div>
    );
  }

  renderLabel() {
    const { node } = this.props;
    return this.renderText(node.payload.label);
  }

  renderConnectionStarted = () => {
    return (<div>
      <button className="button bigButton delete" title="Cancel connection mode" onClick={this.cancelConnectionMode}>
        {" "}<FontAwesomeIcon icon={faTimes} />{" "}
      </button>
    </div>);
  }

  renderConnectionBuild() {
    const { node } = this.props;
    return (<div>
      <button className="button bigButton blue" title={`Connect here (id=${node.id})`} onClick={this.buildConnection}>
        <FontAwesomeIcon icon={faLink} />
      </button>
    </div>);
  }

  renderTextInput= () => {
    const { node } = this.props;
    return (
      <input
        type="text"
        className="textInput"
        defaultValue={node.payload.label}
        autoFocus={true}
        onChange={(e) => {
          node.payload.mode = DEFAULT_MODE;
          node.payload.label = e.target.value;
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            node.payload.mode = MANIPULATE_MODE;
            this.setState({...this.state});
          }
        }}
      />
    );
  }

  renderControls() {
    const { node } = this.props;
    return (<Fragment>
      <div className="topToolBar">
        <button className="button edit" title="Edit" onClick={this.editLabel}>
          <FontAwesomeIcon icon={faPen} />
          {/*<span role="img" aria-label="Edit label">✏️</span>*/}
        </button><span> </span>
        <button className="button link" title={`Link (id=${node.id})`} onClick={this.startConnectionMode}>
          <FontAwesomeIcon icon={faLink} />
          {/*<span role="img" aria-label="Link node">🔗</span>*/}
        </button>
      </div>
      <div  className="bottomToolBar">
        <button className="button delete" title="Delete" onClick={this.deleteNode}>
          <FontAwesomeIcon icon={faRecycle} />
          {/*<span role="img" aria-label="Delete node">❌</span>*/}
        </button>
      </div>
    </Fragment>);
  }

  startConnectionMode = () => {
    const { node } = this.props;
    const { startConnectionMethod } = node.payload;
    node.payload.mode = CONNECTION_START_MODE;
    startConnectionMethod(node);
    this.setState({
      ...this.state,
    });
  }

  cancelConnectionMode = () => {
    const { node } = this.props;
    const { cancelConnectionMethod } = node.payload;
    node.payload.mode = MANIPULATE_MODE;
    cancelConnectionMethod(node);
    this.setState({
      ...this.state,
    });
  }

  buildConnection = () => {
    const { node } = this.props;
    const { buildConnectionMethod } = node.payload;
    node.payload.mode = DEFAULT_MODE;
    buildConnectionMethod(node);
    this.setState({
      ...this.state,
    });
  }

  editLabel = () => {
    const { node } = this.props;
    node.payload.mode = EDIT_MODE;
    this.setState({
      ...this.state,
    });
  }

  deleteNode = () => {
    const { node, incomes } = this.props;
    const { deleteMethod } = node.payload;
    deleteMethod(node, incomes);
  }

  renderCreationButton() {
    const { node } = this.props;
    const { createMethod } = node.payload;
    return (<div>
      <button className="button bigButton edit" title="Create root node" onClick={createMethod}>
        {" "}<FontAwesomeIcon icon={faPlus} />{" "}
        {/*<span role="img" aria-label="Create root node">➕</span>*/}
      </button>
    </div>);
  }

  render() {
    const { node, incomes } = this.props;
    const render = {
      [EDIT_MODE]: "renderTextInput",
      [CONNECTION_START_MODE]: "renderConnectionStarted",
      [CONNECTION_BUILD_MODE]: "renderConnectionBuild",
      [NODE_CREATION_MODE]: "renderCreationButton",
      [MANIPULATE_MODE]: "renderControls",
      [DEFAULT_MODE]: "renderLabel",
    }[node.payload.mode] || "renderLabel";

    return (
      <div
        className={`nodeContainer ${this.getStyleClass(node, incomes)}`}
        title={node.id}
      >
        {this[render]()}
      </div>
    );
  }
}
