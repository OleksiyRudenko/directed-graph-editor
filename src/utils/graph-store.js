import basic from "../data/basic.json";
import rich from "../data/rich.json";

const validTopLevelProperties = ["id", "next", "payload", "name", "nameOrientation", "edgeNames"];
const payloadTechnicalProperties = ["exist"];

/**
 * Import raw graph data.
 * - adds payload properties object
 * - moves any properties that do not belong to standard list under payload properties object
 * - creates payload.label (=id) if no label specified
 * - adds node creation technical node (if addRootNodeCreator == true)
 * @param graph {Array} - raw graph data
 * @param addRootNodeCreator {Boolean} - insert a node to create orphaned root nodes
 */
const importRawGraph = (graph, addRootNodeCreator = true) => {
  if (addRootNodeCreator) graph = [{
    id: "-1",
    next: [],
    payload: {
      label: "➕",
      function: "create",
      exist: true,
    }
  }, ...graph];
  return graph.map(entry => {
    if (!entry.payload) entry.payload = {exist: true};
    if (!entry.next) entry.next = [];
    if (!entry.payload.exist) entry.payload.exist = true;
    for (let key of Object.keys(entry)) {
      if (!validTopLevelProperties.includes(key)) {
        entry.payload[key] = entry[key];
        delete entry[key];
      }
    }
    if (!entry.payload.label) entry.payload.label = entry.id;
    return entry;
  });
}

/**
 * Exports graph where nodes stripped of technical properties
 * - removes node creation technical node (payload.function == "create")
 * - moves payload non-technical properties to the top level
 * - removes payload properties object
 * @param graph {Array} - internal representation of a graph
 */
export const exportGraph = graph => {
  return JSON.parse(JSON.stringify(graph))
    .filter(entry => entry.payload.function !== "create")
    .map(entry => {
      for (let key of Object.keys(entry.payload)) {
        if (!payloadTechnicalProperties.includes(key)) {
          entry[key] = entry.payload[key];
        }
      }
      delete entry.payload;
      return entry;
    });
}

const GRAPH_LIST = "graphs_list",
  GRAPH_PREFIX = "graph_";
const INITIAL_GRAPH_LIST = [
  { name: "empty", readonly: true, },
  { name: "basic", readonly: true, },
  { name: "rich", readonly: true, },
], graphMap = {
  "empty": [],
  "basic": basic,
  "rich": rich,
};

const getGraphList = () => {
  initializeBrowserStorage();
  return JSON.parse(localStorage.getItem(GRAPH_LIST));
}

const setGraphList = graphList => {
  localStorage.setItem(GRAPH_LIST, JSON.stringify(graphList));
}

const makeStoredGraphName = name => GRAPH_PREFIX + name;

export const VALID_GRAPH_NAME_PATTERN = new RegExp(/^[a-zA-Z0-9].*/i);

const saveGraph = (name, graph, forceOverwrite = false) => {
  initializeBrowserStorage();
  if (!VALID_GRAPH_NAME_PATTERN.test(name)) throw(new Error("Bad graph name. Should start with [a-zA-Z0-9]"));
  const graphList = getGraphList();
  const target = graphList.find(e => e.name === name);
  if (target) {
    if (target.readonly && !forceOverwrite) throw(new Error(`Cannot overwrite graph "${name}"`));
  } else {
    setGraphList([...graphList, { name, readonly: false }]);
  }
  localStorage.setItem(makeStoredGraphName(name), JSON.stringify(exportGraph(graph)));
}

const loadGraph = name => {
  initializeBrowserStorage();
  const graph = localStorage.getItem(makeStoredGraphName(name));
  if (!graph) throw(new Error(`Graph "${name}" not found`));
  return importRawGraph(JSON.parse(graph));
}

const deleteGraph = name => {
  initializeBrowserStorage();
  const list = getGraphList();
  const target = list.find(g => g.name === name);
  if (!target) throw(new Error(`Cannot delete "${name}" that doesn't exist`));
  if (target.readonly) throw(new Error(`Cannot delete readonly "${name}"`));
  setGraphList(list.filter(g => g.name !== name));
  localStorage.removeItem(makeStoredGraphName(name));
}

const initializeBrowserStorage = () => {
  if (!localStorage.getItem(GRAPH_LIST)) {
    localStorage.setItem(GRAPH_LIST, JSON.stringify(INITIAL_GRAPH_LIST));
    for (const [name, content] of Object.entries(graphMap)) {
      saveGraph(name, content, true); // force overwrite
    }
  }
}

export default {
  getGraphList,
  loadGraph,
  saveGraph,
  deleteGraph,
  VALID_GRAPH_NAME_PATTERN,
  exportGraph,
};
