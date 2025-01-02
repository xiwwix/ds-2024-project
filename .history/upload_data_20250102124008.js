
function parseAndDrawGraph(content, cy, graphData) {
    graphData.nodes = content.members.map(member => ({
        data: {
            id: member.id,
            label: member.name
        }
    }));

    graphData.edges = content.relationships.map(rel => ({
        data: {
            id: `edge${rel.source}-${rel.target}`,
            source: rel.source,
            target: rel.target,
            weight: rel.weight
        }
    }));

    cy.elements().remove();
    cy.add([...graphData.nodes, ...graphData.edges]);

    cy.layout({
        name: 'breadthfirst',
        directed: true,
        spacingFactor: 1.5,
        avoidOverlap: true
    }).run();

}

window.parseAndDrawGraph = parseAndDrawGraph;
