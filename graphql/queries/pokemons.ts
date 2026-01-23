import { gql } from '../types';

export const GET_POKEMONS = gql(`
  query getPokemons($limit: Int!, $offset: Int!) {
    pokemons: pokemon(limit: $limit, offset: $offset, order_by: { name: asc }, where: { is_default:  {
       _eq: true
    }}) {
      id
      name
      height
      weight
      base_experience
      pokemonsprites {
        sprites
      }
      pokemonabilities {
        ability {
          name
        }
      }
      pokemontypes {
        type {
          name
        }
      }
      pokemonstats {
        base_stat
        effort
        stat {
          name
        }
      }
    }
  }
`);

export const GET_NUMBER_OF_UNIQUE_POKEMONS = gql(`
  query getNumberOfUniquePokemons {
    pokemon_aggregate(where: { is_default: { _eq: true } }) {
      aggregate {
        count(distinct: true, columns: id)
      }
    }
  }
`);
