export default () => ({
  app: {
    url: process.env.APP_URL || 'http://localhost:5000',
    port: parseInt(process.env.APP_PORT) || 5000,
    deployment: process.env.APP_DEPLOYMET || 'staging',
    enableConsumer: process.env.ENABLE_KAFKA_CONSUMER === 'true' || false,
  },
  volumes: {
    ttsStore: process.env.DEFAULT_TTS_STORE_PATH || '/Recording/',
  },
});
