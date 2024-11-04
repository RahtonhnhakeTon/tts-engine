export default () => ({
  ttsVendors: {
    listen2it: {
      baseURL: {
        prod: '',
        sandbox: 'https://japhrdeu2j.execute-api.us-east-1.amazonaws.com',
      },
      basePath: {
        prod: '',
        sandbox: '/staging',
      },
      apiKey: process.env.LISTEN2IT_PARENT_API_KEY,
      parentWorkspaceID: process.env.LISTEN2IT_PARENT_WORKSPACE_ID,
      request: {
        timeout: parseInt(process.env.LISTEN2IT_TIMEOUT_IN_MS) || 5000,
      },
      database: {
        uri: process.env.LISTEN2IT_DB_URI || 'mongodb://localhost:27017',
        dbName: process.env.LISTEN2IT_DB_NAME || 'listen2it',
      },
    },
  },
});
