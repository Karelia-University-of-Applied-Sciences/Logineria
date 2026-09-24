
const CustomConfirmDialog = ({message}) => {

    return (
        <>
            <dialog id="custom-confirm-dialog" className="custom-confirm-dialog">
                <p>{message}</p>
                <div className="confirmation-buttons">
                    <button className="confirmation-button" id="confirm-btn-yes" value="default">Yes</button>
                    <button className="confirmation-button" id="confirm-btn-no" value="default">No</button>
                </div>
            </dialog>
        </>
    )

}

export default CustomConfirmDialog;