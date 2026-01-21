import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const POKE_API_GRAPHQL_URL = 'https://graphql.pokeapi.co/v1beta2';

export const client = new ApolloClient({
  link: new HttpLink({ uri: POKE_API_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});
