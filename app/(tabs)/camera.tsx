import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useCameraDevice, useCameraPermission, Camera as VisionCamera } from 'react-native-vision-camera';
// import { Camera, Face, FrameFaceDetectionOptions } from 'react-native-vision-camera-face-detector';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function CameraScreen() {
  const camera = useRef<VisionCamera>(null);
  const isFocused = useIsFocused();
  const { hasPermission: hasCameraPermission, requestPermission: requestCameraPermission } = useCameraPermission();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  // const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  // const { favoritePokemon } = useFavoritePokemon();
  const device = useCameraDevice('front');
  // const [isProcessing, setIsProcessing] = useState(false);

  // const { getLocation } = useLocationPrefetch({ enabled: isFocused });

  useEffect(() => {
    if (!mediaLibraryPermission?.granted) {
      requestMediaLibraryPermission();
    }
  }, [mediaLibraryPermission, requestMediaLibraryPermission]);

  // const face = useSharedValue<FaceData>({
  //   bounds: { height: 0, width: 0, x: 0, y: 0 },
  //   rollAngle: 0,
  //   yawAngle: 0,
  //   pitchAngle: 0,
  // });

  // const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
  //   performanceMode: 'fast',
  //   classificationMode: 'none',
  //   landmarkMode: 'none',
  //   contourMode: 'none',
  //   trackingEnabled: true,
  //   windowWidth,
  //   windowHeight,
  //   cameraFacing: 'front',
  //   autoMode: true,
  // }).current;

  // const handleFacesDetection = (faces: Face[]) => {
  //   if (faces?.length > 0) {
  //     const firstDetectedFace = faces[0];
  //     const { width, height, x, y } = firstDetectedFace.bounds;

  //     const foreheadSize = Math.min(width, height) * 0.8;
  //     const foreheadX = x + (width - foreheadSize) / 2;
  //     const foreheadY = y - foreheadSize * 0.3;

  //     const mirroredRoll = -firstDetectedFace.rollAngle!;
  //     const mirroredYaw = -firstDetectedFace.yawAngle!;

  //     face.value = {
  //       bounds: {
  //         height: foreheadSize,
  //         width: foreheadSize,
  //         x: foreheadX,
  //         y: foreheadY,
  //       },
  //       rollAngle: mirroredRoll ?? 0,
  //       yawAngle: mirroredYaw ?? 0,
  //       pitchAngle: firstDetectedFace.pitchAngle ?? 0,
  //     };
  //   } else {
  //     face.value = {
  //       bounds: { height: 0, width: 0, x: 0, y: 0 },
  //       rollAngle: 0,
  //       yawAngle: 0,
  //       pitchAngle: 0,
  //     };
  //   }
  // };

  // const faceBoxStyles = useAnimatedStyle(() => ({
  //   width: face.value.bounds.width,
  //   height: face.value.bounds.height,
  //   left: face.value.bounds.x,
  //   top: face.value.bounds.y,
  //   transform: [
  //     { rotateZ: `${-face.value.rollAngle}deg` },
  //     {
  //       rotateY: `${face.value.yawAngle}deg`,
  //     },
  //     {
  //       rotateX: `${face.value.pitchAngle}deg`,
  //     },
  //   ],
  // }));

  // const takePhoto = useCallback(async () => {
  //   if (!camera.current || isProcessing) return;

  //   try {
  //     setIsProcessing(true);

  //     const capturedFaceData = face.value ?? {
  //       bounds: { height: 0, width: 0, x: 0, y: 0 },
  //       rollAngle: 0,
  //       yawAngle: 0,
  //       pitchAngle: 0,
  //     };

  //     const photo = await camera.current.takePhoto({ flash: 'off' });
  //     const photoPath = `file://${photo.path}`;

  //     const location = getLocation();
  //     const pokemonSpriteUrl = favoritePokemon?.pokemonsprites?.[0]?.sprites?.['front_default'] ?? null;

  //     if (!mediaLibraryPermission?.granted) {
  //       Alert.alert('Permission required', 'Please grant media library access to save photos.');
  //       setIsProcessing(false);
  //       return;
  //     }

  //     const params: PhotoProcessingParams = {
  //       photoPath,
  //       photoWidth: photo.width,
  //       photoHeight: photo.height,
  //       faceData: capturedFaceData,
  //       location,
  //       pokemonSpriteUrl,
  //       windowWidth,
  //       windowHeight,
  //     };

  //     await processPhoto(params);
  //   } catch (error) {
  //     console.error('Error taking photo:', error);
  //     Alert.alert('Error', 'Failed to take photo. Please try again.');
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // }, [getLocation, mediaLibraryPermission, favoritePokemon, windowWidth, windowHeight, isProcessing]);

  if (!device || !hasCameraPermission) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>To use this feature, please grant camera access.</ThemedText>
        <ThemedText onPress={requestCameraPermission} style={{ marginTop: 16, color: 'blue' }}>
          Grant Camera Permission
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={StyleSheet.absoluteFill}>
      <VisionCamera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        // faceDetectionCallback={handleFacesDetection}
        // faceDetectionOptions={faceDetectionOptions}
        // photo
      />
      {/* <AnimatedImage
        source={favoritePokemon?.pokemonsprites?.[0]?.sprites?.['front_default'] || ''}
        style={[styles.image, faceBoxStyles]}
        contentFit="contain"
      />
      {isProcessing && <Animated.View style={styles.grayOutArea} />}
      <TouchableOpacity style={styles.shutterButton} onPress={takePhoto} disabled={isProcessing}>
        {isProcessing && <ActivityIndicator size="large" color="gray" />}
      </TouchableOpacity> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  grayOutArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  shutterButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
