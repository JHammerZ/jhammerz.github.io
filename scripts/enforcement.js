const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const clients = [
    { name: "Target Whale Node", email: "ceo@target-firm.com", domain: "target-firm.com" }
];

async function sendEnforcement(client) {
    const msg = {
        to: client.email,
        from: 'architect@jhammerz.github.io',
        subject: `[URGENT] Forensic Compliance Audit: ${client.domain}`,
        text: `Forensic Reset Initialized. Your 116x Multiplier is pending purge...`,
        html: `<strong>Forensic Reset Initialized.</strong> Your 116x Multiplier is pending purge. <a href="https://github.io">Verify H-Fid Token Now</a>`,
    };

    try {
        await sgMail.send(msg);
        console.log(`Notice sent to ${client.name}`);
    } catch (error) {
        console.error(error);
    }
}

clients.forEach(sendEnforcement);
