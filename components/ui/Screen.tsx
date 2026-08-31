import { LinearGradient } from 'expo-linear-gradient';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
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

type ScreenScrollContextValue = {
  registerFocusedField: (target: View | null) => void;
};

const ScreenScrollContext = createContext<ScreenScrollContextValue | null>(null);

/** Keep the focused form field visible above the keyboard on native (no-op on web). */
export function useScreenFieldFocus() {
  return useContext(ScreenScrollContext)?.registerFocusedField ?? (() => {});
}

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Stack header height + safe area — iOS KeyboardAvoidingView only. */
  keyboardVerticalOffset?: number;
};

/** Space to leave above the keyboard — generous, not the bare minimum. */
const KEYBOARD_CLEARANCE = spacing.xxl + spacing.xl;
/** Extra nudge so the focused field sits comfortably in view, not at the edge. */
const KEYBOARD_SCROLL_SLACK = spacing.lg;

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
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const focusedFieldRef = useRef<View | null>(null);
  const isWeb = Platform.OS === 'web';

  const scrollFieldAboveKeyboard = useCallback((target: View, keyboardHeight: number) => {
    target.measureInWindow((_x, y, _width, height) => {
      const windowHeight = Dimensions.get('window').height;
      const visibleBottom = windowHeight - keyboardHeight - KEYBOARD_CLEARANCE;
      const fieldBottom = y + height;

      if (fieldBottom > visibleBottom) {
        scrollRef.current?.scrollTo({
          y: scrollY.current + (fieldBottom - visibleBottom) + KEYBOARD_SCROLL_SLACK,
          animated: true,
        });
      }
    });
  }, []);

  const scrollFocusedField = useCallback(
    (keyboardHeight: number) => {
      const target = focusedFieldRef.current;
      if (!target || keyboardHeight <= 0) return;

      scrollFieldAboveKeyboard(target, keyboardHeight);
      // Android layout settles after keyboard animation; iOS KAV shifts content once.
      const delay = Platform.OS === 'android' ? 100 : 50;
      setTimeout(() => scrollFieldAboveKeyboard(target, keyboardHeight), delay);
    },
    [scrollFieldAboveKeyboard],
  );

  useEffect(() => {
    if (keyboardInset <= 0) return;
    scrollFocusedField(keyboardInset);
  }, [keyboardInset, scrollFocusedField]);

  const registerFocusedField = useCallback(
    (target: View | null) => {
      focusedFieldRef.current = target;
      if (target && keyboardInset > 0) {
        scrollFocusedField(keyboardInset);
      }
    },
    [keyboardInset, scrollFocusedField],
  );

  const scrollContext = useRef<ScreenScrollContextValue>({ registerFocusedField });
  scrollContext.current.registerFocusedField = registerFocusedField;

  const scrollView = (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[
        styles.content,
        contentStyle,
        keyboardInset > 0 && { paddingBottom: spacing.xxl + keyboardInset },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      keyboardDismissMode="on-drag"
      onScroll={(event) => {
        scrollY.current = event.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  );

  // Android: avoid KeyboardAvoidingView + ScrollView — it fights adjustPan/adjustResize.
  // Rely on keyboard inset padding + scroll-into-view instead.
  const scrollBody =
    isWeb || Platform.OS === 'android' ? (
      scrollView
    ) : (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {scrollView}
      </KeyboardAvoidingView>
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
    <ScreenScrollContext.Provider value={scrollContext.current}>
      <LinearGradient colors={[colors.bg, colors.bgDeep]} style={styles.flex}>
        <SafeAreaView style={[styles.flex, style]} edges={['top', 'left', 'right']}>
          {scroll ? scrollBody : staticBody}
        </SafeAreaView>
      </LinearGradient>
    </ScreenScrollContext.Provider>
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
