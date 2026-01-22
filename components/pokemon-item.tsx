import { GetPokemonsQuery } from '@/graphql/types/graphql';
import { parsePokemonName } from '@/lib/pokemonNames';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type Props = GetPokemonsQuery['pokemons'][number] & {
  index?: number;
};

const SWIPE_ACTION_TRIGGER_THRESHOLD = 80;
const TIME_TO_ACTIVATE_PAN = 50; // ms
const TOUCH_SLOP = 5; // px

export default function PokemonItem({ id, name, pokemonsprites, index }: Props) {
  const translationX = useSharedValue(0);
  const touchStart = useSharedValue({ x: 0, y: 0, time: 0 });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  const swipeLeftAction = () => {
    'worklet';
    console.log(`Swiped left on Pokémon ID: ${id}, Name: ${name}`);
  };

  const swipeRightAction = () => {
    'worklet';
    console.log(`Swiped right on Pokémon ID: ${id}, Name: ${name}`);
  };

  const pan = Gesture.Pan()
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

      // return to the original position with a spring animation
      translationX.value = withSpring(0);
    });

  const pokemonSprite = pokemonsprites?.[0]?.sprites?.['front_default'];
  const isFirst = index === 0; // will be used to play animation only for the first item to indicate interactivity

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.underContainer}>
        <View style={styles.swipeRightAction} />
        <View style={styles.swipeLeftAction} />
        <Animated.View style={[animatedStyles]}>
          <ThemedView style={styles.container}>
            <View style={styles.textContainer}>
              <ThemedText style={styles.pokemonName}>{parsePokemonName(name)}</ThemedText>
              <ThemedText style={styles.pokemonId}>ID: {id}</ThemedText>
            </View>
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
  },
  swipeLeftAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: '#F44336',
    borderRadius: 8,
  },
  container: {
    borderRadius: 8,
    flexDirection: 'row',
    paddingRight: 12,
    paddingLeft: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
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
});
