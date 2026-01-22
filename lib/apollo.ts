import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const POKE_API_GRAPHQL_URL = 'https://graphql.pokeapi.co/v1beta2';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        pokemon: {
          keyArgs: false,
          // https://www.apollographql.com/docs/react/caching/cache-field-behavior#handling-pagination
          merge(existing: any[], incoming: any[], { variables }) {
            const merged = existing ? existing.slice(0) : [];
            const end = variables?.offset + Math.min(variables?.limit, incoming.length);
            for (let i = variables?.offset; i < end; ++i) {
              merged[i] = incoming[i - variables?.offset];
            }
            return merged;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: new HttpLink({ uri: POKE_API_GRAPHQL_URL }),
  cache,
});
