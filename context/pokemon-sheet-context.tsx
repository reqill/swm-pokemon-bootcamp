import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GetPokemonsQuery } from '@/graphql/types/graphql';
import { snakeCaseToTitleCase } from '@/lib/caseTransformers';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type PokemonType = GetPokemonsQuery['pokemons'][number] | null;

type PokemonSheetContextType = {
  showPokemon: (pokemon: PokemonType) => void;
  close: () => void;
};

const PokemonSheetContext = createContext<PokemonSheetContextType | undefined>(undefined);

export const PokemonSheetProvider = ({ children }: { children: ReactNode }) => {
  const [pokemon, setPokemon] = useState<PokemonType>(null);
  const sheetRef = useRef<BottomSheet | null>(null);

  const showPokemon = useCallback((pokemon: PokemonType) => {
    setPokemon(pokemon);
    sheetRef.current?.expand?.();
  }, []);

  const close = useCallback(() => {
    sheetRef.current?.close?.();
  }, []);

  return (
    <PokemonSheetContext.Provider value={{ showPokemon, close }}>
      {children}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['40%', '75%']}
        enablePanDownToClose={true}
        backdropComponent={BottomSheetBackdrop}
      >
        <BottomSheetView style={styles.sheetContent}>
          {pokemon ? (
            <ThemedView>
              <View style={styles.header}>
                <Image
                  source={pokemon.pokemonsprites?.[0]?.sprites?.['front_default'] || ''}
                  style={styles.image}
                  contentFit="contain"
                />
                <View style={styles.headerText}>
                  <ThemedText style={styles.title}>{snakeCaseToTitleCase(pokemon.name)}</ThemedText>
                  <ThemedText>ID: {pokemon.id}</ThemedText>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <ThemedText style={styles.label}>Height</ThemedText>
                  <ThemedText style={styles.value}>{pokemon.height ?? '—'}</ThemedText>
                </View>
                <View style={styles.col}>
                  <ThemedText style={styles.label}>Weight</ThemedText>
                  <ThemedText style={styles.value}>{pokemon.weight ?? '—'}</ThemedText>
                </View>
                <View style={styles.col}>
                  <ThemedText style={styles.label}>XP</ThemedText>
                  <ThemedText style={styles.value}>{pokemon.base_experience ?? '—'}</ThemedText>
                </View>
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Types</ThemedText>
                <View style={styles.chipsRow}>
                  {(pokemon.pokemontypes || []).map((t) => (
                    <View key={t?.type?.name} style={styles.chip}>
                      <ThemedText style={styles.chipText}>{t?.type?.name}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Abilities</ThemedText>
                {(pokemon.pokemonabilities || []).map((a) => (
                  <ThemedText key={a?.ability?.name} style={styles.listItem}>
                    • {a?.ability?.name}
                  </ThemedText>
                ))}
              </View>
            </ThemedView>
          ) : (
            <ThemedText>No data</ThemedText>
          )}
        </BottomSheetView>
      </BottomSheet>
    </PokemonSheetContext.Provider>
  );
};

export const usePokemonSheet = () => {
  const ctx = useContext(PokemonSheetContext);
  if (!ctx) throw new Error('usePokemonSheet must be used within PokemonSheetProvider');
  return ctx;
};

const styles = StyleSheet.create({
  sheetContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});
