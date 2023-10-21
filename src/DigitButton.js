import { ACTIONS } from "./App"

export default function DigitButton({ dispatch, digit }) {
    // button that has a digit and a onclick function 
    // that's calling the add digit function (type) and passing the digit we want to add (payload)
    return <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
        {digit}
    </button>
}