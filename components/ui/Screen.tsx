import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra offset for stack headers on non-scroll screens (e.g. onboarding). */
  keyboardVerticalOffset?: number;
};

function useKeyboardBottomInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setInset(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setInset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return inset;
}

export function Screen({
  children,
  scroll = true,
  style,
  contentStyle,
  keyboardVerticalOffset = 0,
}: ScreenProps) {
  const keyboardInset = useKeyboardBottomInset();

  const scrollBody = (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        contentStyle,
        keyboardInset > 0 && { paddingBottom: spacing.xxl + keyboardInset },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="on-drag"
    >
      {children}
    </ScrollView>
  );

  const staticBody = (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>
    </KeyboardAvoidingView>
  );

  return (
    <LinearGradient colors={[colors.bg, colors.bgDeep]} style={styles.flex}>
      <SafeAreaView style={[styles.flex, style]} edges={['top', 'left', 'right']}>
        {scroll ? scrollBody : staticBody}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fill: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
