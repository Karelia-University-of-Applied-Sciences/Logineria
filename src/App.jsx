import CircuitCanvas from "./page-components/CircuitCanvas";
import MainMenu from "./page-components/MainMenu";
import "./styles/main.css";
import "./styles/guide.css";


import { useState, useEffect } from "react";
import CustomConfirmDialog from "./dialog/CustomConfirmDialog.jsx";
import QuickStartGuide from "./page-components/QuickStartGuide.jsx";
import RunSimBtn from "./page-components/RunSimBtn.jsx";

const App = () => {
      const [mode, setMode] = useState('idle');
      const [nodes, setNodes] = useState([]);
      const [selection, setSelection] = useState([]);
      const [wires, setWires] = useState([]);
      const [wireStart, setWireStart] = useState(null);
      const state = { mode, setMode, nodes, setNodes, selection, setSelection, wires, setWires, wireStart, setWireStart };

    useEffect(() => {
      const changeCursor = (mode) => {
        const appContainer = document.getElementById("app-container");

        if(mode === "idle"){
          appContainer.style.cursor = "default";
        }

        if(mode !== "idle"){
          appContainer.style.cursor = "crosshair";
        }
      }

      changeCursor(mode);

    }, [mode]);

  return (
    <>
      <main className="app-container" id="app-container">
        <CustomConfirmDialog message="Are you sure you want to continue without saving?" />
        <CircuitCanvas state={state} />
        <MainMenu state={state} />
        <RunSimBtn state={state} />
        <QuickStartGuide />
      </main>
    </>
  )
}

export default App
