export type PhotoPin = {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  imageUri: string;
  title?: string;
  timestamp: number;
};

export const MOCK_PHOTO_PINS: PhotoPin[] = [
  {
    id: 'mock-photo-1',
    coordinate: {
      latitude: 50.0619,
      longitude: 19.9368,
    },
    imageUri: 'https://picsum.photos/seed/cracow1/200/200',
    title: 'Cracow Main Square',
    timestamp: Date.now(),
  },
  {
    id: 'mock-photo-2',
    coordinate: {
      latitude: 50.0647,
      longitude: 19.945,
    },
    imageUri: 'https://picsum.photos/seed/cracow2/200/200',
    title: 'Wawel Castle',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'mock-photo-3',
    coordinate: {
      latitude: 50.054,
      longitude: 19.9352,
    },
    imageUri: 'https://picsum.photos/seed/cracow3/200/200',
    title: 'Kazimierz District',
    timestamp: Date.now() - 7200000,
  },
];

export const CRACOW_REGION = {
  latitude: 50.0619,
  longitude: 19.9368,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
