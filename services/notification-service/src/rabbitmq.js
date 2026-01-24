const amqp = require('amqplib');
const config = require('./config');
const emailService = require('./emailService');

async function startConsumer() {
    try {
        console.log(`[RabbitMQ] Connecting to ${config.rabbitmq.url}...`);
        const connection = await amqp.connect(config.rabbitmq.url);
        const channel = await connection.createChannel();

        const exchange = config.rabbitmq.exchange;
        const queue = config.rabbitmq.queue;
        const routingKey = config.rabbitmq.routingKey;

        // Ensure topology exists
        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);

        console.log(`[RabbitMQ] Waiting for messages in ${queue}. To exit press CTRL+C`);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                console.log("[RabbitMQ] Received:", content);

                try {
                    const notification = JSON.parse(content);
                    // Process notification
                    await emailService.sendTaskAssignedEmail(notification);

                    channel.ack(msg);
                } catch (e) {
                    console.error("[RabbitMQ] Error processing message:", e);
                    // channel.nack(msg, false, false); // or reject
                }
            }
        });

        // Handle connection close/error
        connection.on('close', () => {
            console.error('[RabbitMQ] Connection closed, retrying...');
            setTimeout(startConsumer, 5000);
        });

    } catch (error) {
        console.error('[RabbitMQ] Connection error:', error);
        setTimeout(startConsumer, 5000);
    }
}

module.exports = { startConsumer };
