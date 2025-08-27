const cityData = {
  "Delhi": [
    ["India Gate", "Rashtrapati Bhavan"],
    ["India Gate", "Connaught Place"],
    ["Rashtrapati Bhavan", "Parliament House"],
    ["Parliament House", "Connaught Place"],
    ["Connaught Place", "Jama Masjid"],
    ["Jama Masjid", "Red Fort"],
    ["Red Fort", "Chandni Chowk"],
    ["Chandni Chowk", "Humayun's Tomb"],
    ["Humayun's Tomb", "Lotus Temple"],
    ["Qutub Minar", "Lotus Temple"],
    ["Qutub Minar", "Hauz Khas Village"],
    ["Hauz Khas Village", "Safdarjung Tomb"],

    // Extra connections
    ["India Gate", "Humayun's Tomb"],
    ["Connaught Place", "Red Fort"],
    ["Lotus Temple", "Safdarjung Tomb"]
  ],

  "Mumbai": [
    ["Gateway of India", "Taj Mahal Palace Hotel"],
    ["Gateway of India", "Colaba Causeway"],
    ["Colaba Causeway", "Marine Drive"],
    ["Marine Drive", "Girgaon Chowpatty"],
    ["Girgaon Chowpatty", "Haji Ali Dargah"],
    ["Haji Ali Dargah", "Siddhivinayak Temple"],
    ["Siddhivinayak Temple", "Worli Sea Link"],
    ["Worli Sea Link", "Bandra Fort"],
    ["Bandra Fort", "Mount Mary Church"],
    ["Bandra Fort", "Juhu Beach"],
    ["Juhu Beach", "ISKCON Temple"],

    // Cross-links
    ["Gateway of India", "Marine Drive"],
    ["Colaba Causeway", "Juhu Beach"],
    ["Marine Drive", "Siddhivinayak Temple"]
  ],

  "Bangalore": [
    ["Cubbon Park", "Vidhana Soudha"],
    ["Cubbon Park", "MG Road"],
    ["MG Road", "Commercial Street"],
    ["Commercial Street", "Lalbagh"],
    ["Lalbagh", "Basavanagudi Bull Temple"],
    ["Basavanagudi Bull Temple", "ISKCON Temple"],
    ["ISKCON Temple", "Orion Mall"],
    ["Orion Mall", "Bangalore Palace"],
    ["Bangalore Palace", "Hebbal Lake"],
    ["Hebbal Lake", "Manyata Tech Park"],

    // Cross-links
    ["Cubbon Park", "Lalbagh"],
    ["MG Road", "Bangalore Palace"],
    ["Lalbagh", "Hebbal Lake"]
  ],

  "Chennai": [
    ["Marina Beach", "San Thome Church"],
    ["San Thome Church", "Kapaleeshwarar Temple"],
    ["Kapaleeshwarar Temple", "Mylapore Tank"],
    ["Mylapore Tank", "Fort St. George"],
    ["Fort St. George", "Egmore Museum"],
    ["Egmore Museum", "Valluvar Kottam"],
    ["Valluvar Kottam", "Guindy National Park"],
    ["Guindy National Park", "Phoenix Mall"],
    ["Phoenix Mall", "Velachery"],
    ["Velachery", "Mahabalipuram (Shore Temple)"],

    // Cross-links
    ["Marina Beach", "Kapaleeshwarar Temple"],
    ["Egmore Museum", "Guindy National Park"],
    ["Fort St. George", "Velachery"]
  ],

  "Hyderabad": [
    ["Charminar", "Mecca Masjid"],
    ["Charminar", "Laad Bazaar"],
    ["Laad Bazaar", "Chowmahalla Palace"],
    ["Chowmahalla Palace", "Salar Jung Museum"],
    ["Salar Jung Museum", "Birla Mandir"],
    ["Birla Mandir", "Hussain Sagar Lake"],
    ["Hussain Sagar Lake", "NTR Gardens"],
    ["NTR Gardens", "Necklace Road"],
    ["Golconda Fort", "Qutb Shahi Tombs"],
    ["Golconda Fort", "Ramoji Film City"],
    ["Ramoji Film City", "Falaknuma Palace"],

    // Cross-links
    ["Charminar", "Salar Jung Museum"],
    ["Golconda Fort", "Hussain Sagar Lake"],
    ["Birla Mandir", "Falaknuma Palace"]
  ]
};

