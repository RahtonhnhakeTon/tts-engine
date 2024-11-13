export default () => ({
  app: {
    url: process.env.APP_URL || 'http://localhost:5000',
    port: parseInt(process.env.APP_PORT) || 5000,
    deployment: process.env.APP_DEPLOYMET || 'staging',
  },
});
