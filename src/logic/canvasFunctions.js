import { createNode, updateNode } from "../logic/nodeRepository.js";

/** 
* Function for handling selection of nodes and wires on the canvas.
* @param {Object} e - The event object from the canvas click event.
* @param {Object} state - The current state of the canvas, including selected objects and mode.
*/
export function selectObj (e, state){

    const obj = e.target.getParent().attrs;
    
    if(state.mode === "idle"){
        
        let nodeSelected = false;
        let wireSelected = false;

        for(const selection of state.selection){
            if(selection.id === obj.id && obj.type !== "WIRE"){
                nodeSelected = true;
            }

            if(selection.id === obj.id && obj.type === "WIRE"){
                wireSelected = true;
            }
        }

        if(nodeSelected){
            const updatedSelection = state.selection.filter((selection) => selection.id !== obj.id);
            state.setSelection(updatedSelection);
            
            return;

        } else if (wireSelected){
            const updatedSelection = state.selection.filter((selection) => selection.id !== obj.id);
            state.setSelection(updatedSelection);

            return;
        }
        
        state.setSelection([...state.selection, obj]);
    }
}

/**
 * Changes the image of a node on the canvas based on its selection state.
 * If the node is selected, it will display the selected image; otherwise, it will display the original image.
 * @param {Object} e - The event object from the canvas click event.
 * @param {Object} set - An object containing the original and selected images.
 * @param {boolean} selected - A boolean indicating whether the object is currently selected.
 */
export const changeImage = (e, set, selected) => {
    e.target.image(set.selectedImage);
    
    if(selected){
        e.target.image(set.image);       
    }
}

export const changeWireMode = (state, ref) => {
    if(state.mode === "WIRE"){
        ref.current.getChildren().forEach((child) => {
            
            if(child.attrs.name === "port"){
                child.fill("white");
                child.stroke("black");
                child.strokeWidth(1);
            }
        });
    }

    if(state.mode !== "WIRE"){
        ref.current.getChildren().forEach((child) => {
            
            if(child.attrs.name === "port"){
                child.fill("transparent");
                child.stroke("transparent");
                child.strokeWidth(0);
            }
        });
    }
}

/**
 * Adds a new node to the canvas.
 * @param {Object} e - The event object from the canvas click event.
 * @param {Object} state - The current state of the canvas, including selected objects and mode.
 */
export function addNode(e, state){

    // Adds a new logic gate node to the canvas at the mouse pointer position, then returns to idle mode.
    if(state.mode !== "idle" && state.mode !== "WIRE"){
        const position = e.target.getPointerPosition();
        const newPosition = { x: position.x - 30, y: position.y - 20 }; // Adjusts the position to center the node on the mouse pointer.
        const newNode = createNode(state.mode, newPosition);

        state.setNodes([...state.nodes, newNode]);
        state.setMode("idle");
    }

}


/**
 * Updates the position of a node on the canvas.
 * @param {Object} e - The event object from the canvas click event.
 * @param {Object} state - The current state of the canvas, including selected objects and mode.
 */
export function updateNodePosition(e, state){
    
    const data = e.target.attrs;
    const updatedNode = updateNode(data);
    
    const nodeList = state.nodes.filter((i) => i.id !== e.target.attrs.id);
    state.setNodes([...nodeList, updatedNode]);

    // Moving a logic gate node also requires recalculating every wire connected to it.
    if(state.wires.length > 0){
        updateWirePosition(e, state);
    }

}

/**
 * Updates the position of a wire on the canvas.
 * @param {Object} e - The event object from the canvas click event.
 * @param {Object} state - The current state of the canvas, including selected objects and mode.
 */
