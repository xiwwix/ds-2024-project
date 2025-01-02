console.log("betweenness_centrality.js加载完成");

/**
 * 使用 BFS 计算图中所有节点的介数中心性
 * @param {object} graphData - 图数据 { nodes: [], edges: [] }
 * @returns {Array} 返回按介数中心性排序的节点列表
 */

function BetweennessCentrality(graphData) {
    const adjacencyList = {};
    graphData.nodes.forEach(node => {
        adjacencyList[node.data.id] = [];
    });

    graphData.edges.forEach(edge => {
        adjacencyList[edge.data.source].push(edge.data.target);
        adjacencyList[edge.data.target].push(edge.data.source);
    });

    const centrality = {};
    graphData.nodes.forEach(node => {
        centrality[node.data.id] = 0.0;
    });

    graphData.nodes.forEach(source => {
        const s = source.data.id;

        const stack = [];
        const sigma = {};
        const dist = {};
        const prenodes = {};
        const delta = {};

        graphData.nodes.forEach(node => {
            const id = node.data.id;
            sigma[id] = 0;
            dist[id] = -1;
            prenodes[id] = [];
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
                    prenodes[w].push(v);
                }
            });
        }

        while (stack.length > 0) {
            const w = stack.pop();
            prenodes[w].forEach(v => {
                delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
            });
            if (w !== s) {
                centrality[w] += delta[w];
            }
        }
    });

    const result = graphData.nodes.map(node => ({
        id: node.data.id,
        label: node.data.label,
        centrality: centrality[node.data.id]
    }));

    result.sort((a, b) => b.centrality - a.centrality);
    // console.log("BC Result:", result);
    return result;
}

window.BetweennessCentrality = BetweennessCentrality;
