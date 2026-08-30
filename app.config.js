const appJson = require('./app.json');

/** @returns {import('expo/config').ExpoConfig} */
module.exports = () => {
  const basePath = (process.env.BASE_PATH || '').replace(/\/$/, '');

  return {
    ...appJson.expo,
    experiments: {
      ...(appJson.expo.experiments || {}),
      ...(basePath ? { baseUrl: basePath } : {}),
    },
    extra: {
      ...(appJson.expo.extra || {}),
      notifyApiUrl: process.env.EXPO_PUBLIC_NOTIFY_API_URL || '',
      notifyApiSecret: process.env.EXPO_PUBLIC_NOTIFY_API_SECRET || '',
    },
  };
};
