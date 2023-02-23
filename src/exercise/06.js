// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false, errorMessage: ''}
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, errorMessage: error.message}
  }

  render() {
    if (this.state.hasError) {
      return <h1>{this.state.errorMessage}</h1>
    }

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })

  const {pokemon, error, status} = state

  React.useEffect(() => {
    if (!pokemonName) return

    setState({pokemon: null, error: null, status: 'pending'})

    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({pokemon: pokemonData, error: null, status: 'resolved'})
      },
      err => {
        setState({pokemon: null, error: err, status: 'rejected'})
      },
    )
  }, [pokemonName])

  if (status === 'idle') return 'Submit a pokemon'

  if (status === 'pending') return <PokemonInfoFallback name={pokemonName} />

  if (status === 'rejected') throw error

  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
