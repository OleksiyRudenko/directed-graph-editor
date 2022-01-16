import React, { Component, Fragment } from "react";
import DirectGraph from "react-direct-graph";
import { NodeTile } from "../NodeTile";
import { EdgeControls } from "../EdgeControls";
import { getMouseCoords } from "../../utils/get-mouse-coords";
import "./GraphChart.css";
import {
  MANIPULATE_MODE,
  CONNECTION_START_MODE,
  CONNECTION_BUILD_MODE,
  NODE_CREATION_MODE, DEFAULT_MODE
} from "../editor-mode";

const cellSize = 100;
const cellPadding = cellSize * 0.25;

export class GraphChart extends Component {
  constructor(props) {
    super(props);
    console.log("GRAPH CANVAS / constructor");
    this.state = {
      graph: this.props.graph,
      graphName: this.props.graphName,
      blockedFilenames: this.props.blockedFilenames,
      inSelect: false,
      selected: [],
      nodeIdCounter: this.props.graph
        .map(node => +node.id)
        .sort((a, b) => b - a)[0] + 1,
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
        inSelect: false,
        selected: [],
        nodeIdCounter: this.props.graph
          .map(node => +node.id)
          .sort((a, b) => b - a)[0] + 1,
      });
    }
  }

  onNodeMouseEnter = (event, node, incomes) => {
    if (node.payload.mode === CONNECTION_START_MODE) return;
    if (node.payload.function && node.payload.function === "create") {
      node.payload.mode = NODE_CREATION_MODE;
      node.payload.createMethod = this.createOrphanedNode;
    } else {
      if (this.state.inSelect && node.payload.mode !== CONNECTION_START_MODE) {
        node.payload.mode = CONNECTION_BUILD_MODE;
        node.payload.buildConnectionMethod = this.applyNodeConnection;
      } else {
        node.payload.mode = MANIPULATE_MODE;
        node.payload.deleteMethod = this.softDeleteNode;
        node.payload.startConnectionMethod = this.startConnectionMode;
        node.payload.cancelConnectionMethod = this.cancelConnectionMode;
      }
    }
    this.setState({
      ...this.state,
    });
  };

  onNodeMouseLeave = (event, node, incomes) => {
    if (node.payload.mode === CONNECTION_START_MODE) return;
    node.payload.mode = null;
    this.setState({
      ...this.state,
    });
  };

  onEdgeClick = (event, node, incomes) => {
    const { x, y } = getMouseCoords(event);
    // console.log("CLick at",x,y);
    const edgeControls =
      <EdgeControls
        posx={x}
        posy={y}
        node={node}
        inbound={incomes[0]}
        insertNode={this.insertNode}
        removeEdge={this.removeEdge}
        removeEdgeToolbar={this.removeEdgeToolbar}
      />;
    this.edgeControls = edgeControls;
    // console.log("Prepared new Element", edgeControls.props);
    this.setState((prevState, props) => ({
      ...prevState,
      ...{
        edgeControls,
      }
    }));
    /* console.log("EdgeControl prepared Element",
      this.state.edgeControls && this.state.edgeControls.props, this.state); */
    // this.insertNode(node, incomes[0]);
  };

  onEdgeMouseEnter = (event, node, incomes) => {
    event.currentTarget.style.stroke = "#f00";
    event.currentTarget.style.fill = "#f00";
  };

  onEdgeMouseLeave = (event, node, incomes) => {
    event.currentTarget.style.stroke = "rgb(45, 87, 139)";
    event.currentTarget.style.fill = "rgb(45, 87, 139)";
  };

  removeEdgeToolbar = () => {
    this.edgeControls = null;
    this.setState((prevState, props) => ({
      ...prevState,
      ...{
        edgeControls: null,
      }
    }));
  };

  startConnectionMode = (node) => {
    this.setState({
      ...this.state,
      ...{
        inSelect: true,
        selected: [node],
      }
    });
  }

  cancelConnectionMode = (node) => {
    this.setState({
      ...this.state,
      ...{
        inSelect: false,
        selected: [],
      }
    });
  }

  removeEdge = (node, fromNode) => {
    fromNode = this.state.graph.find(n => n.id === fromNode.id);
    node = this.state.graph.find(n => n.id === node.id);

    fromNode.next = fromNode.next.filter(id => id !== node.id);
    console.log("Graph Chart . remove Edge -- from", fromNode, "to", node);
    const newGraph = [...this.state.graph];

    console.log("Full Graph", newGraph);
    this.setState({
      ...this.state,
      ...{
        graph: [...newGraph],
      }
    });
    this.props.updateGraph(newGraph);
  };

  applyNodeConnection = (node, incomes) => {
    const fromNode = this.state.selected[0];
    fromNode.payload.mode = DEFAULT_MODE;
    // self? stop
    if (fromNode.id === node.id) return;
    // already linked? stop
    if (fromNode.next.includes(node.id)) {
      node.payload.mode = DEFAULT_MODE;
      this.setState({
        ...this.state,
        ...{
          inSelect: false,
          selected: [],
        }
      });
      return;
    }

    const newGraph = [...this.state.graph];
    fromNode.next.push(node.id);
    this.setState({
      ...this.state,
      ...{
        inSelect: false,
        selected: [],
        graph: newGraph,
      }
    });
    this.props.updateGraph(newGraph);
  };

  softDeleteNode = (node, incomes) => {
    const nodeIndex = this.state.graph.findIndex(n => n.id === node.id);
    incomes.forEach((income, index) => {
      const find = n => n.id === income.anchorFrom;
      while (income.isAnchor) {
        income = this.state.graph.find(find);
      }
      const inc = this.state.graph.find(n => n.id === income.id);
      const i = inc.next.findIndex(outcomeId => outcomeId === node.id);
      const incNext = node.next.filter(nextId => nextId !== inc.id);
      if (!index) inc.next.splice(i, 1, ...incNext);
      else inc.next.splice(i, 1);
    });
    const newGraph = [...this.state.graph];
    newGraph.splice(nodeIndex, 1);
    this.setState({
      ...this.state,
      ...{
        graph: newGraph
      }
    });
    this.props.updateGraph(newGraph);
  };

  insertNode = (node, income) => {
    const newId = `${this.state.nodeIdCounter}`;
    const nodeIndex = this.state.graph.findIndex(n => n.id === node.id);
    const inc = this.state.graph.find(n => n.id === income.id);
    const newGraph = [...this.state.graph];
    newGraph.splice(nodeIndex, 0, makeNewNode(newId, `n${newId}`, [node.id]));
    const i = inc.next.findIndex(outcomeId => outcomeId === node.id);
    inc.next.splice(i, 1, newId);
    this.setState({
      ...this.state,
      ...{
        graph: newGraph,
        nodeIdCounter: this.state.nodeIdCounter + 1,
      }
    });
    this.props.updateGraph(newGraph);
  };

  createOrphanedNode = () => {
    const newId = `${this.state.nodeIdCounter}`;
    const [creator, ...rest] = this.state.graph;
    const newGraph = [
      creator,
      makeNewNode(newId, `n${newId}`, []),
      ...rest,
    ];
    this.setState({
      ...this.state,
      ...{
        graph: newGraph,
        nodeIdCounter: this.state.nodeIdCounter + 1,
      }
    });
    this.props.updateGraph(newGraph);
  };

  render() {
    console.log("Graph Chart . render");
    const edgeControls = this.edgeControls;
    return (
      <Fragment>
        <div className={`graphCanvas`}>
          <DirectGraph
            list={this.state.graph}
            cellSize={cellSize}
            padding={cellPadding}
            component={NodeTile}
            onNodeMouseEnter={this.onNodeMouseEnter}
            onNodeMouseLeave={this.onNodeMouseLeave}
            onEdgeClick={this.onEdgeClick}
            onEdgeMouseEnter={this.onEdgeMouseEnter}
            onEdgeMouseLeave={this.onEdgeMouseLeave}
          />
        </div>
        {edgeControls}
      </Fragment>
    );
  }
}

const makeNewNode = (id, label, next) => {
  return {
    id,
    next,
    payload: {
      label,
      exist: true,
    }
  };
}
