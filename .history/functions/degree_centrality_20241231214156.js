console.log("degree_centrality.js is loaded! Ready to calculate degree centrality.");

/**
 * 计算图中所有节点的度中心性
 * @param {object} graphData - 图数据 { nodes: [], edges: [] }
 * @returns {Array} 返回按度中心性排序的节点列表
 */
function DegreeCentrality(graphData) {
    console.log("DegreeCentrality called with:", graphData);

    // 初始化度数统计
    const degrees = {};
    graphData.nodes.forEach(node => {
        degrees[node.data.id] = 0; // 初始度为0
    });

    // 遍历边，计算度
    graphData.edges.forEach(edge => {
        degrees[edge.data.source]++;
        degrees[edge.data.target]++; // 无向图
    });

    // 构建结果列表
    const result = graphData.nodes.map(node => ({
        id: node.data.id,
        label: node.data.label,
        degree: degrees[node.data.id]
    }));

    // 按度数降序排序
    result.sort((a, b) => b.degree - a.degree);

    console.log("Degree Centrality Result:", result);
    return result;
}

// 将函数挂载到全局对象，供 HTML 页面直接调用
window.DegreeCentrality = DegreeCentrality;
