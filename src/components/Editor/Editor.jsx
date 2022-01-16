import React, { Component, Fragment } from "react";
// TODO: import as styles
import "./Editor.css";
import { GraphPane } from "../GraphPane";
import { GraphList } from "../GraphList";
import GraphStore from "../../utils/graph-store";

const DEFAULT_GRAPH_NAME = "rich";

export class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphName: DEFAULT_GRAPH_NAME,
      graphReadonly: true,
      graphList: GraphStore.getGraphList(),
      graph: GraphStore.loadGraph(DEFAULT_GRAPH_NAME),
    }
  }

  loadGraph = name => {
    this.setState({
      ...this.state,
      ...{
        graphName: name,
        graphReadonly: GraphStore.getGraphList().find(e => e.name === name).readonly,
        graph: GraphStore.loadGraph(name),
      }
    });
  }

  saveGraph = (name, graph) => {
    GraphStore.saveGraph(name, graph);
    this.setState({
      ...this.state,
      ...{
        graphName: name,
        graphReadonly: GraphStore.getGraphList().find(e => e.name === name).readonly,
        graph: GraphStore.loadGraph(name),
        graphList: GraphStore.getGraphList(),
      }
    });
  }

  deleteGraph = name => {
    console.log("EDITOR / loadGraph", name, this.state);
    GraphStore.deleteGraph(name);
    this.setState({
      ...this.state,
      ...{
        graphList: GraphStore.getGraphList(),
      }
    });
  }

  // TODO: Make sticky header
  render() {
    const { graph, graphList, graphName } = this.state;
    console.log("EDITOR / render", graph);
    const blockedFilenames = graphList
      .filter(({readonly}) => readonly)
      .map(({name}) => name);
    return (
      <Fragment>
        <GraphList
          graphList={sortGraphList(graphList)}
          loadGraph={this.loadGraph}
          deleteGraph={this.deleteGraph}
        />
        <GraphPane
          graph={graph}
          graphName={graphName}
          blockedFilenames={blockedFilenames}
          saveGraph={this.saveGraph}
        />
      </Fragment>
    );
  }
}

function sortGraphList(graphList) {
  const readonly = graphList.filter(({readonly}) => readonly);
  const writeable = graphList.filter(({readonly}) => !readonly)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  return [...readonly, ...writeable];
}
