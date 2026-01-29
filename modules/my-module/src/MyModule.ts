import { NativeModule, requireNativeModule } from 'expo';

import { MyModuleEvents, Theme } from './MyModule.types';

declare class MyModule extends NativeModule<MyModuleEvents> {
  setTheme: (theme: Theme) => void;
  getTheme: () => Theme;
  getNativeTheme: () => Exclude<Theme, 'system'>;
  getResolvedTheme: () => Exclude<Theme, 'system'>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MyModule>('MyModule');
