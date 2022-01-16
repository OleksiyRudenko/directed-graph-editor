import React, { Component } from "react";
import "./GraphCode.css";
import { exportGraph } from "../../utils/graph-store";

export class GraphCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: this.props.graph,
      text: JSON.stringify(exportGraph(this.props.graph), null, 2),
      jsonIsFaulty: false,
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.graph !== this.props.graph) {
      this.setState({
        ...this.state,
        graph: this.props.graph,
        text: JSON.stringify(exportGraph(this.props.graph), null, 2),
        jsonIsFaulty: false,
      });
    }
  }

  updateGraph = ({target}) => {
    try {
      const newGraph = JSON.parse(target.value);
      this.props.updateGraph(newGraph);
    } catch (e) {
      this.setState({
        jsonIsFaulty: true,
      });
    }
  }

  render() {
    const { graph, jsonIsFaulty, text } = this.state;
    console.log("Graph Code . render", jsonIsFaulty, graph);
    return (
      <div className={"graphCodeContainer"}>
        <textarea
          className={"graphCodeTextArea"}
          value={text}
          onChange={this.updateGraph}
        >
        </textarea>
        {jsonIsFaulty && <div className={"jsonIsFaulty"}>JSON is invalid. Please correct.</div> }
      </div>
    );
  }
}
