console.log("cut_vertex.js is loaded! Ready to calculate cut vertices.");

/**
 * 使用 Tarjan 算法计算图中的割点
 * @param {Object} graphData 图数据 { nodes: [], edges: [] }
 * @returns {Array} 返回所有割点的 ID 列表
 */
function CutVertex(graphData) {
    console.log("CutVertex called with:", graphData);

    const n = graphData.nodes.length;
    const adj = {}; // 邻接表
    const dfn = {};
    const low = {};
    const vis = {};
    const isCutVertex = {};
    let idx = 0; // 时间戳

    // 初始化邻接表和数据
    graphData.nodes.forEach(node => {
        adj[node.data.id] = [];
        dfn[node.data.id] = -1;
        low[node.data.id] = -1;
        vis[node.data.id] = false;
        isCutVertex[node.data.id] = false;
    });

    graphData.edges.forEach(edge => {
        adj[edge.data.source].push(edge.data.target);
        adj[edge.data.target].push(edge.data.source); // 无向图
    });

    /**
     * Tarjan 算法主逻辑
     * @param {string|number} u 当前节点
     * @param {string|number} parent 父节点
     */
    function tarjan(u, parent) {
        vis[u] = true;
        dfn[u] = low[u] = ++idx;
        let children = 0;

        adj[u].forEach(v => {
            if (v === parent) return; // 跳过父节点

            if (!vis[v]) {
                children++;
                tarjan(v, u);
                low[u] = Math.min(low[u], low[v]);

                // 判断割点条件
                if (parent !== null && low[v] >= dfn[u]) {
                    isCutVertex[u] = true;
                }

                // 根节点的特判
                if (parent === null && children > 1) {
                    isCutVertex[u] = true;
                }
            } else {
                low[u] = Math.min(low[u], dfn[v]);
            }
        });
    }

    // 遍历所有节点，处理未访问节点
    graphData.nodes.forEach(node => {
        const id = node.data.id;
        if (!vis[id]) {
            tarjan(id, null);
        }
    });

    // 收集结果
    const result = graphData.nodes
        .filter(node => isCutVertex[node.data.id])
        .map(node => node.data.id);

    console.log("Cut Vertices:", result);
    return result;
}

// 将函数挂载到全局对象
window.CutVertex = CutVertex;
