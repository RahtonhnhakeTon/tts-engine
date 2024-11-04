export default () => ({
  logger: {
    files: {
      api: process.env.API_LOGS_FILEPATH || '/var/logs/vpaas-tts-api.log',
      general: process.env.LOGS_FILEPATH || '/var/logs/vpaas-tts.log',
      error:
        process.env.ERROR_LOGS_FILEPATH || '/var/logs/vpaas-tts-errors.log',
    },
  },
});
