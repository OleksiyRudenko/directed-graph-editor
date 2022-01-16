import React, { Component } from "react";
import { GraphChart } from "./GraphChart";
import { GraphCode } from "./GraphCode";
import { GraphSaveControls } from "./GraphSaveControls";
import "./GraphPane.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faCodeBranch } from "@fortawesome/free-solid-svg-icons";

// TODO: Show graph exported code JSON

export class GraphPane extends Component {
  constructor(props) {
    super(props);
    console.log("GRAPH Pane / constructor");
    this.state = {
      graph: this.props.graph,
      graphName: this.props.graphName,
      blockedFilenames: this.props.blockedFilenames,
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.graph !== this.props.graph
      || prevProps.graphName !== this.props.graphName
    ) {
      this.setState({
        ...this.state,
        graph: this.props.graph,
        graphName: this.props.graphName,
        blockedFilenames: this.props.blockedFilenames,
      });
    }
  }

  save = (name) => this.props.saveGraph(name, this.state.graph);

  updateGraph = graph => {
    console.log("Graph Pane . update graph");
    this.setState({
      graph: [...graph],
    })
  }

  render() {
    console.log("Graph Pane . render");
    const { graph, graphName, blockedFilenames } = this.state;
    const edgeControls = this.edgeControls;
    return (
      <div style={{position: "relative"}}>
        <div className={`fileBar`}>
          <GraphSaveControls
            filename={this.state.graphName}
            blockedFilenames={this.state.blockedFilenames}
            save={this.save}
          />
          <div>
            <button
              title={"Chart view"}
              className={"buttonStarting buttonActive"}
            >
              <FontAwesomeIcon icon={faCodeBranch} />
            </button>
            <button
              disabled={true}
              title={"JSON view"}
              className={"buttonEnding"}
            >
              <FontAwesomeIcon icon={faCode} />
            </button>
          </div>
        </div>
        <GraphChart
          graph={graph}
          graphName={graphName}
          blockedFilenames={blockedFilenames}
          saveGraph={this.saveGraph}
          updateGraph={this.updateGraph}
        />
        {/*<GraphCode
          graph={[...graph]}
          updateGraph={this.updateGraph}
        />*/}
        {edgeControls}
    </div>
    );
  }
}
