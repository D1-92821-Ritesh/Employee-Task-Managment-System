const nodemailer = require('nodemailer');
const config = require('../src/config');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const logFile = path.join(__dirname, '..', 'email_debug_log.txt');

function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    console.log(msg);
    try {
        fs.appendFileSync(logFile, line);
    } catch (e) {
        // ignore fs errors
    }
}

async function testEmail() {
    // Clear previous log
    fs.writeFileSync(logFile, '');

    log('--- Starting Test ---');
    log(`Environment Config:`);
    log(`HOST: ${process.env.EMAIL_HOST}`);
    log(`PORT: ${process.env.EMAIL_PORT}`);
    log(`USER: ${process.env.EMAIL_USER}`);

    log('--- Config Object ---');
    log(`config.email.host: ${config.email.host}`);
    log(`config.email.port: ${config.email.port}`);
    log(`config.email.secure: ${config.email.port == 465}`);
    log(`config.email.user: ${config.email.user}`);

    const pass = config.email.pass || '';
    log(`config.email.pass length: ${pass.length}`);
    if (pass.length > 0) {
        log(`Pass start/end: ${pass.substring(0, 2)}...${pass.substring(pass.length - 2)}`);
    } else {
        log('PASSWORD IS EMPTY!');
    }

    const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: Number(config.email.port),
        secure: Number(config.email.port) === 465,
        auth: {
            user: config.email.user,
            pass: config.email.pass,
        },
        debug: true,
        logger: {
            info: (msg) => log(`[SMTP INFO] ${msg}`),
            debug: (msg) => log(`[SMTP DEBUG] ${msg}`),
            error: (msg) => log(`[SMTP ERROR] ${msg}`),
        }
    });

    try {
        log('Verifying connection...');
        await transporter.verify();
        log('Connection verified successfully!');
    } catch (error) {
        log('VERIFY FAILED: ' + error.message);
        log(JSON.stringify(error, null, 2));
        return;
    }

    try {
        log('Sending email...');
        const info = await transporter.sendMail({
            from: config.email.from,
            to: config.email.testRecipient,
            subject: "FINAL TEST: Notification Service",
            text: "If you read this, the debugging worked.",
        });
        log("Email sent successfully!");
        log("Message ID: " + info.messageId);
    } catch (error) {
        log("SEND FAILED: " + error.message);
        log(JSON.stringify(error, null, 2));
    }
}

testEmail().catch(err => {
    log("FATAL ERROR: " + err.message);
    log(err.stack);
});
