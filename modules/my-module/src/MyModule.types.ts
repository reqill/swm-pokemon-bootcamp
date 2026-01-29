export type Theme = 'light' | 'dark' | 'system';

export type ThemeChangeEvent = {
  theme: Exclude<Theme, 'system'>;
};

export type MyModuleEvents = {
  onChangeTheme: (params: ThemeChangeEvent) => void;
};
