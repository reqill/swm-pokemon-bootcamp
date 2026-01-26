import { Skia } from '@shopify/react-native-skia';
import { File, Paths } from 'expo-file-system';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

export type FaceData = {
  bounds: { x: number; y: number; width: number; height: number };
  rollAngle: number;
  yawAngle: number;
  pitchAngle: number;
};

export type PhotoProcessingParams = {
  photoPath: string;
  photoWidth: number;
  photoHeight: number;
  faceData: FaceData;
  location: Location.LocationObject | null;
  pokemonSpriteUrl: string | null;
  windowWidth: number;
  windowHeight: number;
};

export type ProcessingResult = {
  success: boolean;
  assetUri?: string;
  error?: string;
  hasPokemonOverlay: boolean;
  location: Location.LocationObject | null;
};

async function compositeImage(
  photoPath: string,
  photoWidth: number,
  photoHeight: number,
  faceData: FaceData,
  pokemonSpriteUrl: string,
  windowWidth: number,
  windowHeight: number
): Promise<string | null> {
  const photoData = await Skia.Data.fromURI(photoPath);
  const photoImage = Skia.Image.MakeImageFromEncoded(photoData);
  if (!photoImage) return null;

  const spriteData = await Skia.Data.fromURI(pokemonSpriteUrl);
  const spriteImage = Skia.Image.MakeImageFromEncoded(spriteData);
  if (!spriteImage) return null;

  const scaleX = photoWidth / windowWidth;
  const scaleY = photoHeight / windowHeight;

  const scaledBounds = {
    x: faceData.bounds.x * scaleX,
    y: faceData.bounds.y * scaleY,
    width: faceData.bounds.width * scaleX,
    height: faceData.bounds.height * scaleY,
  };

  const spriteAspectRatio = spriteImage.width() / spriteImage.height();
  let drawWidth = scaledBounds.width;
  let drawHeight = scaledBounds.height;

  if (spriteAspectRatio > 1) {
    drawHeight = drawWidth / spriteAspectRatio;
  } else {
    drawWidth = drawHeight * spriteAspectRatio;
  }

  const offsetX = (scaledBounds.width - drawWidth) / 2;
  const offsetY = (scaledBounds.height - drawHeight) / 2;

  const surface = Skia.Surface.Make(photoWidth, photoHeight);
  if (!surface) return null;

  const canvas = surface.getCanvas();

  canvas.drawImage(photoImage, 0, 0);

  canvas.save();
  const centerX = scaledBounds.x + scaledBounds.width / 2;
  const centerY = scaledBounds.y + scaledBounds.height / 2;
  canvas.translate(centerX, centerY);
  canvas.rotate(-faceData.rollAngle, 0, 0);
  canvas.translate(-scaledBounds.width / 2 + offsetX, -scaledBounds.height / 2 + offsetY);

  const srcRect = Skia.XYWHRect(0, 0, spriteImage.width(), spriteImage.height());
  const dstRect = Skia.XYWHRect(0, 0, drawWidth, drawHeight);
  canvas.drawImageRect(spriteImage, srcRect, dstRect, Skia.Paint());
  canvas.restore();

  const compositeImg = surface.makeImageSnapshot();
  const compositeData = compositeImg.encodeToBase64();
  if (!compositeData) return null;

  const tempFile = new File(Paths.cache, `pokemon_photo_${Date.now()}.jpg`);
  const binaryString = atob(compositeData);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  tempFile.create();
  tempFile.write(bytes);

  return tempFile.uri;
}

export async function processPhoto(params: PhotoProcessingParams): Promise<ProcessingResult> {
  const { photoPath, photoWidth, photoHeight, faceData, pokemonSpriteUrl, windowWidth, windowHeight, location } =
    params;

  const hasFaceDetected = faceData.bounds.width > 0 && faceData.bounds.height > 0;
  let finalPhotoUri = photoPath;
  let hasPokemonOverlay = false;

  if (hasFaceDetected && pokemonSpriteUrl) {
    try {
      const compositeUri = await compositeImage(
        photoPath,
        photoWidth,
        photoHeight,
        faceData,
        pokemonSpriteUrl,
        windowWidth,
        windowHeight
      );

      if (compositeUri) {
        finalPhotoUri = compositeUri;
        hasPokemonOverlay = true;
      }
    } catch (error) {
      console.warn('Failed to composite Pokemon sprite, using original photo instead:', error);
    }
  }

  const asset = await MediaLibrary.createAssetAsync(finalPhotoUri);

  return {
    success: true,
    assetUri: asset.uri,
    hasPokemonOverlay,
    location,
  };
}
