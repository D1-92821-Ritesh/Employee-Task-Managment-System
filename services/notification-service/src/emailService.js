const nodemailer = require('nodemailer');
const config = require('./config');
const userServiceClient = require('./userServiceClient');

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port == 465,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

async function sendTaskAssignedEmail(notification) {
    const { TaskId, TaskTitle, AssignedToUserId, CreatedAt } = notification;

    // Fetch user email from user-service
    let toAddress = await userServiceClient.getUserEmail(AssignedToUserId);

    // Fallback to test recipient if user email not found
    if (!toAddress) {
        toAddress = config.email.testRecipient;
    }

    if (!toAddress) {
        return;
    }

    try {
        await transporter.sendMail({
            from: config.email.from,
            to: toAddress,
            subject: `New Task Assigned: ${TaskTitle}`,
            text: `You have been assigned a new task: ${TaskTitle} (ID: ${TaskId}). Created at: ${CreatedAt}`,
            html: `<p>You have been assigned a new task: <b>${TaskTitle}</b> (ID: ${TaskId})</p><p>Created at: ${CreatedAt}</p>`,
        });
    } catch {
        // Silently ignore email errors
    }
}

module.exports = { sendTaskAssignedEmail };
