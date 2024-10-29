export default () => ({
  listen2it: {
    baseURL: {
      prod: '',
      sandbox: 'https://japhrdeu2j.execute-api.us-east-1.amazonaws.com',
    },
    basePath: {
      prod: '',
      sandbox: '/staging',
    },
    apiKey: process.env.LISTEN2IT_API_KEY,
    parentWorkspaceID: process.env.LISTEN2IT_PARENT_WORKSPACE_ID,
    request: {
      timeout: parseInt(process.env.LISTEN2IT_TIMEOUT_IN_MS) || 5000,
    },
  },
});
