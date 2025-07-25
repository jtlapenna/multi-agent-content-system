const nodemailer = require('nodemailer');
const chalk = require('chalk');

/**
 * Notification Service for sending real notifications
 */
class NotificationService {
  constructor(config = {}) {
    this.config = {
      email: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      },
      recipients: process.env.NOTIFICATION_EMAILS?.split(',') || [],
      slack: {
        webhook: process.env.SLACK_WEBHOOK_URL
      },
      ...config
    };
    
    this.transporter = null;
    this.initialized = false;
  }

  /**
   * Initialize email transporter
   */
  async initialize() {
    if (this.initialized) return;

    try {
      if (this.config.email.auth.user && this.config.email.auth.pass) {
        this.transporter = nodemailer.createTransport(this.config.email);
        
        // Verify connection
        await this.transporter.verify();
        console.log('✅ Email notification service initialized');
        this.initialized = true;
      } else {
        console.log('⚠️ Email credentials not configured, notifications will be logged only');
      }
    } catch (error) {
      console.warn(`⚠️ Email service initialization failed: ${error.message}`);
      console.log('📧 Notifications will be logged only');
    }
  }

  /**
   * Send approval notification
   */
  async sendApprovalNotification(githubResult, topic, socialPosts) {
    await this.initialize();

    // Clean topic data to prevent large objects in email
    const cleanTopic = {
      title: typeof topic === 'string' ? topic : (topic.title || topic || 'Unknown'),
      contentType: typeof topic === 'object' ? (topic.contentType || 'gift-guide') : 'gift-guide',
      primaryKeyword: typeof topic === 'object' ? (topic.primaryKeyword || 'N/A') : 'N/A',
      estimatedWordCount: typeof topic === 'object' ? (topic.estimatedWordCount || 'N/A') : 'N/A'
    };

    // Clean social posts to remove any large data
    let cleanSocialPosts = [];
    if (Array.isArray(socialPosts)) {
      cleanSocialPosts = socialPosts.map(post => ({
        platform: post.platform,
        content: post.content ? post.content.substring(0, 100) + '...' : 'No content',
        hashtags: post.hashtags || []
      }));
    } else if (socialPosts && typeof socialPosts === 'object') {
      // Handle object format (from skip-images workflow)
      cleanSocialPosts = Object.entries(socialPosts).map(([platform, post]) => ({
        platform: platform,
        content: post.content ? post.content.substring(0, 100) + '...' : 'No content',
        hashtags: post.hashtags || []
      }));
    }

    const subject = `Content Ready for Review - ${cleanTopic.title}`;
    const previewUrl = githubResult.preview?.url || githubResult.previewUrl || 'Not deployed';
    const prUrl = githubResult.pullRequest?.url || 'Not created';
    const prNumber = githubResult.pullRequest?.number || 'N/A';

    const emailContent = this.generateApprovalEmail(subject, previewUrl, prUrl, prNumber, cleanTopic, cleanSocialPosts);
    
    // Log notification
    console.log(chalk.cyan('\n📧 Approval Notification'));
    console.log(chalk.gray('='.repeat(40)));
    console.log(chalk.white(`Subject: ${subject}`));
    console.log(chalk.gray(`Preview URL: ${previewUrl}`));
    console.log(chalk.gray(`Pull Request: #${prNumber}`));
    console.log(chalk.gray(`Content Type: ${cleanTopic.contentType}`));
    console.log(chalk.gray(`Social Posts: ${cleanSocialPosts.length} ready for scheduling`));

    // Send email if configured
    if (this.transporter && this.config.recipients.length > 0) {
      try {
        await this.sendEmail(subject, emailContent);
        console.log(chalk.green('✅ Email notification sent'));
      } catch (error) {
        console.error(chalk.red(`❌ Email notification failed: ${error.message}`));
      }
    }

    // Send Slack notification if configured
    if (this.config.slack.webhook) {
      try {
        await this.sendSlackNotification(subject, previewUrl, prUrl, prNumber, cleanTopic, cleanSocialPosts);
        console.log(chalk.green('✅ Slack notification sent'));
      } catch (error) {
        console.error(chalk.red(`❌ Slack notification failed: ${error.message}`));
      }
    }
  }

  /**
   * Generate approval email content
   */
  generateApprovalEmail(subject, previewUrl, prUrl, prNumber, topic, socialPosts) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c5aa0;">🎯 Content Ready for Review</h1>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #2c5aa0;">${topic.title}</h2>
            <p><strong>Content Type:</strong> ${topic.contentType || 'gift-guide'}</p>
            <p><strong>Primary Keyword:</strong> ${topic.primaryKeyword || 'N/A'}</p>
            <p><strong>Estimated Word Count:</strong> ${topic.estimatedWordCount || 'N/A'}</p>
        </div>

        <div style="margin: 20px 0;">
            <h3 style="color: #2c5aa0;">🔗 Quick Links</h3>
            <ul>
                <li><a href="${previewUrl}" style="color: #2c5aa0;">Preview Content</a></li>
                <li><a href="${prUrl}" style="color: #2c5aa0;">GitHub Pull Request #${prNumber}</a></li>
            </ul>
        </div>

        <div style="margin: 20px 0;">
            <h3 style="color: #2c5aa0;">📱 Social Media Posts</h3>
            <p><strong>Generated Posts:</strong> ${socialPosts.length}</p>
            <ul>
                ${socialPosts.map(post => `<li>${post.platform}: ${post.content.substring(0, 100)}...</li>`).join('')}
            </ul>
        </div>

        <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c5aa0;">🚀 Next Steps</h3>
            <ol>
                <li>Review the preview content</li>
                <li>Check the GitHub pull request</li>
                <li>Approve or request changes</li>
                <li>Content will be published automatically after approval</li>
            </ol>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This notification was sent by the BrightGift Content Automation System.</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Send email notification
   */
  async sendEmail(subject, htmlContent, customFrom = null) {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    // Split recipients into primary and CC
    const primaryRecipients = this.config.recipients.slice(0, 1); // First recipient as primary
    const ccRecipients = this.config.recipients.slice(1); // Rest as CC

    const mailOptions = {
      from: customFrom || this.config.email.auth.user,
      to: primaryRecipients.join(', '),
      subject: subject,
      html: htmlContent
    };

    // Add CC if there are additional recipients
    if (ccRecipients.length > 0) {
      mailOptions.cc = ccRecipients.join(', ');
    }

    console.log(chalk.blue('📧 Sending email:'));
    console.log(chalk.gray(`   From: ${mailOptions.from}`));
    console.log(chalk.gray(`   To: ${mailOptions.to}`));
    if (mailOptions.cc) {
      console.log(chalk.gray(`   CC: ${mailOptions.cc}`));
    }
    console.log(chalk.gray(`   Subject: ${mailOptions.subject}`));

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(chalk.green('✅ Email sent successfully'));
      console.log(chalk.gray(`   Message ID: ${result.messageId}`));
      return result;
    } catch (error) {
      console.error(chalk.red('❌ Email sending failed:'));
      console.error(chalk.red(`   Error: ${error.message}`));
      console.error(chalk.red(`   Code: ${error.code}`));
      console.error(chalk.red(`   Response: ${error.response}`));
      throw error;
    }
  }

  /**
   * Send Slack notification
   */
  async sendSlackNotification(subject, previewUrl, prUrl, prNumber, topic, socialPosts) {
    if (!this.config.slack.webhook) {
      throw new Error('Slack webhook not configured');
    }

    const message = {
      text: subject,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎯 Content Ready for Review'
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Title:*\n${topic.title}`
            },
            {
              type: 'mrkdwn',
              text: `*Type:*\n${topic.contentType || 'gift-guide'}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Preview:* <${previewUrl}|View Content>\n*PR:* <${prUrl}|#${prNumber}>`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Social Posts:* ${socialPosts.length} generated`
          }
        }
      ]
    };

    const response = await fetch(this.config.slack.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }
  }

  /**
   * Send error notification
   */
  async sendErrorNotification(error, context = {}) {
    await this.initialize();

    // Clean context to prevent large data in notifications
    const cleanContext = {};
    if (context.topic) {
      cleanContext.topic = typeof context.topic === 'string' ? context.topic : 
        (context.topic.title || context.topic || 'Unknown');
      if (typeof context.topic === 'object' && context.topic.contentType) {
        cleanContext.contentType = context.topic.contentType;
      }
    }
    if (context.stage) {
      cleanContext.stage = context.stage;
    }
    // Explicitly exclude large data fields
    if (context.images) {
      cleanContext.images = 'Image data excluded from email';
    }
    if (context.imageData) {
      cleanContext.imageData = 'Image data excluded from email';
    }
    if (context.base64Data) {
      cleanContext.base64Data = 'Base64 data excluded from email';
    }
    if (context.qrCode && context.qrCode.startsWith('data:')) {
      cleanContext.qrCode = 'QR code data excluded from email';
    }
    if (context.approvalData && context.approvalData.qrCode && context.approvalData.qrCode.startsWith('data:')) {
      cleanContext.approvalData = { ...context.approvalData, qrCode: 'QR code data excluded from email' };
    }
    if (context.contentType && !cleanContext.contentType) {
      cleanContext.contentType = context.contentType;
    }

    const subject = `Content Automation Error - ${error.message}`;
    const errorContent = this.generateErrorEmail(subject, error, cleanContext);

    // Log error
    console.log(chalk.red('\n🚨 Error Notification'));
    console.log(chalk.gray('='.repeat(40)));
    console.log(chalk.white(`Error: ${error.message}`));
    console.log(chalk.gray(`Context: ${JSON.stringify(cleanContext)}`)); // Log clean context

    // Send Slack notification if configured
    if (this.config.slack.webhook) {
      try {
        await this.sendSlackNotification(subject, 'N/A', 'N/A', 'N/A', cleanContext.topic, []);
        console.log(chalk.green('✅ Slack notification sent'));
      } catch (error) {
        console.error(chalk.red(`❌ Slack notification failed: ${error.message}`));
      }
    }

    // Send email notification
    try {
      await this.sendEmail(subject, errorContent);
      console.log(chalk.green('✅ Error notification sent'));
    } catch (error) {
      console.error(chalk.red(`❌ Error notification failed: ${error.message}`));
      throw error;
    }
  }

  /**
   * Generate error email content
   */
  generateErrorEmail(subject, error, context) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #d32f2f;">🚨 Content Automation Error</h1>
        
        <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
            <h2 style="margin-top: 0; color: #d32f2f;">${error.message}</h2>
            <p><strong>Error Type:</strong> ${error.name || 'Unknown'}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>

        ${context.topic ? `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c5aa0;">Context</h3>
            <p><strong>Topic:</strong> ${context.topic}</p>
            <p><strong>Content Type:</strong> ${context.contentType || 'N/A'}</p>
            <p><strong>Stage:</strong> ${context.stage || 'N/A'}</p>
        </div>
        ` : ''}

        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #f57c00;">🔧 Action Required</h3>
            <p>Please check the automation logs and resolve the issue. The system may need manual intervention.</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This error notification was sent by the BrightGift Content Automation System.</p>
        </div>
    </div>
</body>
</html>
    `;
  }
}

module.exports = NotificationService; 