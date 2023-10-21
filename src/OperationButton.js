import { ACTIONS } from "./App"

export default function OperationButton({ dispatch, operation }) {
    // button that has a digit and a onclick function 
    // that's calling the add digit function (type) and passing the digit we want to add (payload)
    return <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>
        {operation}
    </button>
}