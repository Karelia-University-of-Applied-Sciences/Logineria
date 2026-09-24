
const ComponentButton = ({image, componentOnClick, state, name}) => {
    return (
        <>
            <div className="menu-components-component">
                <img 
                src={image} 
                alt={name} 
                id={name} 
                className="menu-components-icon" 
                onClick={(e) => componentOnClick(e, state)}
                />
                <label className="menu-components-label">{name}</label>
            </div>
        </>
    )
}

export default ComponentButton;