const Eureka = require('eureka-js-client').Eureka;
const rabbitmq = require('./src/rabbitmq');

const eurekaClient = new Eureka({
    instance: {
        app: 'notification-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 3000,
            '@enabled': 'true',
        },
        vipAddress: 'notification-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: process.env.EUREKA_HOST || 'localhost',
        port: process.env.EUREKA_PORT || 8761,
        servicePath: '/eureka/apps/',
    },
});

// Export eureka client for service discovery
module.exports.eurekaClient = eurekaClient;

// Start Eureka registration and RabbitMQ consumer
eurekaClient.start(() => {
    rabbitmq.startConsumer().catch(() => { });
});
