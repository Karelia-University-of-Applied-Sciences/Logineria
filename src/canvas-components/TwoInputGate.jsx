import { useState, useEffect, useRef } from "react";
import { Image, Group, Circle } from "react-konva";
import useImage from "use-image";

import { updateNodePosition, selectObj, updateWirePosition,  changeImage, changeWireMode } from "../logic/canvasFunctions.js";

const TwoInputGate = ({node, state, componentImg, selectedImg }) => {
    const [image] = useImage(componentImg);
    const [selectedImage] = useImage(selectedImg);
    const [position] = useState(node.position);
    const groupRef = useRef(null);

    
    useEffect(() => {

        changeWireMode(state, groupRef);
    }, [state]);

    return (
        <>
            <Group type={node.type} {...node} x={position.x} y={position.y} ref={groupRef} draggable onDragMove={(e) => updateWirePosition(e, state)} onDragEnd={(e) => updateNodePosition(e, state)} >
                <Image image={image} width={60} height={40} x={0} y={0} onClick={(e) => {
                        if(state.mode === "idle"){
                            selectObj(e, state);

                            const isSelected = state.selection.find((n) => n.id === node.id);

                            changeImage(e, {image, selectedImage}, isSelected);
                        }
                }}/>
                <Circle radius={3} x={0} y={8.5} fill="transparent" id={"in1"} type={"gate_port"} name={"port"} portface={"left"} />
                <Circle radius={3} x={0} y={30.5} fill="transparent" id={"in2"} type={"gate_port"} name={"port"} portface={"left"} />
                <Circle radius={3} x={58.5} y={20} fill="transparent" id={"out"} type={"gate_port"} name={"port"} portface={"right"} />
            </Group>
        </>
    )
}

export default TwoInputGate;
