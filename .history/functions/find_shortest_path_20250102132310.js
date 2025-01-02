/**
 * 使用堆优化的 Dijkstra 算法，计算从 startId 到 endId 的最短路径
 * @param {string|number} startId 起点ID
 * @param {string|number} endId   终点ID
 * @param {object} graphData      { nodes: [], edges: [] }
 * @returns {{ path: Array, cost: number }}  如果无法到达则 path 为空数组
 */
function findShortestPath(startId, endId, graphData) {
    const adjacencyList = {};
    const weights = {};

    graphData.nodes.forEach(node => {
        adjacencyList[node.data.id] = [];
    });

    graphData.edges.forEach(edge => {
        const s = edge.data.source;
        const t = edge.data.target;
        const originalWeight = edge.data.weight || 1;
        const transformedWeight = 5 - originalWeight;
        adjacencyList[s].push({ node: t, weight: transformedWeight });
        adjacencyList[t].push({ node: s, weight: transformedWeight });
    });

    const distances = {};
    const parents = {};
    const visited = new Set();
    const priorityQueue = [];

    function push(node, cost) {
        priorityQueue.push({ node, cost });
        priorityQueue.sort((a, b) => a.cost - b.cost);
    }
    function pop() {
        return priorityQueue.shift();
    }

    graphData.nodes.forEach(node => {
        distances[node.data.id] = Infinity;
        parents[node.data.id] = null;
    });
    distances[startId] = 0;
    push(startId, 0);

    while (priorityQueue.length > 0) {
        const { node: current, cost: currentCost } = pop();

        if (visited.has(current)) continue;
        visited.add(current);

        if (current === endId) {
            const path = [];
            let p = current;
            while (p !== null) {
                path.unshift(p);
                p = parents[p];
            }
            const cost = distances[endId];
            console.log("Shortest path found:", path, "cost =", cost);
            return { path, cost };
        }

        adjacencyList[current].forEach(({ node: neighbor, weight }) => {
            const newCost = currentCost + weight;
            if (newCost < distances[neighbor]) {
                distances[neighbor] = newCost;
                parents[neighbor] = current;
                push(neighbor, newCost);
            }
        });
    }

    console.warn(`No path found from ${startId} to ${endId}`);
    return { path: [], cost: 0 };
}

window.findShortestPath = findShortestPath;
