import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './App.css';
import "./styles.css"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state // if current operand is 0 then it will not add another 0
      if (payload.digit === "." && state.currentOperand.includes(".")) return state // if current operand contaions '.' then it will not add another '.'
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}` // adds digit to the current operand, if currentOperand is null it will default to empty string
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state // if the current and previous operand is null then we can't select a operation
      }

      // This will change only the operation if the currentOperand is null
      // e.g if we have 5 +, then decide we want to multiply *, we can click * and it will update to 5 *
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      // This will check if the previous is null. 
      // If null, it will take take the current operand and make it the previous and set the operation
      if (state.previousOperand == null) {
        return {
          ...state, 
          operation: payload.operation, // collects operation from payload and sets operation
          previousOperand: state.currentOperand,  // makes the currentOperand the previousOperand
          currentOperand: null, // resets the currentOperand
        };
      }

      // This will be the default action if we have a previousOperand, operation and currentOperand already displayed
      // If 2+2 is displayed, and click -, it will calculate 2+2 and update the previousOperand to 4 and update the operation -
      return {
        ...state,
        previousOperand: evaluate(state), // the previousOperand will trigger the evaluate function which will take the current state
        operation: payload.operation, // collects operation from payload and sets operation
        currentOperand: null // reset the currentOperand
      }
    
    case ACTIONS.CLEAR:
        return {} // This returns an empty state which is the initial state. This function is on the onClick of the AC button

    case ACTIONS.DELETE_DIGIT:
      // if the current state is overwrite, change delete the current number and overwrite to false
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) return state // if there is no current number, there's nothing to delete, so return nothing
      if (state.currentOperand.length === 1) { // if there is only 1 digit left to delete in the current operand, reset it to null
        return {
          ...state,
          currentOperand: null // reset to null, as we don't want to leave it as an empty string
        }
      }

      // default case, when clicking DEL, it will delete the last digit of the currentOperand, e.g. 1234 will become 123
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      // This will check to see if operation, currentOperand or previousOperand is missing
      // if so, return state, (do nothing), as we need these 3 things for the calculation
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      // This is the default, and will complete the below actions if we have the operation, current and previous operands
      return {
        ...state,
        overwrite: true, // This value is so, when a number is selected after the calulation it replaces the currentOperand. I.e if we did 5+5 =, 10 will display then if we select number 3, it will replace 10 and not add to the end as 103
        previousOperand: null, // resets previousOperand
        operation: null, // resets operation
        currentOperand: evaluate(state), // updates the currentOperand with the calculation of the state
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand) // converts into a number
  const current = parseFloat(currentOperand) // converts into a number
  if (isNaN(prev) || isNaN(current)) return "" // if one or both don't exist it returns empty string as there is nothing to do
  let computation = ""
  switch (operation) { // cycles through each operation to find the correct one
    case "+":
      computation = prev + current // if +, update computation to use this formula
      break // breaks cycle to stop going through other cases
    case "-":
      computation = prev - current // if -, use this formula
      break // break cycle
    case "*":
      computation = prev * current // if *, use this formula
      break // break cycle
    case "÷":
      computation = prev / current // if ÷, use this formula
      break // break cycle
  }
  return computation.toString() // changes number back to string
}

// Formats the numbers, adds commas to larger numbers
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximunFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return // if operand is null, do nothing
  const [integer, decimal] = operand.split('.') // otherwise, split number at the decimal '.', if no decimal used, decimal will = null
  if (decimal == null) return INTEGER_FORMATTER.format(integer) // if decimal == null just return formatted integer

  /* 
  if the operand has both integer and decimal, this will return the formatted integer, a '.' then 
  the decimal portion of the number which won't be formatted. e.g. 3,025,987.56386
  */
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}` 
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
    <div className="output">
      <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
      <div className="current-operand">{formatOperand(currentOperand)}</div>
    </div>
    <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>
    <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
    <OperationButton operation="÷" dispatch={dispatch} />
    <DigitButton digit="1" dispatch={dispatch} />
    <DigitButton digit="2" dispatch={dispatch} />
    <DigitButton digit="3" dispatch={dispatch} />
    <OperationButton operation="*" dispatch={dispatch} />
    <DigitButton digit="4" dispatch={dispatch} />
    <DigitButton digit="5" dispatch={dispatch} />
    <DigitButton digit="6" dispatch={dispatch} />
    <OperationButton operation="+" dispatch={dispatch} />
    <DigitButton digit="7" dispatch={dispatch} />
    <DigitButton digit="8" dispatch={dispatch} />
    <DigitButton digit="9" dispatch={dispatch} />
    <OperationButton operation="-" dispatch={dispatch} />
    <DigitButton digit="." dispatch={dispatch} />
    <DigitButton digit="0" dispatch={dispatch} />
    <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE})}>=</button>

    </div>
  )
    
}

export default App;
