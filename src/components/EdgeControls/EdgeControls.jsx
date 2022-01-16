import React, { Component } from "react";
// TODO: import as styles
import "./EdgeControls.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faRecycle, faTimes } from "@fortawesome/free-solid-svg-icons";

export class EdgeControls extends Component {
  insertNode = () => {
    const { node, inbound, insertNode, removeEdgeToolbar } = this.props;
    console.log("Edge.insert", node, inbound);
    insertNode(node, inbound);
    removeEdgeToolbar();
  }

  removeEdge = () => {
    const { node, inbound, removeEdge, removeEdgeToolbar } = this.props;
    console.log("Edge.remove", "from", inbound, "to", node);
    removeEdge(node, inbound);
    removeEdgeToolbar();
  }

  render() {
    const { removeEdgeToolbar } = this.props;
    return (
      <div className="toolBar" style={{
        left: this.props.posx - 50,
        top: this.props.posy,
      }}>
        <button className="edgeControlButton bigButton insert" title="Insert node" onClick={this.insertNode}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button className="edgeControlButton bigButton delete" title="Delete edge" onClick={this.removeEdge}>
          <FontAwesomeIcon icon={faRecycle} />
        </button>
        <button className="edgeControlButton bigButton normal" title="Close toolbar" onClick={removeEdgeToolbar}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    );
  }
}
