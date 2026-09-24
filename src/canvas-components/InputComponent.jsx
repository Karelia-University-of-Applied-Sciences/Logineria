import { Group, Circle, Rect, Text } from "react-konva";
import { useState, useRef, useEffect } from  "react";
import Konva from "konva";

import { updateNodePosition, selectObj, updateWirePosition, changeWireMode } from "../logic/canvasFunctions.js";
import { updateInput } from "../logic/simLogic.js";


const InputComponent = ({node, state}) => {
    const [position] = useState(node.position);
    const [input, setInput] = useState(node.node.inputs.in1);
    const rectRef = useRef(null);
    const circleRef = useRef(null);
    const groupRef = useRef(null);
    
    useEffect(() => {
        const onReset = () => {
            if(node.node.inputs.in1 === 0){
                rectRef.current.fill("white");
                circleRef.current.fill("red");

                const off = new Konva.Tween({
                    node: circleRef.current,
                    duration: 0.2,
                    y: 35,
                    easing: Konva.Easings.Linear,
                });

                off.play();
                setInput(0);
            }
        }

        const nodeSelected = () => {
            const selected = state.selection.find((selection) => selection.id === node.id);

            if(selected){
                rectRef.current.stroke("blue");
            } else {
                rectRef.current.stroke("black");
            }
        }

        if(node.node.inputs.in1 === 0){
            onReset();
        }

        nodeSelected();
        changeWireMode(state, groupRef);

    }, [state, node]);

    const powerButton = () => {
        if (node.node.inputs.in1 === 1) {

            updateInput(node.id, state, 0);
            setInput(0);
        }
        else {

            rectRef.current.fill("lightyellow");
            circleRef.current.fill("green");

            const on = new Konva.Tween({
                node: circleRef.current,
                duration: 0.2,
                y: 15,
                easing: Konva.Easings.Linear,
            });

            on.play();
            updateInput(node.id, state, 1);
            setInput(1);
        }
    }



    return (
        <>
            <Group type={node.type} {...node} x={position.x} y={position.y} ref={groupRef} draggable onDragMove={(e) => updateWirePosition(e, state)} onDragEnd={(e) => updateNodePosition(e, state)}>
                <Rect width={50} height={50} fill="white" stroke="black" strokeWidth={2} onClick={(e) => selectObj(e, state)} ref={rectRef} name="visual-rect"/>
                <Text text="INPUT" fontSize={11} x={8} y={-15} />
                <Text text={input} fontSize={25} x={18} y={15} />
                <Rect width={10} height={30} fill="white" stroke="black" strokeWidth={1} x={-20} y={10} cornerRadius={5} />
                <Circle radius={5} fill="red" stroke="black" strokeWidth={1} x={-15} y={35} id={"power"} ref={circleRef} onClick={(e) => powerButton(e)} />
                <Circle radius={4} fill="transparent" x={50} y={25} id={"in1"} type={"gate_port"} name={"port"} portface={"right"}/>
            </Group>
        </>
    )
}

export default InputComponent;