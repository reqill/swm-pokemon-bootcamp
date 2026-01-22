import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFavoritePokemon } from '@/context/favorite-pokemon-context';
import { parsePokemonName } from '@/lib/pokemonNames';
import { Image } from 'expo-image';

export default function HomeScreen() {
  const { favoritePokemon, setFavoritePokemon } = useFavoritePokemon();

  if (!favoritePokemon) {
    return (
      <ThemedView style={styles.default}>
        <ThemedText>You have no favorite Pokémon selected. Go to the Explore tab to select one!</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.default}>
      <Image
        style={styles.pokemonImage}
        source={favoritePokemon.pokemonsprites?.[0]?.sprites?.['front_default'] || ''}
      />
      <ThemedText>Your favorite Pokémon is {parsePokemonName(favoritePokemon.name)}!</ThemedText>
      {Object.entries(favoritePokemon)
        .filter(([key]) => key !== 'pokemonsprites')
        .map(([key, value]) => (
          <ThemedText key={key}>
            {key}: {JSON.stringify(value)}
          </ThemedText>
        ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    paddingTop: 64,
  },
  pokemonImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
});
