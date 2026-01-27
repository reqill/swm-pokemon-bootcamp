import { Marker } from 'react-native-maps';

export type Pin = {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type SimplePinMarkerProps = {
  pin: Pin;
  onPress: (id: string) => void;
};

export function SimplePinMarker({ pin, onPress }: SimplePinMarkerProps) {
  return <Marker coordinate={pin.coordinate} onPress={() => onPress(pin.id)} />;
}
