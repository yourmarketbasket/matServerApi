const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'codethelabs@gmail.com',
        pass: 'ghgp ihqu yuul ywsm',
      },
    });
    // Load the email template once
    this.emailTemplate = fs.readFileSync(path.join(__dirname, '../../templates/email.template.html'), 'utf-8');
  }

  /**
   * @description Sends an email using a template.
   * @param {string} to - The recipient's email address.
   * @param {string} subject - The email subject.
   * @param {object} context - The dynamic data for the template (e.g., { title, body, otp }).
   * @returns {Promise<void>}
   */
  async sendEmail({ to, subject, context }) {
    let html = this.emailTemplate;

    // Replace general placeholders
    html = html.replace('{{title}}', context.title || subject);
    html = html.replace('{{body}}', context.body || '');

    // Handle OTP section
    if (context.otp) {
      // Replace the main body with the OTP-specific message
      context.body = 'Please use the following code to start your registration with Safary. The code is valid for 15 minutes.';
      const otpSectionHtml = `
        <div class="otp-section-container">
            <p>Your One-Time Password is:</p>
            <div class="otp-code">${context.otp}</div>
        </div>
      `;
      html = html.replace('{{otp_section}}', otpSectionHtml);
    } else {
      html = html.replace('{{otp_section}}', ''); // Remove the placeholder if no OTP
    }

    // Replace general placeholders again in case they were changed by the OTP logic
    html = html.replace('{{title}}', context.title || subject);
    html = html.replace('{{body}}', context.body || '');

    const mailOptions = {
      from: '"Safary" <codethelabs@gmail.com>', // Use "Safary" as sender name
      to,
      subject,
      html,
    };

    console.log('[NotificationService.sendEmail] --- Preparing to send email ---');
    console.log(`[NotificationService.sendEmail] FROM: ${mailOptions.from}`);
    console.log(`[NotificationService.sendEmail] TO: ${mailOptions.to}`);
    console.log(`[NotificationService.sendEmail] SUBJECT: ${mailOptions.subject}`);
    if (context.otp) {
      console.log(`[NotificationService.sendEmail] CONTEXT includes OTP: ${context.otp}`);
    }
    console.log('[NotificationService.sendEmail] -----------------------------');

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('[NotificationService.sendEmail] Email sent successfully! Message ID: %s', info.messageId);
      console.log('[NotificationService.sendEmail] Full response from email server:', info);
    } catch (error) {
      console.error('[NotificationService.sendEmail] Error sending email:', error);
      throw new Error('Email could not be sent');
    }
  }

  /**
   * @description Sends a push notification to a user's device
   * @param {string} userId - The ID of the user to notify
   * @param {string} message - The notification message
   * @returns {Promise<void>}
   */
  async sendPushNotification(userId, message) {
    console.log(`Sending PUSH notification to user ${userId}: "${message}"`);
    // TODO: Look up user's device token and send notification via Firebase Admin SDK
  }

  /**
   * @description Sends an SMS to a user's phone number
   * @param {string} phone - The phone number to send the SMS to
   * @param {string} message - The SMS content
   * @returns {Promise<void>}
   */
  async sendSMS(phone, message) {
    console.log(`Sending SMS to phone ${phone}: "${message}"`);
    // TODO: Call the SMS gateway API to send the message
  }
}

module.exports = new NotificationService();
