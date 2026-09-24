import { useState, useEffect, useRef } from "react";
import { Line, Group, Circle } from "react-konva";
import { selectObj, changeWireMode } from "../logic/canvasFunctions.js";


const WireComponent = ({ wire, state }) => {
    
    const calculatePositionPoints = (wire) => {
        if(wire.startId !== wire.endId){
            if(wire.startPortFace === "right" && wire.endPortFace === "left"){
                return [wire.start.x, wire.start.y, wire.start.x + 25, wire.start.y, wire.end.x - 25, wire.end.y, wire.end.x, wire.end.y];
            } else if(wire.startPortFace === "left" && wire.endPortFace === "right"){
                return [wire.start.x, wire.start.y, wire.start.x - 25, wire.start.y, wire.end.x + 25, wire.end.y, wire.end.x, wire.end.y];
            } else {
                return [wire.start.x, wire.start.y, wire.end.x, wire.end.y];
            }
        }
    }

    const [points, setPoints] = useState(calculatePositionPoints(wire));
    const groupRef = useRef(null);
    const visualRef = useRef(null);

    useEffect(() => {
        function updateWirePoints(wire, setPoints){
            const newPoints = calculatePositionPoints(wire);
            setPoints(newPoints);
        }
        
        function changeLayerIndex(){
            groupRef.current.moveToBottom();
            groupRef.current.getLayer().batchDraw();
        }

        const wireSelected = () => {
            let selected = false;

            for(const selection of state.selection){
                if(selection.id === wire.id){
                    selected = true;
                    break;
                }
            }

            if(selected){
                visualRef.current.stroke("blue");
            } else {
                visualRef.current.stroke("black");
            }
        }

        changeWireMode(state, groupRef);
        changeLayerIndex();
        wireSelected();        
        updateWirePoints(wire, setPoints);
        
    }, [wire, state]);
    
    return (
        <>
            <Group type={"WIRE"} key={wire.id} {...wire} ref={groupRef}>
                <Line points={points} 
                    ref={visualRef}
                    name="visual-wire" 
                    lineCap="round" 
                    lineJoin="round" 
                    stroke="black" 
                    strokeWidth={1.5}
                />
                <Line points={points} 
                    name="selection-wire" 
                    lineCap="round" 
                    lineJoin="round" 
                    stroke="transparent" 
                    strokeWidth={20}
                    onClick={(e) => {
                        if(state.mode === "idle"){
                            selectObj(e, state);
                        }
                    }}
                />
                <Circle 
                    x={wire.wirePortPosition.x}
                    y={wire.wirePortPosition.y}
                    id={"in1"}
                    type={"wire_port"}
                    name={"port"}
                    portface={"middle"}
                    radius={5}
                    fill="white"
                    stroke="black"
                    strokeWidth={1}
                />
            </Group>
        </>
    )
}

export default WireComponent;