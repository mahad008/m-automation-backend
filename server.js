const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email } = req.body;
  console.log('Signup request:', { name, email });

  try {
    await transporter.sendMail({
      from: `"M AUTOMATION" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to M AUTOMATION! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f6f8fb;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 14px;">
            <h1 style="color: #1e3a8a; text-align: center;">Welcome to M AUTOMATION!</h1>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your account has been created successfully! ✅</p>
            <p>We're excited to help you automate your workflows.</p>
            <div style="background: #f6f8fb; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0;"><strong>🚀 What's Next?</strong></p>
              <ul>
                <li>Explore our automation services</li>
                <li>Book a free consultation</li>
                <li>Check out our case studies</li>
              </ul>
            </div>
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Questions? Call us at <strong>+92 311 2043445</strong>
            </p>
          </div>
        </div>
      `
    });

    res.json({ success: true, message: 'Email sent!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, desc } = req.body;

  try {
    await transporter.sendMail({
      from: `"M AUTOMATION" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Contact from ${name}`,
      html: `
        <h2>New Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${desc}</p>
      `
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));