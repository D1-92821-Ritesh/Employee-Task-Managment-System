const rabbitmq = require('./src/rabbitmq');

console.log('Starting Notification Service...');
rabbitmq.startConsumer().catch(console.error);
