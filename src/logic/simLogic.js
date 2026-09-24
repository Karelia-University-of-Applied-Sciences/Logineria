import { updateInputNodePower, updateOutputNodePower } from "./nodeRepository";

/**
 * Updates the value of an INPUT logic gate node.
 * @param {*} id - The ID of the node to update.
 * @param {Object} state - The current state of the application.
 * @param {integer} value - The new value for the node's input. Note: use only 0 or 1 as values.
 */
export function updateInput(id, state, value){

    // Find the node with the given id
    const node = state.nodes.find((n) => n.id === id);
    
    // If node exists, update its input value
    if(node){
        const updatedNode = {
            ...node,
            node: {
                inputs: {in1: value}
            }
        }

        // Replace old node with updated node in state
        state.setNodes([...state.nodes.filter((n) => n.id !== id), updatedNode]);
    }
}

/**
 * Runs the simulation for the given state.
 * @param {Object} state - The current state of the application.
 */
export async function runSim(state){

    if(state.nodes.length === 0 || state.wires.length === 0){
        console.log("No nodes or wires to simulate.");
        return;
    }

    const wires = state.wires.concat();
    const nodes = state.nodes.concat();

    // Gets all INPUT nodes and updates the values of connected wires and nodes based on their connections.
    const inputs = nodes.filter((node) => node.type === "INPUT");

    if(inputs.length > 0){
        inputs.forEach((input) => {
            const connected = calculateConnections(wires, nodes, input);

            let inputValue = input.node.inputs.in1;

            if(connected.nodes.length !== 0){
                connected.nodes.forEach((node) => {
                    if(node.type === "INPUT"){
                        if(node.node.inputs.in1 === 1){
                            inputValue = 1;
                        }
                    }
                });
            }

            if(connected.wires.length !== 0){
                connected.wires.forEach((wire) => {
                    const index = wires.findIndex((w) => w.id === wire.id);
                    
                    const updatedWire = {
                        ...wire,
                        value: inputValue
                    }

                    wires.splice(index, 1, updatedWire);
                });            
            }

            if(connected.nodes.length !== 0){
                connected.nodes.forEach((node) => {
                    if(node.type !== "INPUT" && node.type !== "OUTPUT" && node.type !== "NOT"){
                        const wiresConnectedToIn1 = wires.filter((wire) => (wire.endId === node.id && wire.endPort === "in1") || (wire.startId === node.id && wire.startPort === "in1"));
                        const wiresConnectedToIn2 = wires.filter((wire) => (wire.endId === node.id && wire.endPort === "in2") || (wire.startId === node.id && wire.startPort === "in2"));

                        let in1Value = 0;
                        let in2Value = 0;

                        if(wiresConnectedToIn1.length > 0){
                            wiresConnectedToIn1.forEach((wire) => {
                                if(wire.value === 1){
                                    in1Value = 1;
                                }
                            });
                        }

                        if(wiresConnectedToIn2.length > 0){
                            wiresConnectedToIn2.forEach((wire) => {
                                if(wire.value === 1){
                                    in2Value = 1;
                                }
                            });
                        }

                        const updatedNode = updateInputNodePower(node, { in1: in1Value, in2: in2Value });

                        const index = nodes.findIndex((n) => n.id === node.id);
                        nodes.splice(index, 1, updatedNode);
                    } else if(node.type === "NOT"){
                        const wiresConnectedToIn1 = wires.filter((wire) => (wire.endId === node.id && wire.endPort === "in1") || (wire.startId === node.id && wire.startPort === "in1"));

                        let in1Value = 0;

                        if(wiresConnectedToIn1.length > 0){
                            wiresConnectedToIn1.forEach((wire) => {
                                if(wire.value === 1){
                                    in1Value = 1;
                                }
                            });
                        }

                        const updatedNode = updateInputNodePower(node, { in1: in1Value });

                        const index = nodes.findIndex((n) => n.id === node.id);
                        nodes.splice(index, 1, updatedNode);
                    }
                });
            }
        });
    }
    
    // Continues to propagate the values throught the circuit untill all logic gates have been updated.
    if(nodes.length > 0){
        const nodesQueue = nodes.filter((node) => node.type !== "INPUT" && node.type !== "OUTPUT");

        const maxIterations = 1000; // Set a maximum number of iterations to prevent infinite loops
        let iterations = 0;
        while(nodesQueue.length > 0 && iterations < maxIterations){
            iterations++;
            
            const node = nodesQueue.shift();
            const connected = calculateConnections(wires, nodes, node);

            if(connected.wires.length !== 0){
                connected.wires.forEach((wire) => {
                    const index = wires.findIndex((w) => w.id === wire.id);
                    
                    const updatedWire = {
                        ...wire,
                        value: node.node.outputs.out
                    };

                    wires.splice(index, 1, updatedWire);
                });
            }

            if(connected.nodes.length !== 0){
                connected.nodes.forEach((connectedNode) => {
                    if(connectedNode.type !== "INPUT" && connectedNode.type !== "OUTPUT" && connectedNode.type !== "NOT"){
                        const wiresConnectedToIn1 = wires.filter((wire) => (wire.endId === connectedNode.id && wire.endPort === "in1") || (wire.startId === connectedNode.id && wire.startPort === "in1"));
                        const wiresConnectedToIn2 = wires.filter((wire) => (wire.endId === connectedNode.id && wire.endPort === "in2") || (wire.startId === connectedNode.id && wire.startPort === "in2"));

                        let in1Value = 0;
                        let in2Value = 0;

                        if(wiresConnectedToIn1.length > 0){
                            wiresConnectedToIn1.forEach((wire) => {
                                if(wire.value === 1){
                                    in1Value = 1;
                                }
                            });
                        }

                        if(wiresConnectedToIn2.length > 0){
                            wiresConnectedToIn2.forEach((wire) => {
                                if(wire.value === 1){
                                    in2Value = 1;
                                }
                            });
                        }

                        const updatedNode = updateInputNodePower(connectedNode, { in1: in1Value, in2: in2Value });

                        const index = nodes.findIndex((n) => n.id === connectedNode.id);
                        nodes.splice(index, 1, updatedNode);

                        if(updatedNode.node.outputs.out !== connectedNode.node.outputs.out){
                            nodesQueue.push(updatedNode);
                        }
                    } else if(connectedNode.type === "NOT"){
                        const wiresConnectedToIn1 = wires.filter((wire) => (wire.endId === connectedNode.id && wire.endPort === "in1") || (wire.startId === connectedNode.id && wire.startPort === "in1"));

                        let in1Value = 0;

                        if(wiresConnectedToIn1.length > 0){
                            wiresConnectedToIn1.forEach((wire) => {
                                if(wire.value === 1){
                                    in1Value = 1;
                                }
                            });
                        }
                        const updatedNode = updateInputNodePower(connectedNode, { in1: in1Value });

                        const index = nodes.findIndex((n) => n.id === connectedNode.id);
                        nodes.splice(index, 1, updatedNode);

                        if(updatedNode.node.outputs.out !== connectedNode.node.outputs.out){
                            nodesQueue.push(updatedNode);
                        }
                    }
                });
            }
        }
        
    }

    // Updates the OUTPUT nodes based on the values of the connected wires.
    const outputs = nodes.filter((node) => node.type === "OUTPUT");

    outputs.forEach((output) => {
        const connectedWires = wires.filter((wire) => wire.endId === output.id || wire.startId === output.id);

        const outputValue = connectedWires.some((wire) => wire.value === 1) ? 1 : 0;
        const updatedOutputNode = updateOutputNodePower(output, outputValue);

        const index = nodes.findIndex((n) => n.id === output.id);
        nodes.splice(index, 1, updatedOutputNode);
    });


    state.setNodes(nodes);
    state.setWires(wires);
}

