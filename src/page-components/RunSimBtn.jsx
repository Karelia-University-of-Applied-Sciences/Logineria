import { runSim } from "../logic/simLogic";

const RunSimBtn = ({ state }) => {

    return (
        <>  
            <div className="btn-runsim-wrapper">
                <button className="btn-runsim" onClick={() => runSim(state)}>Run Simulation</button>
            </div>
        </>
    )
}

export default RunSimBtn;