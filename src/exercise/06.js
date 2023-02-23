// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

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

function ErrorFallback({error}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <p>{error.message}</p>
    </div>
  )
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
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
