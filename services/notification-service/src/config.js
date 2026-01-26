require('dotenv').config();

module.exports = {
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://user:pass@localhost:5672',
    exchange: 'task.exchange',
    queue: 'task.notifications',
    routingKey: 'task.assigned',
  },
  email: {
    // service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER || 'faked_user',
    pass: process.env.EMAIL_PASS || 'faked_pass',
    from: process.env.EMAIL_FROM,
    testRecipient: process.env.TEST_EMAIL_RECIPIENT
  }
};
