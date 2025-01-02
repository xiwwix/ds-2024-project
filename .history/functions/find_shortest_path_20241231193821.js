console.log("find_shortest_path.js is loaded! Ready to find shortest paths.");

/**
 * 使用堆优化的 Dijkstra 算法，计算从 startId 到 endId 的最短路径
 * @param {string|number} startId 起点ID
 * @param {string|number} endId   终点ID
 * @param {object} graphData      { nodes: [], edges: [] }
 * @returns {{ path: Array, cost: number }}  如果无法到达则 path 为空数组
 */
function findShortestPath(startId, endId, graphData) {
    console.log("findShortestPath called with:", startId, endId, graphData);

    // 1. 创建邻接表 adjacencyList
    const adjacencyList = {};
    const weights = {}; // 存储边的权重

    // 初始化所有节点为键，值为空数组
    graphData.nodes.forEach(node => {
        adjacencyList[node.data.id] = [];
    });

    // 填充边关系和权重
    graphData.edges.forEach(edge => {
        const s = edge.data.source;
        const t = edge.data.target;
        const w = edge.data.weight || 1; // 默认权重为1
        adjacencyList[s].push({ node: t, weight: w });
        // 如果是无向图，请同时加上反向边:
        // adjacencyList[t].push({ node: s, weight: w });
    });

    // 2. Dijkstra 算法实现
    const distances = {}; // 起点到各点的距离
    const parents = {};   // 用于回溯路径
    const visited = new Set(); // 标记已访问的节点

    // 优先队列（最小堆）
    const priorityQueue = [];
    function push(node, cost) {
        priorityQueue.push({ node, cost });
        priorityQueue.sort((a, b) => a.cost - b.cost); // 保持最小堆
    }
    function pop() {
        return priorityQueue.shift();
    }

    // 初始化
    graphData.nodes.forEach(node => {
        distances[node.data.id] = Infinity; // 设置初始距离为无穷大
        parents[node.data.id] = null;      // 父节点为空
    });
    distances[startId] = 0; // 起点到自身的距离为 0
    push(startId, 0);       // 将起点加入队列

    while (priorityQueue.length > 0) {
        const { node: current, cost: currentCost } = pop();

        if (visited.has(current)) continue; // 如果节点已访问，跳过
        visited.add(current);

        // 如果找到终点，构建路径并返回结果
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

        // 遍历邻居节点
        adjacencyList[current].forEach(({ node: neighbor, weight }) => {
            const newCost = currentCost + weight;
            if (newCost < distances[neighbor]) { // 如果找到更短路径
                distances[neighbor] = newCost;   // 更新距离
                parents[neighbor] = current;    // 更新父节点
                push(neighbor, newCost);        // 将邻居加入队列
            }
        });
    }

    // 如果没有找到路径
    console.warn(`No path found from ${startId} to ${endId}`);
    return { path: [], cost: 0 };
}

// 将函数挂载到全局 window 对象，确保能在 shortest_path.html 里直接调用
window.findShortestPath = findShortestPath;
