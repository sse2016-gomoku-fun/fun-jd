import rp from 'request-promise-native';

const api = {};

async function requestAsync(actionUrl, options = {}) {
  try {
    return await rp({
      url: `${DI.config.api.url}${actionUrl}`,
      auth: {
        user: DI.config.api.credential.username,
        pass: DI.config.api.credential.password,
      },
      json: true,
      gzip: true,
      ...options,
    });
  } catch (ignored) {
    throw new Error('Failed to connect to Portal API service');
  }
}

export default api;
