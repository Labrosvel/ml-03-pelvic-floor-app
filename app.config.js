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
  };
};
