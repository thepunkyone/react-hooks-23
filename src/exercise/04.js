// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'
import {useState} from 'react'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const defaultCurrentStep = Array(9).fill(null)
  const defaultHistory = [defaultCurrentStep]

  const [history, setHistory] = useLocalStorageState('history', defaultHistory)

  const [currentStep, setCurrentStep] = useLocalStorageState(
    'currentStep',
    defaultCurrentStep,
  )

  const nextValue = calculateNextValue(currentStep)
  const winner = calculateWinner(currentStep)
  const status = calculateStatus(winner, currentStep, nextValue)

  function selectSquare(square) {
    if (winner || currentStep[square]) {
      return
    }

    const squaresCopy = [...currentStep]
    squaresCopy[square] = nextValue

    const historyCopy = [...history]
    historyCopy.push(squaresCopy)

    setHistory(historyCopy)
    setCurrentStep(squaresCopy)
  }

  function restart() {
    setHistory(defaultHistory)
    setCurrentStep(defaultCurrentStep)
  }

  const moves = history.map((step, i) => {
    const isFirstStep = i === 0
    const isCurrentStep =
      JSON.stringify(history[i]) === JSON.stringify(currentStep)

    return (
      <li>
        <button
          key={JSON.stringify(step)}
          onClick={() => setCurrentStep(history[i])}
          disabled={isCurrentStep}
        >
          {isFirstStep ? 'Go to game start' : `Go to move #${i}`}
          {isCurrentStep ? ' (current)' : ''}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentStep} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
