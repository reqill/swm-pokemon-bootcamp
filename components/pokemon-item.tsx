import { useFavoritePokemon } from '@/context/favorite-pokemon-context';
import { usePokemonSheet } from '@/context/pokemon-sheet-context';
import { GetPokemonsQuery } from '@/graphql/types/graphql';
import { snakeCaseToTitleCase } from '@/lib/caseTransformers';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

type Props = GetPokemonsQuery['pokemons'][number] & {
  index?: number;
};

const SWIPE_ACTION_TRIGGER_THRESHOLD = 80;
const TIME_TO_ACTIVATE_PAN = 50; // ms
const TOUCH_SLOP = 5; // px

export default function PokemonItem({ index, ...pokemonInfo }: Props) {
  const { id, name, pokemonsprites } = pokemonInfo;
  const { favoritePokemon, setFavoritePokemon } = useFavoritePokemon();
  const { showPokemon } = usePokemonSheet();

  const isFavorite = favoritePokemon?.id === id;
  const translationX = useSharedValue(0);
  const touchStart = useSharedValue({ x: 0, y: 0, time: 0 });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  const setFavoritePokemonSync = () => {
    const fn = async (pokemon: GetPokemonsQuery['pokemons'][number] | null) => {
      if (isFavorite) {
        await setFavoritePokemon(null);
      } else {
        await setFavoritePokemon(pokemon);
      }
    };
    fn(pokemonInfo);
  };

  const swipeLeftAction = () => {
    'worklet';
    scheduleOnRN(setFavoritePokemonSync);
  };

  const showPokemonSync = () => {
    showPokemon(pokemonInfo);
  };

  const swipeRightAction = () => {
    'worklet';
    scheduleOnRN(showPokemonSync);
  };

  const pan = Gesture.Pan()
    // https://github.com/software-mansion/react-native-gesture-handler/issues/1933#issuecomment-1070586410
    .manualActivation(true)
    .onTouchesDown((e) => {
      touchStart.value = {
        x: e.changedTouches[0].x,
        y: e.changedTouches[0].y,
        time: Date.now(),
      };
    })
    .onTouchesMove((e, state) => {
      if (Date.now() - touchStart.value.time > TIME_TO_ACTIVATE_PAN) {
        state.activate();
      } else if (
        Math.abs(touchStart.value.x - e.changedTouches[0].x) > TOUCH_SLOP ||
        Math.abs(touchStart.value.y - e.changedTouches[0].y) > TOUCH_SLOP
      ) {
        state.fail();
      }
    })
    .onUpdate((e) => {
      if (e.translationX < -SWIPE_ACTION_TRIGGER_THRESHOLD) {
        translationX.value = withSpring(
          -SWIPE_ACTION_TRIGGER_THRESHOLD + (e.translationX + SWIPE_ACTION_TRIGGER_THRESHOLD) / 4
        );
      } else if (e.translationX > SWIPE_ACTION_TRIGGER_THRESHOLD) {
        translationX.value = withSpring(
          SWIPE_ACTION_TRIGGER_THRESHOLD + (e.translationX - SWIPE_ACTION_TRIGGER_THRESHOLD) / 4
        );
      } else {
        translationX.value = withSpring(e.translationX);
      }
    })
    .onEnd(() => {
      if (translationX.value <= -SWIPE_ACTION_TRIGGER_THRESHOLD) {
        swipeLeftAction();
      } else if (translationX.value >= SWIPE_ACTION_TRIGGER_THRESHOLD) {
        swipeRightAction();
      }
      translationX.value = withSpring(0);
    });

  const pokemonSprite = pokemonsprites?.[0]?.sprites?.['front_default'];
  const isFirst = index === 0; // will be used to play animation only for the first item to indicate interactivity

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.underContainer}>
        <View style={styles.swipeRightAction}>
          <View style={styles.detailsContainer}>
            <IconSymbol color="rgb(255, 255, 255)" name="eye.fill" size={32} />
            <Text style={styles.detailsText}>See details</Text>
          </View>
        </View>
        <View style={styles.swipeLeftAction}>
          <View style={styles.favoriteContainer}>
            <IconSymbol color="rgb(255, 204, 0)" name={isFavorite ? 'star.fill' : 'star'} size={32} />
            <Text style={styles.favoriteText}>{isFavorite ? 'Unfavorite' : 'Favorite'}</Text>
          </View>
        </View>
        <Animated.View style={[animatedStyles]}>
          <ThemedView style={styles.container}>
            <View style={styles.textContainer}>
              <ThemedText style={styles.pokemonName}>{snakeCaseToTitleCase(name)}</ThemedText>
              <ThemedText style={styles.pokemonId}>ID: {id}</ThemedText>
            </View>
            {isFavorite && (
              <IconSymbol color="rgb(255, 204, 0)" name="star.fill" size={169} style={styles.favoriteIndicator} />
            )}
            <Image source={pokemonSprite} style={styles.image} contentFit="contain" />
          </ThemedView>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  underContainer: {
    position: 'relative',
  },
  swipeRightAction: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  detailsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  detailsText: {
    color: 'white',
    fontSize: 14,
  },
  swipeLeftAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: '#365cf4',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 8,
  },
  favoriteContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 12,
  },
  favoriteText: {
    color: 'white',
    fontSize: 14,
  },
  container: {
    borderRadius: 8,
    flexDirection: 'row',
    paddingRight: 12,
    paddingLeft: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  image: {
    width: 96,
    height: 96,
  },
  pokemonName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  pokemonId: {
    fontSize: 14,
    opacity: 0.7,
  },
  textContainer: {
    flex: 1,
  },
  favoriteIndicator: {
    position: 'absolute',
    right: -24,
    opacity: 0.33,
  },
});