let graph = null;
let network = null;
let allEdges = [];
let allNodes = [];

// Loads landmarks of the selected city and prepares the graph
function loadLandmarks() {
  const city = document.getElementById("city").value;
  const edges = cityData[city];

  graph = new Graph();
  let landmarks = new Set();

  // Build graph and collect all unique landmarks
  edges.forEach(([u, v]) => {
    graph.addEdge(u, v);
    landmarks.add(u);
    landmarks.add(v);
  });

  // Populate dropdowns for start and goal
  const startSel = document.getElementById("start");
  const goalSel = document.getElementById("goal");
  startSel.innerHTML = "";
  goalSel.innerHTML = "";

  Array.from(landmarks).forEach(lm => {
    let opt1 = document.createElement("option");
    opt1.value = lm;
    opt1.innerText = lm;
    startSel.appendChild(opt1);

    let opt2 = document.createElement("option");
    opt2.value = lm;
    opt2.innerText = lm;
    goalSel.appendChild(opt2);
  });

  // Show the selectors and clear result
  document.getElementById("selectors").style.display = "block";
  document.getElementById("result").innerText = "";

  drawGraph(Array.from(landmarks), edges);
}

// Finds all shortest paths using BFS and displays them
function findPath() {
  const start = document.getElementById("start").value;
  const goal = document.getElementById("goal").value;

  const paths = graph.bfsAllPaths(start, goal);

  if (paths) {
    let resultHTML = `✅ Shortest paths (${paths[0].length - 1} stops):<br>`;
    paths.forEach((p, i) => {
      resultHTML += `${i + 1}. ${p.join(" → ")}<br>`;
    });
    document.getElementById("result").innerHTML = resultHTML;
    highlightPaths(paths);
  } else {
    document.getElementById("result").innerText =
      `❌ No path found between ${start} and ${goal}`;
  }
}

// Draws the graph using vis.js
function drawGraph(nodes, edges) {
  allNodes = nodes.map(n => ({ id: n, label: n }));
  allEdges = edges.map(([u, v]) => ({ from: u, to: v, color: { color: "#aaa" } }));

  const container = document.getElementById("mynetwork");
  const data = { nodes: new vis.DataSet(allNodes), edges: new vis.DataSet(allEdges) };
  const options = {
    nodes: {
      shape: "dot",
      size: 22,
      color: { background: "#007bff", border: "#004080" },
      font: { color: "white", size: 16 }
    },
    edges: { width: 2, smooth: true },
    physics: { enabled: true },
  };
  network = new vis.Network(container, data, options);
}

// Highlights all shortest paths in different colors
function highlightPaths(paths) {
  const colors = ["red", "green", "orange", "purple", "blue"];

  // Collect which edges belong to which paths
  const edgeStyleMap = new Map();

  paths.forEach((path, idx) => {
    for (let i = 0; i < path.length - 1; i++) {
      const nodeA = path[i];
      const nodeB = path[i + 1];

      // Make sure edge key works for undirected graph
      const key = [nodeA, nodeB].sort().join("-");

      edgeStyleMap.set(key, {
        color: { color: colors[idx % colors.length] },
        width: 4,
      });
    }
  });

  // Apply new styles only to highlighted edges
  const updatedEdges = allEdges.map(edge => {
    const key = [edge.from, edge.to].sort().join("-");
    const style = edgeStyleMap.get(key);

    if (style) {
      return { ...edge, ...style };
    }
    return edge;
  });

  // Refresh network with updated styles
  const data = {
    nodes: new vis.DataSet(allNodes),
    edges: new vis.DataSet(updatedEdges)
  };
  network.setData(data);
}
