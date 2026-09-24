import { useState } from "react";
import "../styles/menu.css";

import { hideQuickStartGuide, captureImage, exportCanvas, clearCanvasQuery, importCanvas } from "../mainmenu-components/menuFunctions.js";
import ComponentMenu from "../mainmenu-components/ComponentMenu.jsx";



const MainMenu = ({state}) => {
    const [guideVisible, setGuideVisible] = useState(false);
        
    return (
        <>
            <div className="menu-wrapper">
                <div  className="menu-container">
                    <p className="menu-title">Logineria</p>
                    <div className="menu-buttons">
                        <button className="menu-button" onClick={() => { hideQuickStartGuide({guideVisible, setGuideVisible}); }}>Quick Start Guide</button>
                    </div>
                    <hr className="menu-divider"/>
                    <div className="menu-buttons">
                        <button className="menu-button" onClick={() => clearCanvasQuery(state)}>New Canvas</button>
                        <button className="menu-button" onClick={() => importCanvas(state)}>Import</button>
                        <button className="menu-button" onClick={() => exportCanvas(state)}>Export</button>
                    </div>
                    <hr className="menu-divider"/>
                    <ComponentMenu state={state}/>
                    <hr className="menu-divider"/>
                    <div className="menu-buttons">
                        <button className="menu-button" onClick={() => captureImage()}>Capture as image</button>
                    </div>
                    <hr className="menu-divider"/>
                </div>
            </div>
        </>
    )
}

export default MainMenu;