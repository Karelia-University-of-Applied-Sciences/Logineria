import { clearCanvas } from "../logic/canvasFunctions.js";
import Konva from "konva";
import html2canvas from "html2canvas";


/**
 * Imports a canvas from a JSON file.
 * @param {Object} state - The current state of the canvas.
 */
export async function importCanvas(state){

    const clearQueryPromise = new Promise((resolve) => {
        // Clear the current canvas before importing a new one.
        if(state.nodes.length === 0){
            resolve(true);
        } else {
            const result = clearCanvasQuery(state);
            resolve(result);
        }  
    });

    const result = await Promise.all([clearQueryPromise]); // Wait for the clear canvas query to complete before proceeding with the import.

    if(result[0] === false){
        return;
    }

    // Import a previously saved circuit from a json file.
    const reader = new FileReader();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.click();

    fileInput.addEventListener("change", () => {
        const selectedFile = fileInput.files[0];

        if(selectedFile){
            reader.readAsText(selectedFile);
    
            reader.addEventListener("loadend", () => {
                const data = reader.result;
                const jsonData = JSON.parse(data);

                if(!jsonData.nodes){ // Check if the imported JSON file has the required properties
                    console.log("Invalid JSON file format. File doesn't contain valid data");
                    return;
                }

                // Imported data replaces the current circuit in full.
                state.setNodes(jsonData.nodes);
                state.setWires(jsonData.wires);
            });
        }
    });
}

/**
 * Exports the current canvas to a JSON file.
 * @param {Object} state - The current state of the canvas.
 */
