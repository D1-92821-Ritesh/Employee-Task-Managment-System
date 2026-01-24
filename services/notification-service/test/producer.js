const amqp = require('amqplib');
const config = require('../src/config');

async function sendTestMessage() {
    try {
        console.log(`[TestProducer] Connecting to ${config.rabbitmq.url}...`);
        const connection = await amqp.connect(config.rabbitmq.url);
        const channel = await connection.createChannel();

        const exchange = config.rabbitmq.exchange;
        const routingKey = config.rabbitmq.routingKey;

        // Ensure exchange exists
        await channel.assertExchange(exchange, 'direct', { durable: true });

        const message = {
            TaskId: Math.floor(Math.random() * 1000),
            TaskTitle: "Review PR #123",
            AssignedToUserId: 42,
            AssignedByUserId: 1,
            DueDate: new Date().toISOString(),
            NotificationType: "TASK_ASSIGNED",
            CreatedAt: new Date().toISOString()
        };

        const msgBuffer = Buffer.from(JSON.stringify(message));

        channel.publish(exchange, routingKey, msgBuffer);
        console.log(`[TestProducer] Sent message: ${JSON.stringify(message)}`);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('[TestProducer] Error:', error);
    }
}

sendTestMessage();
