// Define a Graph class using an adjacency list representation
class Graph {
  constructor() {
    // Initialize an empty adjacency list
    this.adjList = {};
  }

  // Adds an undirected edge between node u and node v
  addEdge(u, v) {
    // Create adjacency list entries if they don't exist
    if (!this.adjList[u]) this.adjList[u] = [];
    if (!this.adjList[v]) this.adjList[v] = [];

    // Add each node to the other's adjacency list
    this.adjList[u].push(v);
    this.adjList[v].push(u);
  }

  /**
   * Finds all shortest paths from `start` node to `goal` node using BFS.
   * Returns an array of all shortest paths (each path is an array of nodes),
   * or null if no path exists.
   */
  bfsAllPaths(start, goal) {
    // If either the start or goal node doesn't exist in the graph, return null
    if (!this.adjList[start] || !this.adjList[goal]) return null;

    // Frontier stores paths to be explored; starts with a single path containing the start node
    let frontier = [[start]];

    // Set to keep track of fully explored nodes (to avoid cycles)
    let explored = new Set();

    // Array to store all shortest paths found
    let shortestPaths = [];

    // Once the shortest path length is known, all paths must match it
    let foundLevel = null;

    // Loop until there are no more paths to explore
    while (frontier.length > 0) {
      // Remove the shallowest path (FIFO behavior of a queue)
      let path = frontier.shift();

      // Get the last node in the current path
      let node = path[path.length - 1];

      // Check if the goal has been reached
      if (node === goal) {
        // If this is the first time reaching the goal, record the path length
        if (foundLevel === null) {
          foundLevel = path.length;
        }

        // If current path matches the shortest length, add to result
        if (path.length === foundLevel) {
          shortestPaths.push(path);
        }

        // Skip further processing for this path (we don’t extend goal paths)
        continue;
      }

      // Mark the current node as explored
      explored.add(node);

      // Explore all neighbors of the current node
      for (let neighbor of this.adjList[node] || []) {
        // Skip neighbor if it has already been explored
        // Also avoid cycles by not revisiting nodes already in the current path
        if (!explored.has(neighbor) && !path.includes(neighbor)) {
          // Create a new path extended by the neighbor and enqueue it
          frontier.push([...path, neighbor]);
        }
      }
    }

    // If at least one shortest path was found, return them; otherwise, return null
    return shortestPaths.length > 0 ? shortestPaths : null;
  }
}
