import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/contact-schema';
import { createNewsletterSubscriber, getSiteConfig } from '@/lib/db';
import { isRateLimited } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting (Defense against flooding)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    if (isRateLimited(ip, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email address', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // 2. Honeypot check (Ignore spam submissions silently to absorb bot activity)
    if (parsed.data.website) {
      console.warn(`[SPAM BLOCKED] Newsletter honeypot field filled by bot from IP: ${ip}`);
      return NextResponse.json({ success: true, subscriber: { email: parsed.data.email } });
    }

    const savedSubscriber = await createNewsletterSubscriber(parsed.data.email);

    // Fetch site config for dynamic links if available
    const config = await getSiteConfig();
    const siteUrl = config?.url || 'https://tectoflow.studio';

    // Send welcome email to subscriber
    const emailPayload = {
      from: process.env.RESEND_FROM_EMAIL || 'TectoFlow Studio <onboarding@resend.dev>', // Resend verified testing sandbox domain
      to: parsed.data.email,
      subject: 'Welcome to TectoFlow Studio Newsletter',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 0;">Welcome to TectoFlow Studio!</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #333333;">Thank you for subscribing to our newsletter.</p>
          <p style="font-size: 14px; line-height: 1.5; color: #333333;">You will now receive regular updates about our latest case studies, digital design trends, and design/development insights directly in your inbox.</p>
          
          <div style="margin-top: 25px; padding: 15px; background-color: #fcfcfc; border: 1px dashed #eaeaea; border-radius: 6px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666666;">Explore our latest work and services at</p>
            <p style="margin: 5px 0 0 0; font-weight: bold;"><a href="${siteUrl}" style="color: #f97316; text-decoration: none;">tectoflow.studio</a></p>
          </div>
          
          <p style="margin-top: 25px; font-size: 11px; color: #a0a0a0; text-align: center; border-top: 1px solid #eaeaea; padding-top: 15px; margin-bottom: 0;">
            If you did not sign up for this newsletter, please ignore this email.
          </p>
        </div>
      `
    };

    if (process.env.RESEND_API_KEY) {
      try {
        const mailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify(emailPayload)
        });
        if (!mailRes.ok) {
          const errDetail = await mailRes.text();
          console.error('Failed to send welcome email via Resend API:', errDetail);
        } else {
          console.log('Welcome email successfully sent to Resend API.');
        }
      } catch (err) {
        console.error('Error dispatching welcome email through Resend API:', err);
      }
    } else {
      console.log('--- DEVELOPMENT/FALLBACK WELCOME EMAIL LOG ---');
      console.log(`To: ${emailPayload.to}`);
      console.log(`Subject: ${emailPayload.subject}`);
      console.log('----------------------------------------------');
    }

    return NextResponse.json({ success: true, subscriber: savedSubscriber });
  } catch (error: any) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message },
      { status: 500 }
    );
  }
}

