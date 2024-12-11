export default () => ({
  kafka: {
    clientId: 'VPaaS-tts-adapter',
    brokers: (process.env.KAFKA_BROKER_IPS || '192.168.24.87:9092').split(','),
    authType: process.env.KAFKA_AUTH_TYPE || 'none',
    credentials: {
      saslMechanism: process.env.KAFKA_SASL_MECHANISM || 'PLAIN',
      saslUsername: process.env.KAFKA_SASL_USERNAME || 'default',
      saslPassword: process.env.KAFKA_SASL_PASSWORD || '',
    },
    consumer: {
      group: {
        groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'tts-Consumer',
      },
      runConfig: {},
      topic: process.env.KAFKA_CONSUMER_TOPIC || 'node-tts-operations',
    },
  },
});
