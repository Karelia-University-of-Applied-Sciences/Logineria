import { NODE_TYPES } from "./nodeTypes";

/**
 * Creates a new node of the specified type at the given position.
 * @param {string} type - The type of the node to create.
 * @param {Object} position - The position of the node.
 * @returns {Object} The newly created node.
 */
export function createNode(type, position){
    
    for (const [key, value] of Object.entries(NODE_TYPES)){
        if(key === type){
            const newNode = {
                type: key,
                id: crypto.randomUUID(),
                node: {...value },
                position: position
            }

            return newNode;
        }
    }
}

/**
 * Updates the properties of a node.
 * @param {Object} node - The node to update.
 * @returns {Object} The updated node.
 */
export function updateNode(node){

    const newNode = {
        type: node.type,
        id: node.id,
        node: { ...node.node},
        position: { x: node.x, y: node.y }
    }
    
    return newNode;
}

/**
 * Updates the power of an OUTPUT node.
 * @param {Object} node - The OUTPUT node to update.
 * @param {number} output - The new output value.
 * @returns {Object} The updated node.
 */
export function updateOutputNodePower(node, output){

    const newNode = {
        type: node.type,
        id: node.id,
        node: { outputs: { out: output } },
        position: node.position
    }

    return newNode;
}

/**
 * Updates the power of an INPUT node.
 * @param {Object} node - The INPUT node to update.
 * @param {Object} input - The new input values.
 * @returns {Object} The updated node.
 */
export function updateInputNodePower(node, input){

    const newNode = {
        type: node.type,
        id: node.id,
        node: { inputs: input, outputs: { out: evalOutput(node.type, input) } },
        position: node.position
    }

    return newNode;
}

/**
 * Evaluates the output of a node based on its type and input values.
 * @param {string} type - The type of the node.
 * @param {Object} inputs - The input values.
 * @returns {number} The output value.
 */
function evalOutput(type, inputs){

    switch(type){
        case "AND":
            if(inputs.in1 === 1 && inputs.in2 === 1){
                return 1;
            }
            else {
                return 0;
            }
        case "OR":
            if(inputs.in1 === 1 || inputs.in2 === 1){
                return 1;
            }
            else {
                return 0;
            }
        case "NOT":
            if(inputs.in1 === 0){
                return 1;
            }
            else {
                return 0;
            }
        case "NAND":
            if(inputs.in1 === 1 && inputs.in2 === 1){
                return 0;
            }
            else {
                return 1;
            }
        case "NOR":
            if(inputs.in1 === 1 || inputs.in2 === 1){
                return 0;
            }
            else {
                return 1;
            }
        case "XOR":
            if(inputs.in1 !== inputs.in2){
                return 1;
            }
            else {
                return 0;
            }
        case "XNOR":
            if(inputs.in1 === inputs.in2){
                return 1;
            }
            else {
                return 0;
            }
    }
}