import * as ExpoInAppUpdates from 'expo-in-app-updates';
import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';

/** Prompt for a Play Store update on launch and when returning to the app (Android only). */
export function usePlayStoreUpdate() {
  const checking = useRef(false);

  useEffect(() => {
    if (__DEV__ || Platform.OS !== 'android') return;

    const checkForUpdate = async () => {
      if (checking.current) return;
      checking.current = true;

      try {
        await ExpoInAppUpdates.checkAndStartUpdate(true);
      } catch {
        // Not installed from Play, or no update available — ignore.
      } finally {
        checking.current = false;
      }
    };

    void checkForUpdate();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void checkForUpdate();
      }
    });

    return () => subscription.remove();
  }, []);
}
