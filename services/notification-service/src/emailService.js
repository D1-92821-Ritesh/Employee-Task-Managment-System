const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port == 465, // true for 465, false for other ports
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

async function sendTaskAssignedEmail(notification) {
    const { TaskId, TaskTitle, AssignedToUserId, CreatedAt } = notification;

    console.log(`[EmailService] Preparing email for Task ${TaskId}...`);

    try {
        // In a real app, you'd look up the user's email using AssignedToUserId
        // For testing, we use the configured test recipient
        const toAddress = config.email.testRecipient;

        const info = await transporter.sendMail({
            from: config.email.from,
            to: toAddress,
            subject: `New Task Assigned: ${TaskTitle}`,
            text: `You have been assigned a new task: ${TaskTitle} (ID: ${TaskId}). Created at: ${CreatedAt}`,
            html: `<p>You have been assigned a new task: <b>${TaskTitle}</b> (ID: ${TaskId})</p><p>Created at: ${CreatedAt}</p>`,
        });

        console.log(`[EmailService] Message sent: ${info.messageId}`);
        // Preview only available when sending through an Ethereal account
        if (nodemailer.getTestMessageUrl(info)) {
            console.log(`[EmailService] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
    } catch (error) {
        console.error('[EmailService] Error sending email:', error);
    }
}

module.exports = { sendTaskAssignedEmail };
