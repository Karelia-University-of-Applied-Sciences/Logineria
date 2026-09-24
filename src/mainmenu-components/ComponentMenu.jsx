import { deleteSelected, resetInteractions } from "./menuFunctions.js";
import { useState, useEffect } from "react";
import ComponentButton from "./ComponentButton.jsx";

import {
    andImage, orImage, 
    notImage, nandImage,
    norImage, xorImage, 
    xnorImage, inputImage, 
    outputImage 
} from "../assets.js";

const ComponentMenu = ({state}) => {
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        
        const deleteDisabled = () => {
            if(state.selection.length > 0 && isDisabled){
                setIsDisabled(false);
                
            }

            if(state.selection.length === 0 && !isDisabled){
                setIsDisabled(true);
                
            }
        }

        const modeChangeWireBtn = () => {

            if(state.mode === "idle"){
                const wireBtn = document.getElementById("WIRE");
                wireBtn.checked = false;
            }

        }

        modeChangeWireBtn();
        deleteDisabled();

    }, [state.selection, state.mode, isDisabled]);

    function switchMode(type, mode, setMode){
        if(mode === 'idle' || mode !== type){
            setMode(type);
        }
        else {
            setMode('idle');
        }
    }

    function componentOnClick(e, state){
        const componentType = e.currentTarget.id;

        switchMode(componentType, state.mode, state.setMode);
    }

    return (
        <>
            <div className="menu-components-menu">
                <p className="menu-components-title">Logic Components</p>
                <div className="menu-components-buttons">
                    <button 
                    className="menu-button" 
                    id="delete" 
                    disabled={isDisabled} 
                    onClick={() => deleteSelected(state)}>Delete selected</button>
                    <div className="menu-components-wiremode">
                        <label className="menu-components-label">Wire mode</label>
                        <label className="switch">
                            <input type="checkbox" id="WIRE" onChange={() => switchMode('WIRE', state.mode, state.setMode)}></input>
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
                <div className="menu-components-container">
                    <ComponentButton image={inputImage} componentOnClick={componentOnClick} state={state} name="INPUT" />
                    <ComponentButton image={outputImage} componentOnClick={componentOnClick} state={state} name="OUTPUT" />
                    <ComponentButton image={andImage} componentOnClick={componentOnClick} state={state} name="AND" />
                    <ComponentButton image={orImage} componentOnClick={componentOnClick} state={state} name="OR" />
                    <ComponentButton image={notImage} componentOnClick={componentOnClick} state={state} name="NOT" />
                    <ComponentButton image={nandImage} componentOnClick={componentOnClick} state={state} name="NAND" />
                    <ComponentButton image={norImage} componentOnClick={componentOnClick} state={state} name="NOR" />
                    <ComponentButton image={xorImage} componentOnClick={componentOnClick} state={state} name="XOR" />
                    <ComponentButton image={xnorImage} componentOnClick={componentOnClick} state={state} name="XNOR" />
                </div>
                    <button className="menu-button" onClick={() => resetInteractions(state)}>Reset input/output</button>
            </div>
        </>
    )
}

export default ComponentMenu;