export function updateWirePosition(e, state){

    let updatedWires = [];

    const nodeId = e.target.getAttrs().id;
    
    state.wires.forEach((wire) => {
        const connectedStartWire = state.wires.find((w) => w.id === wire.startId);
        const connectedEndWire = state.wires.find((w) => w.id === wire.endId);
        const connectedStartNode = state.nodes.find((w) => w.id === wire.startId);
        const connectedEndNode = state.nodes.find((w) => w.id === wire.endId);

        if((connectedStartWire && connectedEndNode) && (connectedEndNode.id !== nodeId)){
            // Calculate the new wire port position based on the connected start wire and the end node's position.
            const wirePortPositionX = (connectedStartWire.wirePortPosition.x - wire.end.x) / 2 + wire.end.x; 
            const wirePortPositionY = (connectedStartWire.wirePortPosition.y - wire.end.y) / 2 + wire.end.y;
            const wirePortPosition = { x: wirePortPositionX, y: wirePortPositionY };

            const newWire = {
                ...wire,
                start: connectedStartWire.wirePortPosition,
                wirePortPosition: wirePortPosition
            }

            updatedWires = [...updatedWires.filter((w) => w.id !== wire.id), newWire];
        }

        if((connectedEndWire && connectedStartNode) && (connectedStartNode.id !== nodeId)){
            const wirePortPositionX = (wire.start.x - connectedEndWire.wirePortPosition.x) / 2 + connectedEndWire.wirePortPosition.x;
            const wirePortPositionY = (wire.start.y - connectedEndWire.wirePortPosition.y) / 2 + connectedEndWire.wirePortPosition.y;
            const wirePortPosition = { x: wirePortPositionX, y: wirePortPositionY };

            const newWire = {
                ...wire,
                end: connectedEndWire.wirePortPosition,
                wirePortPosition: wirePortPosition
            }

            updatedWires = [...updatedWires.filter((w) => w.id !== wire.id), newWire];
        }

        if(connectedStartWire && connectedEndWire){
            const wirePortPositionX = (connectedStartWire.wirePortPosition.x - connectedEndWire.wirePortPosition.x) / 2 + connectedEndWire.wirePortPosition.x;
            const wirePortPositionY = (connectedStartWire.wirePortPosition.y - connectedEndWire.wirePortPosition.y) / 2 + connectedEndWire.wirePortPosition.y;
            const wirePortPosition = { x: wirePortPositionX, y: wirePortPositionY };    

            const newWire = {
                ...wire,
                start: connectedStartWire.wirePortPosition,
                end: connectedEndWire.wirePortPosition,
                wirePortPosition: wirePortPosition
            }

            updatedWires = [...updatedWires.filter((w) => w.id !== wire.id), newWire];
        }

        if(wire.startId === nodeId || wire.endId === nodeId){
            if(wire.startId === nodeId){
                const connectedNodePort = e.target.getChildren().find((child) => child.attrs.id === wire.startPort);
                const newStartPosition = connectedNodePort.getAbsolutePosition();

                const wirePortPositionX = (newStartPosition.x - wire.end.x) / 2 + wire.end.x;
                const wirePortPositionY = (newStartPosition.y - wire.end.y) / 2 + wire.end.y;
                const wirePortPosition = { x: wirePortPositionX, y: wirePortPositionY };

                if(connectedEndWire){
                    const wirePortPositionX = (newStartPosition.x - connectedEndWire.wirePortPosition.x) / 2 + connectedEndWire.wirePortPosition.x;
                    const wirePortPositionY = (newStartPosition.y - connectedEndWire.wirePortPosition.y) / 2 + connectedEndWire.wirePortPosition.y;
                    const wirePortPosition = { x: wirePortPositionX, y: wirePortPositionY };

                    const newWire = {
                        ...wire,
                        start: newStartPosition,
                        end: connectedEndWire.wirePortPosition,
                        wirePortPosition: wirePortPosition
                    }
    
                    updatedWires = [...updatedWires.filter((w) => w.id !== wire.id), newWire];
                } else {
                    const newWire = {
                        ...wire,
                        start: newStartPosition,
                        wirePortPosition: wirePortPosition
                    }
    
                    updatedWires = [...updatedWires.filter((w) => w.id !== wire.id), newWire];
                }

            } else if(wire.endId === nodeId){
                const connectedNodePort = e.target.getChildren().find((child) => child.attrs.id === wire.endPort);
                const newEndPosition = connectedNodePort.getAbsolutePosition();

                const wirePortPositionX = (wire.start.x - newEndPosition.x) / 2 + newEndPosition.x;
                const wirePortPositionY = (wire.start.y - newEndPosition.y) / 2 + newEndPosition.y;
                const wirePortPosition = { x: wirePortPositionX, y: wirePortPositionY };

                if(connectedStartWire){
                    const wirePortPositionX = (connectedStartWire.wirePortPosition.x - newEndPosition.x) / 2 + newEndPosition.x;
                    const wirePortPositionY = (connectedStartWire.wirePortPosition.y - newEndPosition.y) / 2 + newEndPosition.y;
                    const wirePortPosition = { x: wirePortPositionX, y: wirePortPositionY };
                    
                    const newWire = {
                        ...wire,
                        start: connectedStartWire.wirePortPosition,
                        end: newEndPosition,
                        wirePortPosition: wirePortPosition
                    }

                    updatedWires = [...updatedWires.filter((w) => w.id !== wire.id), newWire];
                } else {
                    const newWire = {
                        ...wire,
                        end: newEndPosition,
                        wirePortPosition: wirePortPosition
                    }
    
                    updatedWires = [...updatedWires.filter((w) => w.id !== wire.id), newWire];
                }
            }
        }
    });

    state.setWires([...state.wires.filter((wire) => !updatedWires.find((updated) => updated.id === wire.id)), ...updatedWires]);
}

