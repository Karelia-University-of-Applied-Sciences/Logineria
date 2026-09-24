import OutputComponent from "./OutputComponent.jsx";
import InputComponent from "./InputComponent.jsx";
import TwoInputGate from "./TwoInputGate.jsx";
import SingleInputGate from "./SingleInputGate.jsx";

import {
    andImage, andSelectedImage,
    orImage, orSelectedImage,
    notImage, notSelectedImage,
    nandImage, nandSelectedImage,
    norImage, norSelectedImage,
    xorImage, xorSelectedImage,
    xnorImage, xnorSelectedImage
} from "../assets.js";

const LogicComponent = ({ node, state }) => {

    switch(node.type) {

        case "INPUT":
            return <InputComponent key={node.id} node={node} state={state} />;
        case "OUTPUT":
            return <OutputComponent key={node.id} node={node} state={state} />;
        case "NOT":
            return <SingleInputGate key={node.id} 
                node={node}
                state={state}
                componentImg={notImage}
                selectedImg={notSelectedImage}
            />
        case "AND":
            return <TwoInputGate key={node.id} 
                node={node}
                state={state}
                componentImg={andImage}
                selectedImg={andSelectedImage}
            />
        case "OR":
            return <TwoInputGate key={node.id}
                node={node}
                state={state}
                componentImg={orImage}
                selectedImg={orSelectedImage}
            />
        case "NAND":
            return <TwoInputGate key={node.id}
                node={node}
                state={state}
                componentImg={nandImage}
                selectedImg={nandSelectedImage}
            />
        case "NOR":
            return <TwoInputGate key={node.id}
                node={node}
                state={state}
                componentImg={norImage}
                selectedImg={norSelectedImage}
            />
        case "XOR":
            return <TwoInputGate key={node.id}
                node={node}
                state={state}
                componentImg={xorImage}
                selectedImg={xorSelectedImage}
            />
        case "XNOR":
            return <TwoInputGate key={node.id}
                node={node}
                state={state}
                componentImg={xnorImage}
                selectedImg={xnorSelectedImage}
            />
        default:
            return null;
    }
};

export default LogicComponent;