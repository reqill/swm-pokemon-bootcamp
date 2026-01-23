import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFavoritePokemon } from '@/context/favorite-pokemon-context';
import { snakeCaseToTitleCase } from '@/lib/caseTransformers';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { favoritePokemon, setFavoritePokemon } = useFavoritePokemon();
  const router = useRouter();

  if (!favoritePokemon) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyTitle}>No favorite Pokémon yet</ThemedText>
        <ThemedText style={styles.emptySubtitle}>Pick a Pokémon you love and it will appear here.</ThemedText>
        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/explore')}>
          <ThemedText style={styles.ctaText}>Explore Pokémon</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const sprite = favoritePokemon.pokemonsprites?.[0]?.sprites?.['front_default'] || '';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image style={styles.pokemonImage} source={sprite} />
          <ThemedText style={styles.name}>{snakeCaseToTitleCase(favoritePokemon.name)}</ThemedText>
          <TouchableOpacity
            style={styles.unfavButton}
            onPress={() => {
              try {
                setFavoritePokemon(null);
              } catch (e) {
                console.error('Failed to unfavorite', e);
              }
            }}
          >
            <ThemedText style={styles.unfavText}>No Longer My Favorite :c</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Basics</ThemedText>
          <View style={styles.row}>
            <View style={styles.col}>
              <ThemedText style={styles.label}>Height</ThemedText>
              <ThemedText style={styles.value}>{favoritePokemon.height ?? '—'}</ThemedText>
            </View>
            <View style={styles.col}>
              <ThemedText style={styles.label}>Weight</ThemedText>
              <ThemedText style={styles.value}>{favoritePokemon.weight ?? '—'}</ThemedText>
            </View>
            <View style={styles.col}>
              <ThemedText style={styles.label}>XP</ThemedText>
              <ThemedText style={styles.value}>{favoritePokemon.base_experience ?? '—'}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Types</ThemedText>
          <View style={styles.chipsRow}>
            {(favoritePokemon.pokemontypes || []).map((t) => (
              <View key={t?.type?.name} style={styles.chip}>
                <ThemedText style={styles.chipText}>{t?.type?.name}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Abilities</ThemedText>
          {(favoritePokemon.pokemonabilities || []).map((a) => (
            <ThemedText key={a?.ability?.name} style={styles.listItem}>
              • {snakeCaseToTitleCase(a?.ability?.name || '')}
            </ThemedText>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#ffcb05',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pokemonImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f2f2f2',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#6b6b6b',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listItem: {
    fontSize: 14,
    marginBottom: 6,
  },
  unfavButton: {
    marginTop: 10,
    backgroundColor: '#ff6b6b22',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  unfavText: {
    color: '#ff3b30',
    fontWeight: '700',
  },
});
