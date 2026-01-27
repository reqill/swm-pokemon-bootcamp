import { PhotoPinMarker, Pin, SimplePinMarker } from '@/components/map';
import { ThemedView } from '@/components/themed-view';
import { CRACOW_REGION, MOCK_PHOTO_PINS, PhotoPin } from '@/lib/mock-photo-pins';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { LongPressEvent } from 'react-native-maps';

export default function MapScreen() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [photoPins, setPhotoPins] = useState<PhotoPin[]>(MOCK_PHOTO_PINS);

  const handleLongPress = useCallback((event: LongPressEvent) => {
    const { coordinate } = event.nativeEvent;
    const newPin: Pin = {
      id: Date.now().toString(),
      coordinate,
    };
    setPins((currentPins) => [...currentPins, newPin]);
  }, []);

  const handleDeletePin = useCallback((pinId: string) => {
    Alert.alert('Delete Pin', 'Are you sure you want to delete this pin?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPins((currentPins) => currentPins.filter((pin) => pin.id !== pinId));
        },
      },
    ]);
  }, []);

  const handleDeletePhotoPin = useCallback((pinId: string) => {
    Alert.alert('Delete Photo Pin', 'Are you sure you want to delete this photo pin?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPhotoPins((currentPins) => currentPins.filter((pin) => pin.id !== pinId));
        },
      },
    ]);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <MapView style={styles.map} onLongPress={handleLongPress} initialRegion={CRACOW_REGION}>
        {pins.map((pin) => (
          <SimplePinMarker key={pin.id} pin={pin} onPress={handleDeletePin} />
        ))}
        {photoPins.map((photoPin) => (
          <PhotoPinMarker key={photoPin.id} pin={photoPin} onDelete={handleDeletePhotoPin} />
        ))}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
