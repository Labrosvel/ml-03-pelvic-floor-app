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
  scrollFieldIntoView: (target: View | null) => void;
};

const ScreenScrollContext = createContext<ScreenScrollContextValue | null>(null);

/** Scroll a form field above the keyboard on native (no-op on web). */
export function useScreenFieldFocus() {
  return useContext(ScreenScrollContext)?.scrollFieldIntoView ?? (() => {});
}

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Stack header height + safe area — pass from screens under a Stack header. */
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
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const isWeb = Platform.OS === 'web';

  const scrollFieldIntoView = useCallback(
    (target: View | null) => {
      if (isWeb || !target || keyboardInset <= 0) return;

      target.measureInWindow((_x, y, _width, height) => {
        const windowHeight = Dimensions.get('window').height;
        const visibleBottom = windowHeight - keyboardInset - keyboardVerticalOffset - spacing.lg;
        const fieldBottom = y + height;

        if (fieldBottom > visibleBottom) {
          scrollRef.current?.scrollTo({
            y: scrollY.current + (fieldBottom - visibleBottom),
            animated: true,
          });
        }
      });
    },
    [isWeb, keyboardInset, keyboardVerticalOffset],
  );

  const scrollContext = useRef<ScreenScrollContextValue>({ scrollFieldIntoView });
  scrollContext.current.scrollFieldIntoView = scrollFieldIntoView;

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

  const scrollBody = isWeb ? (
    scrollView
  ) : (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
