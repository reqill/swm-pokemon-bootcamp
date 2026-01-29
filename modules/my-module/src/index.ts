import { EventSubscription } from 'expo-modules-core';
import MyModule from './MyModule';
import { Theme, ThemeChangeEvent } from './MyModule.types';

export type { Theme, ThemeChangeEvent };

export function addThemeListener(listener: (event: ThemeChangeEvent) => void): EventSubscription {
  return MyModule.addListener('onChangeTheme', listener);
}

export function getTheme(): Theme {
  return MyModule.getTheme();
}

export function setTheme(theme: Theme): void {
  return MyModule.setTheme(theme);
}

export function getNativeTheme(): Exclude<Theme, 'system'> {
  return MyModule.getNativeTheme();
}

export function getResolvedTheme(): Exclude<Theme, 'system'> {
  return MyModule.getResolvedTheme();
}
