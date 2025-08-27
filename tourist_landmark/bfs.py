from collections import deque

class Graph:
    def __init__(self):
        # adjacency list representation of the graph
        self.adj_list = {}

    def add_edge(self, u, v):
        """Adds an undirected edge between u and v"""
        if u not in self.adj_list:
            self.adj_list[u] = []
        if v not in self.adj_list:
            self.adj_list[v] = []

        # add both ways since the graph is undirected
        self.adj_list[u].append(v)
        self.adj_list[v].append(u)

    def bfs_all_paths(self, start, goal):
        """
        Finds all shortest paths from start to goal using BFS.
        Returns a list of shortest paths (each path is a list of nodes),
        or None if no path exists.
        """
        # check if start and goal exist
        if start not in self.adj_list or goal not in self.adj_list:
            return None

        # queue of paths to explore
        frontier = deque([[start]])

        # set of explored nodes
        explored = set()

        # stores all shortest paths
        shortest_paths = []
        found_level = None  # shortest path length (once found)

        while frontier:
            # get the shallowest path
            path = frontier.popleft()
            node = path[-1]

            # check if goal is reached
            if node == goal:
                if found_level is None:
                    found_level = len(path)

                if len(path) == found_level:
                    shortest_paths.append(path)

                # don’t expand paths beyond the goal
                continue

            explored.add(node)

            # explore neighbors
            for neighbor in self.adj_list.get(node, []):
                if neighbor not in explored and neighbor not in path:
                    new_path = path + [neighbor]
                    frontier.append(new_path)

        return shortest_paths if shortest_paths else None
