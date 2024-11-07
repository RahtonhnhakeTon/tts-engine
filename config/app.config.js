export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 5000,
    deployment: process.env.APP_DEPLOYMET || 'staging',
  },
});
