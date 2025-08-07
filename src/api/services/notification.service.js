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

    const mailOptions = {
      from: '"Safary" <codethelabs@gmail.com>', // Use "Safary" as sender name
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
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
