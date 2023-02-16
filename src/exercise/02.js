// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {useState} from 'react'

const useLocalStorageState = ({localStorageKey, initialState = '', serialise = JSON.stringify, deserialise = JSON.parse}) => {
  const getInitialState = () => {
    const stateFromLocalStorage = window.localStorage.getItem(localStorageKey)

    if (stateFromLocalStorage) return deserialise(stateFromLocalStorage)

    return initialState
  }

  const [state, setState] = useState(getInitialState)

  const prevLocalStorageKeyRef = React.useRef(localStorageKey)

  React.useEffect(() => {
    if (localStorageKey !== prevLocalStorageKeyRef.current) {
      window.localStorage.removeItem(prevLocalStorageKeyRef.current)
    }

    prevLocalStorageKeyRef.current = localStorageKey

    window.localStorage.setItem(localStorageKey, serialise(state))
  }, [localStorageKey, state, serialise])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState({
    localStorageKey: 'name',
    initialState: initialName
  })

  function handleChange(event) {
   const {value} = event.target

    setName(value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
