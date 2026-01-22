import { FlatList, StyleSheet, View } from 'react-native';

import PokemonItem from '@/components/pokemon-item';
import { ThemedText } from '@/components/themed-text';
import { PokemonSheetProvider } from '@/context/pokemon-sheet-context';
import { GET_NUMBER_OF_UNIQUE_POKEMONS, GET_POKEMONS } from '@/graphql/queries/pokemons';
import { useQuery } from '@apollo/client/react';
import { useCallback } from 'react';

const PAGE_SIZE = 50;

export default function ExploreTab() {
  const { loading, error, data, fetchMore } = useQuery(GET_POKEMONS, {
    variables: {
      limit: PAGE_SIZE,
      offset: 0,
    },
  });
  const { data: numberOfUniquePokemons, loading: loadingTotalPokemons } = useQuery(GET_NUMBER_OF_UNIQUE_POKEMONS);

  const pokemons = data?.pokemons || [];
  const totalPokemons = numberOfUniquePokemons?.pokemon_aggregate?.aggregate?.count || 0;

  const loadMorePokemons = useCallback(() => {
    if (loading || pokemons.length >= totalPokemons) return;
    fetchMore({
      variables: {
        offset: pokemons.length,
      },
    });
  }, [loading, fetchMore, pokemons.length, totalPokemons]);

  return (
    <PokemonSheetProvider>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <PokemonItem {...item} index={index} />}
        onEndReachedThreshold={0.6}
        onEndReached={loadMorePokemons}
        style={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={<>{loading && pokemons.length === 0 && <ThemedText>Loading Pokémons...</ThemedText>}</>}
        ListFooterComponent={
          <>
            {loading && pokemons.length !== 0 && <ThemedText>Loading more Pokémons...</ThemedText>}
            {error && <ThemedText>Error loading Pokémons: {error.message}</ThemedText>}
            {pokemons.length >= totalPokemons && !loadingTotalPokemons && (
              <ThemedText>There are no more Pokémons to load :o</ThemedText>
            )}
          </>
        }
      />
    </PokemonSheetProvider>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 64,
    padding: 16,
  },
  separator: { height: 8 },
});
