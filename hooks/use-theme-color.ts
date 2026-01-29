import { Colors } from '@/constants/theme';
import * as Settings from '@/modules/my-module/src';
import { useEffect, useState } from 'react';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const [theme, setTheme] = useState(Settings.getResolvedTheme());

  useEffect(() => {
    const subscription = Settings.addThemeListener(({ theme: newTheme }) => {
      setTheme(newTheme);
    });

    return () => subscription.remove();
  }, []);

  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
