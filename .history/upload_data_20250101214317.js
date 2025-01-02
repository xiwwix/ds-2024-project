// upload_data.js (放在根目录)

// 定义 parseAndDrawGraph 函数
function parseAndDrawGraph(content, cy, graphData) {
    // 构建 graphData.nodes
    graphData.nodes = content.members.map(member => ({
        data: {
            id: member.id,
            label: member.name
        }
    }));

    // 构建 graphData.edges
    graphData.edges = content.relationships.map(rel => ({
        data: {
            id: `edge${rel.source}-${rel.target}`,
            source: rel.source,
            target: rel.target,
            weight: rel.weight
        }
    }));

    // 清空 Cytoscape 元素并添加新数据
    cy.elements().remove();
    cy.add([...graphData.nodes, ...graphData.edges]);

    // 重新布局
    cy.layout({
        name: 'breadthfirst',
        directed: true,
        spacingFactor: 1.5,
        avoidOverlap: true
    }).run();

    console.log("Graph updated with new data");
}

// 将函数挂载到全局 window 对象，供外部调用
window.parseAndDrawGraph = parseAndDrawGraph;
