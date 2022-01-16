import React, { Component } from "react";
// TODO: import as styles
import "./GraphList.css";
import { GraphItem } from "./GraphItem";
import { stateUpdate, stateInit } from "../../utils/state-utils";

export class GraphList extends Component {
  watchedProps = ["graphList"];
  constructor(props) {
    super(props);
    stateInit(this, this.watchedProps, this.props);
  }

  componentDidUpdate(prevProps) {
    stateUpdate(this, this.watchedProps, prevProps);
  }

  loadFile = name => this.props.loadGraph(name);

  deleteFile = name => this.props.deleteGraph(name);

  render() {
    const { graphList } = this.state;
    return (
      <div className={`fileListContainer`}>
        <h2 className={`fileListTitle`}>Files:</h2>
        <div className={`filenamesListContainer`}>
          {graphList.map(({name, readonly}, idx) =>
            <GraphItem
              key={`EditorFileItem${idx}`}
              name={name}
              readonly={readonly}
              loadFile={this.loadFile}
              deleteFile={this.deleteFile}
            />
          )}
        </div>
      </div>
    );
  }
}
