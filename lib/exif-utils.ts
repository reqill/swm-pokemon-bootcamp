import * as Location from 'expo-location';
import piexif from 'piexifjs';

export function degreesToDMS(degrees: number): [[number, number], [number, number], [number, number]] {
  const absolute = Math.abs(degrees);
  const d = Math.floor(absolute);
  const minFloat = (absolute - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60 * 100);

  return [
    [d, 1],
    [m, 1],
    [s, 100],
  ];
}

export function embedGPSIntoJpeg(base64Jpeg: string, location: Location.LocationObject): string {
  try {
    const dataUri = `data:image/jpeg;base64,${base64Jpeg}`;

    const gpsData: Record<string, unknown> = {};

    gpsData[piexif.GPSIFD.GPSLatitudeRef] = location.coords.latitude >= 0 ? 'N' : 'S';
    gpsData[piexif.GPSIFD.GPSLatitude] = degreesToDMS(location.coords.latitude);

    gpsData[piexif.GPSIFD.GPSLongitudeRef] = location.coords.longitude >= 0 ? 'E' : 'W';
    gpsData[piexif.GPSIFD.GPSLongitude] = degreesToDMS(location.coords.longitude);

    if (location.coords.altitude !== null && location.coords.altitude !== undefined) {
      gpsData[piexif.GPSIFD.GPSAltitudeRef] = location.coords.altitude >= 0 ? 0 : 1;
      gpsData[piexif.GPSIFD.GPSAltitude] = [Math.abs(Math.round(location.coords.altitude * 100)), 100];
    }

    const now = new Date(location.timestamp);
    const timeStamp: [[number, number], [number, number], [number, number]] = [
      [now.getUTCHours(), 1],
      [now.getUTCMinutes(), 1],
      [now.getUTCSeconds(), 1],
    ];
    gpsData[piexif.GPSIFD.GPSTimeStamp] = timeStamp;

    const dateStamp = `${now.getUTCFullYear()}:${String(now.getUTCMonth() + 1).padStart(2, '0')}:${String(now.getUTCDate()).padStart(2, '0')}`;
    gpsData[piexif.GPSIFD.GPSDateStamp] = dateStamp;

    const exifObj = {
      '0th': {},
      Exif: {},
      GPS: gpsData,
      Interop: {},
      '1st': {},
      thumbnail: undefined,
    };

    const exifBytes = piexif.dump(exifObj);
    const newDataUri = piexif.insert(exifBytes, dataUri);

    return newDataUri.replace('data:image/jpeg;base64,', '');
  } catch (error) {
    console.warn('Failed to embed GPS EXIF data:', error);
    return base64Jpeg; // Return original if embedding fails
  }
}
