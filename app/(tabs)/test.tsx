import { ContentTransitionView } from '@/modules/content-transition-view';
import { useState } from 'react';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WebView() {
  const [value, setValue] = useState(9999999999999);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="Increment" onPress={() => setValue((p) => p + 1)} />
      <Button title="Decrement" onPress={() => setValue((p) => p - 1)} />
      <Button title="Reset" onPress={() => setValue(9999999999999)} />
      <ContentTransitionView style={{ flex: 1 }} value={value} />
    </SafeAreaView>
  );
}
