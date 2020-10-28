// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, { useState, useEffect } from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({ pokemonName }) {
  const [state, setState] = useState({ status: 'idle' });

  useEffect(() => {
    if (!pokemonName) return
    setState({ status: 'pending' })
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({ status: 'resolved', pokemon: pokemonData })
      },
      err => {
        setState({ status: 'rejected', error: err })
      },
    )
  }, [pokemonName]);

  switch (state.status) {
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    case 'rejected':
      throw state.error
    default:
      return 'Submit a pokemon'
  }
}

function PokemonErrorFallback({ error }) {
  return (
    <div>
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
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
        <ErrorBoundary resetKeys={[pokemonName]} FallbackComponent={PokemonErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
