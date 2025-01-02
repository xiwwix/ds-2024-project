/**
 * 计算图中所有节点的度中心性
 * @param {object} graphData - 图数据 { nodes: [], edges: [] }
 * @returns {Array} 返回按度中心性排序的节点列表
 */
function DegreeCentrality(graphData) {
    console.log("DegreeCentrality called with:", graphData);

    const degrees = {};
    graphData.nodes.forEach(node => {
        degrees[node.data.id] = 0;
    });

    graphData.edges.forEach(edge => {
        degrees[edge.data.source]++;
        degrees[edge.data.target]++;
    });

    const result = graphData.nodes.map(node => ({
        id: node.data.id,
        label: node.data.label,
        degree: degrees[node.data.id]
    }));

    result.sort((a, b) => b.degree - a.degree);

    console.log("Degree Centrality Result:", result);
    return result;
}

window.DegreeCentrality = DegreeCentrality;
