import React, { useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type Props = {
  index?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: React.ReactNode;
};

const SWIPE_ACTION_TRIGGER_THRESHOLD = 80;
const TIME_TO_ACTIVATE_PAN = 50; // ms
const TOUCH_SLOP = 5; // px

export default function SwipeableItem({ index, onSwipeLeft, onSwipeRight, children }: Props) {
  const translationX = useSharedValue(0);
  const touchStart = useSharedValue({ x: 0, y: 0, time: 0 });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

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
        if (onSwipeLeft) scheduleOnRN(onSwipeLeft);
      } else if (translationX.value >= SWIPE_ACTION_TRIGGER_THRESHOLD) {
        if (onSwipeRight) scheduleOnRN(onSwipeRight);
      }
      translationX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    });

  useEffect(() => {
    if (index !== 0) return;

    const LEFT = -90;
    const RIGHT = 90;
    const START_DELAY = 300;
    const STEP_DELAY = 800;
    const DURATION = 700;
    const easing = Easing.inOut(Easing.cubic);

    const t1 = setTimeout(() => {
      translationX.value = withTiming(LEFT, { duration: DURATION, easing });
    }, START_DELAY);

    const t2 = setTimeout(() => {
      translationX.value = withTiming(RIGHT, { duration: DURATION, easing });
    }, START_DELAY + STEP_DELAY);

    const t3 = setTimeout(
      () => {
        translationX.value = withTiming(0, { duration: DURATION, easing });
      },
      START_DELAY + STEP_DELAY * 2
    );

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [index]);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyles}>{children}</Animated.View>
    </GestureDetector>
  );
}
