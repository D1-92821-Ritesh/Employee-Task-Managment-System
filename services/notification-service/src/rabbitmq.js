const amqp = require('amqplib');
const config = require('./config');
const emailService = require('./emailService');

async function startConsumer() {
    try {
        const connection = await amqp.connect(config.rabbitmq.url);
        const channel = await connection.createChannel();

        const exchange = config.rabbitmq.exchange;
        const queue = config.rabbitmq.queue;
        const routingKey = config.rabbitmq.routingKey;

        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                try {
                    const notification = JSON.parse(content);
                    await emailService.sendTaskAssignedEmail(notification);
                    channel.ack(msg);
                } catch (error) {
                    console.log("Email not sent from consumer:", error);
                }
            }
        });

        connection.on('close', () => {
            setTimeout(startConsumer, 5000);
        });

    } catch {
        setTimeout(startConsumer, 5000);
    }
}

module.exports = { startConsumer };
