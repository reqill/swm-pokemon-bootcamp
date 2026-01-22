import { GetPokemonsQuery } from '@/graphql/types/graphql';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const FAVORITE_POKEMON_KEY = 'favoritePokemon';

type PokemonType = GetPokemonsQuery['pokemons'][0];

interface FavoritePokemonContextType {
  favoritePokemon: PokemonType | null;
  setFavoritePokemon: (pokemon: PokemonType | null) => Promise<void>;
}

const FavoritePokemonContext = createContext<FavoritePokemonContextType | undefined>(undefined);

export const FavoritePokemonProvider = ({ children }: { children: ReactNode }) => {
  const [favoritePokemonState, setFavoritePokemonState] = useState<PokemonType | null>(null);

  useEffect(() => {
    const loadFavorite = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITE_POKEMON_KEY);
        if (stored) {
          setFavoritePokemonState(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load favorite pokemon', e);
      }
    };
    loadFavorite();
  }, []);

  const setFavoritePokemon = async (pokemon: PokemonType | null) => {
    setFavoritePokemonState(pokemon);
    try {
      if (pokemon) {
        await AsyncStorage.setItem(FAVORITE_POKEMON_KEY, JSON.stringify(pokemon));
      } else {
        await AsyncStorage.removeItem(FAVORITE_POKEMON_KEY);
      }
    } catch (e) {
      console.error('Failed to save favorite pokemon', e);
    }
  };

  return (
    <FavoritePokemonContext.Provider value={{ favoritePokemon: favoritePokemonState, setFavoritePokemon }}>
      {children}
    </FavoritePokemonContext.Provider>
  );
};

export const useFavoritePokemon = () => {
  const context = useContext(FavoritePokemonContext);
  if (!context) {
    throw new Error('useFavoritePokemon must be used within a FavoritePokemonProvider');
  }
  return context;
};
