import { useState } from 'react'
import HomeCss from '../styles/Home.module.css'
import Link from 'next/link'
import Head from 'next/head'



export default function Home({ pokemons, dadosMinimos, tipos, notFound }) {


  const [filtro, setFiltrar] = useState(dadosMinimos)

  const filtrar = (elTipo) => {

    setFiltrar(dadosMinimos)

    if (elTipo === "borrar") {
      setFiltrar(dadosMinimos)
    }
    else {

      let filtradoPorTypo = dadosMinimos
        .filter((pokemon) => pokemon.types.some((tipo) => tipo.type.name === elTipo))
        .map((tem2) => {

          let nuevosTem = { ...tem2 }

          return nuevosTem
        })
      setFiltrar(filtradoPorTypo)

    }

  }





  return (
    <>
      <Head>
        <title>Poke Top</title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <div className={HomeCss.container}>

        <div className={HomeCss.titulo}>
          <h1>Pokemons</h1>
        </div>
        <div className={HomeCss.columnas}>

          <ul>
            {filtro ? filtro.map(pokemon => (
              <li key={pokemon.id}>
                <Link scroll={false} href={{
                  pathname: '/pokemon/[name]',
                  query: { name: pokemon.name }
                }}>
                  <a>
                    <div className={`${HomeCss.card} ${pokemon.types[0].type.name}`}>
                      <div className={HomeCss.nombreTipos}>

                        <h3 exit={{ opacity: 0 }}>{pokemon.name}</h3>


                        <div className={HomeCss.tipos}>
                          {pokemon.types.map((tipos, index) => {
                            return (
                              <div key={index} className={HomeCss.tipo}>
                                {tipos.type.name}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <img
                        src={pokemon.sprites}
                        alt={pokemon.name}
                        width={100}
                        height={100}
                        className={HomeCss.imagen}
                      />
                    </div>
                  </a>


                </Link>
              </li>
            )) : 'Cargando...'}
          </ul>
        </div>


      </div>
    </>
  )
}

export async function getStaticProps(context) {

  const resTipos = await fetch('https://pokeapi.co/api/v2/type')
  const tipos = await resTipos.json()

  const trazemosPokemons = async (porPokemon) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${porPokemon}?limit=101&offset=0/`)
    const data = await response.json()

    return data
  }
  let pokemons = []
  for (let i = 1; i <= 101; i++) {
    let data = await trazemosPokemons(i)
    pokemons.push(data)
  }



  let dadosMinimos = pokemons.map(pokemon => {
    return {
      id: pokemon.id,
      name: pokemon.name,
      sprites: pokemon.sprites.other.dream_world.front_default,
      types: pokemon.types
    }
  })



  return {
    props: {
      tipos: tipos.results,
      dadosMinimos,

    },
  }
}