import { PhotoPin } from '@/lib/mock-photo-pins';
import { Image, StyleSheet, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';

type PhotoPinMarkerProps = {
  pin: PhotoPin;
  onDelete: (id: string) => void;
};

export function PhotoPinMarker({ pin, onDelete }: PhotoPinMarkerProps) {
  return (
    <Marker coordinate={pin.coordinate} title={pin.title} onCalloutPress={() => onDelete(pin.id)}>
      <View style={styles.photoMarker}>
        <Image source={{ uri: pin.imageUri }} style={styles.photoThumbnail} />
      </View>
      <Callout tooltip>
        <View style={styles.calloutContainer}>
          <Image source={{ uri: pin.imageUri }} style={styles.calloutImage} />
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  photoMarker: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 3,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutImage: {
    width: 164,
    height: 164,
    borderRadius: 8,
  },
});
