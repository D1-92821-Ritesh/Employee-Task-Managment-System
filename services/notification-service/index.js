const rabbitmq = require('./src/rabbitmq');

const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
    instance: {
        app: 'notification-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 3000, // Dummy port for now as it's a consumer-only service
            '@enabled': 'true',
        },
        vipAddress: 'notification-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

console.log('Starting Notification Service...');

client.start((error) => {
    console.log(error || 'Notification service registered');
    rabbitmq.startConsumer().catch(console.error);
});
