import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFavoritePokemon } from '@/context/favorite-pokemon-context';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Camera, Face, FrameFaceDetectionOptions } from 'react-native-vision-camera-face-detector';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function CameraScreen() {
  const isFocused = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { favoritePokemon } = useFavoritePokemon();
  const device = useCameraDevice('front');

  const face = useSharedValue<Pick<Face, 'bounds' | 'rollAngle' | 'yawAngle' | 'pitchAngle'>>({
    bounds: { height: 0, width: 0, x: 0, y: 0 },
    rollAngle: 0,
    yawAngle: 0,
    pitchAngle: 0,
  });

  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
    performanceMode: 'fast',
    classificationMode: 'none',
    landmarkMode: 'none',
    contourMode: 'none',
    trackingEnabled: true,
    windowWidth,
    windowHeight,
    cameraFacing: 'front',
    autoMode: true,
  }).current;

  const handleFacesDetection = (faces: Face[]) => {
    if (faces?.length > 0) {
      const firstDetectedFace = faces[0];
      const { width, height, x, y } = firstDetectedFace.bounds;

      const foreheadSize = Math.min(width, height) * 0.8;
      const foreheadX = x + (width - foreheadSize) / 2;
      const foreheadY = y - foreheadSize * 0.3;

      const mirroredRoll = -firstDetectedFace.rollAngle!;
      const mirroredYaw = -firstDetectedFace.yawAngle!;

      face.value = {
        bounds: {
          height: foreheadSize,
          width: foreheadSize,
          x: foreheadX,
          y: foreheadY,
        },
        rollAngle: mirroredRoll ?? 0,
        yawAngle: mirroredYaw ?? 0,
        pitchAngle: firstDetectedFace.pitchAngle ?? 0,
      };
    } else {
      face.value = {
        bounds: { height: 0, width: 0, x: 0, y: 0 },
        rollAngle: 0,
        yawAngle: 0,
        pitchAngle: 0,
      };
    }
  };

  const faceBoxStyles = useAnimatedStyle(() => ({
    width: face.value.bounds.width,
    height: face.value.bounds.height,
    left: face.value.bounds.x,
    top: face.value.bounds.y,
    transform: [
      { rotateZ: `${-face.value.rollAngle}deg` },
      {
        rotateY: `${face.value.yawAngle}deg`,
      },
      {
        rotateX: `${face.value.pitchAngle}deg`,
      },
    ],
  }));

  if (!device || !hasPermission) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>To use this feature, please grant camera access.</ThemedText>
        <ThemedText onPress={requestPermission} style={{ marginTop: 16, color: 'blue' }}>
          Grant Camera Permission
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        faceDetectionCallback={handleFacesDetection}
        faceDetectionOptions={faceDetectionOptions}
      />
      <AnimatedImage
        source={favoritePokemon?.pokemonsprites?.[0]?.sprites?.['front_default'] || ''}
        style={[styles.image, faceBoxStyles]}
        contentFit="contain"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
