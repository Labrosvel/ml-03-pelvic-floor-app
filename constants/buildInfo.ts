import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** Set by CI during web export; falls back for local/dev. */
export const WEB_BUILD_ID = 'local';

/** User-facing version name from app.json → expo.version (baked into the build). */
export function getAppVersion(): string {
  return Constants.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '0.0.0';
}

/** Native version code / CFBundleVersion when available. */
export function getNativeBuildNumber(): string | null {
  if (Platform.OS === 'web') return null;
  return Constants.nativeBuildVersion ?? null;
}

export function getAppVersionLabel(): string {
  const version = getAppVersion();
  const build = getNativeBuildNumber();
  return build ? `${version} (${build})` : version;
}

export function shouldShowWebBuildId(): boolean {
  return Platform.OS === 'web';
}