export function exportCanvas(state){
    // Save nodes and wires together into json file and download it to local machine, so the circuit can be restored as a later import.

    if(state.nodes.length === 0){ // Check if there is any data to export
        console.log("No nodes or wires to export.");
        return;
    }

    // Prepare default filename with current date for the exported JSON file.
    const wires = { wires: state.wires };
    const nodes = { nodes: state.nodes };
    const data = { ...wires, ...nodes };

    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const filename = `digital_circuit_${day}-${month}-${year}.json`;

    // Create a Blob from the JSON data and create a temporary link to download it.
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

/**
 * Prompts the user to confirm clearing the canvas.
 * @param {Object} state - The current state of the canvas.
 * @returns {Promise<boolean>} A promise that resolves to true if the user confirms, false otherwise.
 */
export async function clearCanvasQuery(state){
    
    const clearCanvasPromise = new Promise((resolve) => {
        
        if(state.nodes.length !== 0){
            // Ask for confirmation only when clearing would remove existing nodes.
            const dialog = document.getElementById("custom-confirm-dialog");
            const confirmBtnYes = document.getElementById("confirm-btn-yes");
            const confirmBtnNo = document.getElementById("confirm-btn-no");
            
            dialog.showModal();
            
            confirmBtnYes.addEventListener("click", (e) => {
                e.preventDefault();
                dialog.close();
                resolve(true);
            });
            
            confirmBtnNo.addEventListener("click", (e) => {
                e.preventDefault();
                dialog.close();
                resolve(false);
            });
        } 
    });
    
    const result = await Promise.all([clearCanvasPromise]); // Wait for the user to respond to the confirmation dialog before proceeding.

    if(result[0] === false){
        return false; // User chose not to clear the canvas, so return false to indicate that the operation was canceled.
    } else {
        clearCanvas(state); // Clear the canvas if the user confirmed the action and return true to indicate that the operation was successful.
        return true;
    }
}


/**
 * Deletes the selected items from the canvas.
 * @param {Object} state - The current state of the canvas.
 */
export function deleteSelected(state){

    if(state.selection.length === 0){
        console.log("No items selected for deletion.");
        return;
    }

    const nodes = state.nodes.concat();
    const wires = state.wires.concat();

    state.selection.forEach((selection) => {
        if(selection.type !== "WIRE"){
            const nodeId = selection.id;
            const node = state.nodes.find((n) => n.id === nodeId);

            if(!node){
                console.log("Node not found for deletion: ", nodeId);
                return;
            }

            // Find all wires connected to the node
            const filterWires = wires.filter((wire) => wire.startId === node.id || wire.endId === node.id);

            // Remove the connected wires from the wires array and any wires connected to those wires that are not connected to any gate ports.
            if(filterWires.length > 0){
                const wiresQueue = filterWires.concat();
                const visited = new Set();
                
                // Use a queue to traverse all connected wires and remove them from the wires array.
                while(wiresQueue.length > 0){

                    const currentWire = wiresQueue.shift();

                    if(visited.has(currentWire.id)){
                        continue;
                    }
                    visited.add(currentWire.id);

                    const connectedWires = wires.filter((w) => (w.startId === currentWire.id || w.endId === currentWire.id));
                    const connectedToWires = wires.filter((w) => (w.startId === currentWire.id && w.endPort === "wire_port") || (w.id === currentWire.endId && w.startPort === "wire_port"));
                    
                    connectedWires.forEach((connectedWire) => {
                        // Ignores wires that are connected to gate ports on both ends, as they are not directly connected to the node being deleted.
                        if(connectedWire.startPort !== "gate_port" && connectedWire.endPort !== "gate_port"){
                            wiresQueue.push(connectedWire);
                        }
                    });

                    connectedToWires.forEach((connectedToWire) => {
                        // Ignores wires that are connected to gate ports on both ends, as they are not directly connected to the node being deleted.
                        if(connectedToWire.startPort !== "gate_port" && connectedToWire.endPort !== "gate_port"){
                            wiresQueue.push(connectedToWire);
                        }
                    });
    
                    const wire = wires.find((w) => w.id === currentWire.id);

                    if(wire){
                        wires.splice(wires.indexOf(wire), 1);
                    }   
                }
            }

            // Remove the node from the nodes array
            if(node){                
                nodes.splice(nodes.indexOf(node), 1);
            }
        }

        if(selection.type === "WIRE"){
            const wireId = selection.id;
            const wire = state.wires.find((w) => w.id === wireId);

            if(!wire){
                console.log("Wire not found for deletion: ", wireId);
                return;
            }

            // Find all wires connected to the wire
            const connectedWires = wires.filter((w) => w.startId === wire.id || w.endId === wire.id);

            // Remove any wires that are connected to the selected wire and are not connected to any gate ports, then remove the selected wire itself.
            if(connectedWires.length > 0){
                connectedWires.forEach((connectedWire) => {
                    if(connectedWire.startPortType !== "gate_port" || connectedWire.endPortType !== "gate_port"){
                        wires.splice(wires.indexOf(connectedWire), 1);
                    }
                });
            }

            wires.splice(wires.indexOf(wire), 1);
        }
    });

    const returnedNodes = nodes.concat();
    const returnedWires = wires.concat();
    
    state.setNodes(returnedNodes);
    state.setWires(returnedWires);

    state.setSelection([]);
}

/**
 * Resets the input/output values of all nodes and wires in the given state.
 * @param {Object} state 
 */
export function resetInteractions(state){

    if(state.nodes !== null){
        const updatedNodes = [];
        const updatedWires = [];

        for(const node of state.nodes){
        
            let updatedNode = {
                ...node,
                node: { inputs: {in1: 0, in2: 0}, outputs: { out1: 0 } }
            };

            if(updatedNode.type === "INPUT"){
                updatedNode = {
                    ...node,
                    node: { inputs: {in1: 0}}
                };
            } else if(updatedNode.type === "OUTPUT"){
                updatedNode = {
                    ...node,
                    node: { outputs: { out: 0 } }
                };
            } else if(updatedNode.type === "NOT"){
                updatedNode = {
                    ...node,
                    node: { inputs: {in1: 0}, outputs: { out: 0 } }
                };
            }

            updatedNodes.push(updatedNode);
        }
        
        if(state.wires.length > 0){
            for(const wire of state.wires){
                const newWire = {
                    ...wire,
                    value: 0
                }
                
                updatedWires.push(newWire);
            }
        }

        state.setNodes(updatedNodes);
        state.setWires(updatedWires);
    }
}


/**
 * Captures the current state of the canvas as an image and opens it in a new window for preview and download.
 * The user can fit the image to the window and click the download button to save it as a PNG file.
 */
export const captureImage = () => {

    const stage = Konva.stages.find((s) => s.attrs.id === "canvas-stage");
    const node = stage.clone();
    node.scale({ x: 0.8, y: 0.8 });
    
    const win = window.open("", "_blank", "width=800,height=600", self);
    const previewContainer = document.createElement("div");
    previewContainer.style.position = "fixed";
    previewContainer.style.top = "0";
    previewContainer.style.left = "0";
    previewContainer.style.width = "800px";
    previewContainer.style.height = "600px";
    previewContainer.style.zIndex = "9998";
    
    const canvas = document.createElement("div");
    canvas.style.position = "relative";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.border = "none";
    canvas.style.overflow = "scroll";
    canvas.style.backgroundColor = "#ffffff";
    canvas.appendChild(node.container());
    previewContainer.appendChild(canvas);

    win.document.body.appendChild(previewContainer);
    
    const button = document.createElement("button");
    button.textContent = "Download Image";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.left = "300px";
    button.style.width = "170px";
    button.style.zIndex = "9999";

    const textarea = document.createElement("p");
    textarea.textContent = "Fit the image to window and click download button to save.";
    textarea.style.fontFamily = "Arial, sans-serif";
    textarea.style.fontSize = "14px";
    textarea.style.position = "fixed";
    textarea.style.bottom = "10px";
    textarea.style.left = "220px";
    textarea.style.textAlign = "center";
    textarea.style.zIndex = "9999";
    win.document.body.appendChild(textarea);

    button.addEventListener("click", () => {
        html2canvas(previewContainer).then((canvas) => {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "circuit.png";
            win.document.body.appendChild(link);
            
            link.click();
            
            win.document.body.removeChild(link);
            win.URL.revokeObjectURL(link.href);
        });
    });
    
    win.document.body.appendChild(previewContainer);
    win.document.body.appendChild(button);
}

/**
 * Toggles the visibility of the quick start guide.
 * @param {Object} guide - The quick start guide object.
 */
export const hideQuickStartGuide = (guide) => {
    
    const quickStartGuide = document.getElementById("quick-start-guide");
    const guideContent = document.getElementById("guide-content");

    if(!guide.guideVisible){
        quickStartGuide.style.width = "500px";
        quickStartGuide.style.borderLeft = "2px solid blue";
        guideContent.style.opacity = "1";
        guideContent.style.visibility = "visible";
        guide.setGuideVisible(true);
    } else {
        quickStartGuide.style.width = "0px";
        quickStartGuide.style.border = "none";
        guideContent.style.opacity = "0";
        guideContent.style.visibility = "hidden";
        guide.setGuideVisible(false);
    }
}