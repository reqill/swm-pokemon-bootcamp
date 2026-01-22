import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const POKE_API_GRAPHQL_URL = 'https://graphql.pokeapi.co/v1beta2';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        pokemon: {
          keyArgs: false,
          // https://www.apollographql.com/docs/react/caching/cache-field-behavior#handling-pagination
          merge(existing: any[] | undefined, incoming: any[], { variables }) {
            if (variables == null || variables.offset == null || variables.limit == null) {
              return incoming;
            }
            const merged = existing ? existing.slice(0) : [];
            const start = variables.offset;
            const end = start + Math.min(variables.limit, incoming.length);
            for (let i = start; i < end; ++i) {
              merged[i] = incoming[i - start];
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
