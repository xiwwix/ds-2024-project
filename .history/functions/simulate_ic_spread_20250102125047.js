console.log("simulate_ic_spread.js is loaded! Ready for IC Spread Simulation.");

let activatedNodes = new Set();
let activeNodes = [];
let states = {};
let graphDataCache = null;
let lastActiveNodes = [];

function simulateICSpread(startId, steps, graphData) {
    if (!graphDataCache) graphDataCache = graphData;
    if (activatedNodes.size === 0) {
        graphDataCache.nodes.forEach(node => {
            states[node.data.id] = 0;
        });
        states[startId] = 1;
        activatedNodes.add(startId);
        activeNodes = [startId];
        lastActiveNodes = [startId];
    }

    const newActive = [];
    const edges = graphDataCache.edges;

    for (let step = 0; step < steps; step++) {
        activeNodes.forEach(nodeId => {
            const neighbors = edges.filter(e => e.data.source === nodeId || e.data.target === nodeId);
            neighbors.forEach(edge => {
                const neighborId = edge.data.source === nodeId ? edge.data.target : edge.data.source;
                if (states[neighborId] === 0 && !activatedNodes.has(neighborId)) {
                    const weight = edge.data.weight || 1;
                    const probability = Math.min(0.2 * weight, 1.0);
                    if (Math.random() < probability) {
                        states[neighborId] = 1;
                        newActive.push(neighborId);
                        activatedNodes.add(neighborId);
                    }
                }
            });
        });

        activeNodes = [...newActive];
        lastActiveNodes = [...newActive];
        newActive.length = 0;

        updateIC(activatedNodes, lastActiveNodes, startId);
    }

    return activatedNodes;
}

function updateIC(activatedNodes, currentActive, startId) {
    const cy = window.cy;
    cy.nodes().forEach(node => {
        const nodeId = node.id();
        if (nodeId === startId) node.style('background-color', 'red');
        else if (currentActive.includes(nodeId)) node.style('background-color', 'violet');
        else if (activatedNodes.has(nodeId)) node.style('background-color', 'deeppink');
        else node.style('background-color', 'rgb(255, 205, 113)');
    });
}

function resetSimulation() {
    activatedNodes.clear();
    activeNodes = [];
    states = {};
    lastActiveNodes = [];
    graphDataCache = null;

    const cy = window.cy;
    cy.nodes().style('background-color', 'rgb(255, 205, 113)');
    cy.style().update();
}