/**
 * Adds a new wire to the canvas.
 * @param {Object} e - The event object from the canvas click event.
 * @param {Object} state - The current state of the canvas, including selected objects and mode.
 */
export function addWire(e, state){
    const type = e.target.getAttrs().type;
        
    if(type === "gate_port" || type === "wire_port"){
        
        if(state.wireStart === null){ // If no wire is currently being drawn, start a new wire from the clicked port.

            const startWire = {
                id: crypto.randomUUID(),
                start: e.target.getAbsolutePosition(),
                startId: e.target.parent.getAttrs().id,
                startPort: e.target.getAttrs().id,
                startPortType: type,
                startPortFace: e.target.getAttrs().portface,
            }

            state.setWireStart(startWire);
        }
        else if(state.wireStart.startId !== e.target.parent.getAttrs().id){ // If a wire is already being drawn, and the clicked port belongs to a different node, complete the wire.
            // Calculate the position of the wire port, which is the midpoint between the start and end ports.
            const wirePortPositionX = (e.target.getAbsolutePosition().x - state.wireStart.start.x) / 2 + state.wireStart.start.x;
            const wirePortPositionY = (e.target.getAbsolutePosition().y - state.wireStart.start.y) / 2 + state.wireStart.start.y;
            const wirePortPosition = { x: wirePortPositionX, y: wirePortPositionY };


            const endWire = {
                id: state.wireStart.id,
                start: state.wireStart.start,
                startId: state.wireStart.startId,
                startPort: state.wireStart.startPort,
                startPortType: state.wireStart.startPortType,
                startPortFace: state.wireStart.startPortFace,
                end: e.target.getAbsolutePosition(),
                endId: e.target.parent.getAttrs().id,
                endPort: e.target.getAttrs().id,
                endPortType: type,
                endPortFace: e.target.getAttrs().portface,
                wirePortPosition: wirePortPosition,
                value: 0
            }

            state.setWires([...state.wires, endWire]);
            state.setWireStart(null);
        }
    }
}


/**
 * Clears the entire canvas.
 * @param {Object} state - The current state of the canvas, including selected objects and mode.
 */
export function clearCanvas(state){
    // Reset both the canvas contents and any in-progress interaction state.
    state.setNodes([]);
    state.setWires([]);
    state.setWireStart(null);
    state.setSelection([]);
    state.setMode("idle");
}

/**
 * Handles the dragging of the window.
 * @param {Object} e - The event object from the drag event.
 * @param {boolean} isDragging - A flag indicating whether the window is currently being dragged.
 * @param {Object} position - The current position of the window.
 */
export const windowDrag = (e, isDragging, position) => {
    
    if(isDragging){

        position.setPosition({
            x: position.position.x - e.evt.movementX,
            y: position.position.y - e.evt.movementY
        });

        let windowScrollX = (position.position.x / window.innerWidth) * 100;
        let windowScrollY = (position.position.y / window.innerHeight) * 100;
        
        if(windowScrollX < 0){
            windowScrollX = 0;
            position.setPosition({
                x: 0,
                y: position.position.y
            });
        }

        if(windowScrollY < 0){
            windowScrollY = 0;
            position.setPosition({
                x: position.position.x,
                y: 0
            });
        }

        window.scroll(windowScrollX * 25, windowScrollY * 15);
    }
}

