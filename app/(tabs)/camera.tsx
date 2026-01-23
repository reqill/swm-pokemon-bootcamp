import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { FrameFaceDetectionOptions, useFaceDetector } from 'react-native-vision-camera-face-detector';

export default function CameraScreen() {
  const isFocused = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();

  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
    autoMode: true,
    classificationMode: 'none',
    windowHeight: Dimensions.get('window').height,
    windowWidth: Dimensions.get('window').width,
    performanceMode: 'fast',
    landmarkMode: 'none',
  }).current;

  const device = useCameraDevice('front');
  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    return () => stopListeners();
  }, []);

  useEffect(() => {
    if (isFocused && !hasPermission) requestPermission();
  }, [hasPermission, requestPermission, isFocused]);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    const faces = detectFaces(frame);

    if (faces.length > 0) {
      console.log(`Detected ${JSON.stringify(faces)}`);
    }
  }, []);

  if (!device || !hasPermission) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Requesting Camera Access...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isFocused}
      frameProcessor={frameProcessor}
      pixelFormat="yuv"
    />
  );
}

const styles = StyleSheet.create({
  pokemonSprite: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: 0,
    left: 0,
  },
});
