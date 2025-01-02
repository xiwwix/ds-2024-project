console.log("betweenness_centrality.js加载完成");

/**
 * 使用 BFS 计算图中所有节点的介数中心性
 * @param {object} graphData - 图数据 { nodes: [], edges: [] }
 * @returns {Array} 返回按介数中心性排序的节点列表
 */

function BetweennessCentrality(graphData) {
    console.log("BetweennessCentrality called with:", graphData);

    const adjacencyList = {};
    graphData.nodes.forEach(node => {
        adjacencyList[node.data.id] = [];
    });

    graphData.edges.forEach(edge => {
        adjacencyList[edge.data.source].push(edge.data.target);
        adjacencyList[edge.data.target].push(edge.data.source); // 无向图
    });

    const centrality = {};
    graphData.nodes.forEach(node => {
        centrality[node.data.id] = 0.0; // 初始化介数中心性
    });

    // 对每个节点执行 BFS 计算
    graphData.nodes.forEach(source => {
        const s = source.data.id;

        // BFS 变量初始化
        const stack = [];
        const sigma = {};
        const dist = {};
        const predecessors = {};
        const delta = {};

        graphData.nodes.forEach(node => {
            const id = node.data.id;
            sigma[id] = 0;
            dist[id] = -1;
            predecessors[id] = [];
            delta[id] = 0;
        });

        sigma[s] = 1;
        dist[s] = 0;
        const queue = [s];

        while (queue.length > 0) {
            const v = queue.shift();
            stack.push(v);

            adjacencyList[v].forEach(w => {
                if (dist[w] < 0) {
                    queue.push(w);
                    dist[w] = dist[v] + 1;
                }
                if (dist[w] === dist[v] + 1) {
                    sigma[w] += sigma[v];
                    predecessors[w].push(v);
                }
            });
        }

        while (stack.length > 0) {
            const w = stack.pop();
            predecessors[w].forEach(v => {
                delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
            });
            if (w !== s) {
                centrality[w] += delta[w];
            }
        }
    });

    // 结果排序
    const result = graphData.nodes.map(node => ({
        id: node.data.id,
        label: node.data.label,
        centrality: centrality[node.data.id]
    }));

    result.sort((a, b) => b.centrality - a.centrality);
    console.log("Betweenness Centrality Result:", result);
    return result;
}

// 挂载到全局对象
window.BetweennessCentrality = BetweennessCentrality;