/**
 * Calculates the connections of a given node, including connected wires and nodes.
 * @param {Array} wires - The array of all wires in the circuit.
 * @param {Array} nodes - The array of all nodes in the circuit.
 * @param {Object} node - The node for which to calculate connections.
 * @returns {Object} An object containing the connected wires and nodes.
 */
function calculateConnections(wires, nodes, node){

    const port = node.type === "INPUT" ? "in1" : "out";
    const queue = wires.filter((wire) =>
        (wire.startId === node.id && wire.startPort === port) ||
        (wire.endId === node.id && wire.endPort === port)
    );
    const visitedWires = new Set();
    const connections = [];

    const maxIterations = 1000; // Set a maximum number of iterations to prevent infinite loops
    let iterations = 0;
    while(queue.length > 0 && iterations < maxIterations){
        iterations++;

        const wire = queue.shift();

        if(visitedWires.has(wire.id)){
            continue;
        }

        visitedWires.add(wire.id);
        connections.push(wire);

        wires.forEach((connectedWire) => {
            if(connectedWire.startId === wire.id || connectedWire.endId === wire.id){
                queue.push(connectedWire);
            }

            if(wire.startPortType === "wire_port" || wire.endPortType === "wire_port"){
                const wiresStart = wires.filter((w) => w.id === wire.startId);
                const wiresEnd = wires.filter((w) => w.id === wire.endId);

                if(wiresStart.length > 0){

                    wiresStart.forEach((w) => {
                        if(!visitedWires.has(w.id)){

                            queue.push(w);
                        }

                    });
                }

                if(wiresEnd.length > 0){
                    
                    wiresEnd.forEach((w) => {    
                        if(!visitedWires.has(w.id)){

                            queue.push(w);
                        }
                    });
                }
            }
        });
    }

    const connectedNodes = nodes.filter((connectedNode) =>
        connections.some((wire) =>
            wire.startId === connectedNode.id || wire.endId === connectedNode.id
        )
    );

    return { wires: connections, nodes: connectedNodes };
}




