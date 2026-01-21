import { FlatList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GET_POKEMONS } from '@/graphql/queries/pokemons';
import { useQuery } from '@apollo/client/react';

export default function TabTwoScreen() {
  const { loading, error, data } = useQuery(GET_POKEMONS, {
    variables: {
      limit: 100,
    },
  });

  return (
    <FlatList
      data={data?.pokemons || []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ThemedText>
          {item.id}. {item.name}
        </ThemedText>
      )}
      style={styles.listContainer}
      ListHeaderComponent={
        <>
          {loading && <ThemedText>Loading Pokémons...</ThemedText>}
          {error && <ThemedText>Error loading Pokémons: {error.message}</ThemedText>}
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 64,
    padding: 16,
  },
});
