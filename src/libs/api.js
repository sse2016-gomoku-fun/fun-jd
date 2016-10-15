import rp from 'request-promise-native';

const api = {};

async function requestAsync(actionUrl, options = {}) {
  let resp;
  try {
    resp = await rp({
      simple: false,
      resolveWithFullResponse: true,
      url: `${DI.config.api.url}${actionUrl}`,
      auth: {
        user: DI.config.api.credential.username,
        pass: DI.config.api.credential.password,
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      json: true,
      gzip: true,
      ...options,
    });
  } catch (err) {
    throw new Error(`Failed to connect to Portal API service: ${err.message}`);
  }
  const { body } = resp;
  if (body.err) {
    throw new Error(`Portal API request failed: ${body.name}: ${body.msg}`);
  }
  return body;
}

api.getLimits = () => {
  return requestAsync('/submission/api/limits', { method: 'GET' });
};

api.startCompile = (task) => {
  return requestAsync('/submission/api/startCompile', {
    method: 'POST',
    body: task,
  });
};

api.completeCompile = (task, text, success, fileStream) => {
  const body = {
    ...task,
    text,
    success: String(success),
  };
  if (success && fileStream) {
    body.binary = fileStream;
  }
  return requestAsync('/submission/api/completeCompile', {
    method: 'POST',
    formData: body,
  });
};

export default api;
