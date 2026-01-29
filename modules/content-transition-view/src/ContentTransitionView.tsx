import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ViewProps } from 'react-native';

export type Props = ViewProps & {
  value: number;
};

const NativeView: React.ComponentType<Props> = requireNativeViewManager('ContentTransitionView');

export default function ContentTransitionView(props: Props) {
  return <NativeView {...props} />;
}
