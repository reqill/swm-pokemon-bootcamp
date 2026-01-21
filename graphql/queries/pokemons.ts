import { gql } from '../types';

export const GET_POKEMONS = gql(`
  query getPokemons($limit: Int!) {
    pokemons: pokemon(
      limit: $limit, 
      order_by: { name: asc }, 
      where: { 
        is_default:  {
          _eq: true
        }
      }
    ) {
      id
      name
    }
  }
`);
