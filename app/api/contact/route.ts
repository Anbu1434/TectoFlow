import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contact-schema';
import { createContact, getSiteConfig } from '@/lib/db';
import { isRateLimited } from '@/lib/rate-limiter';
import { escapeHtml } from '@/lib/utils';

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
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // 2. Honeypot check (Ignore spam submissions silently to absorb bot activity)
    if (parsed.data.website) {
      console.warn(`[SPAM BLOCKED] Honeypot field filled by bot from IP: ${ip}`);
      return NextResponse.json({ success: true, id: 'filtered' });
    }

    // 3. Sanitize inputs to prevent stored XSS and Email HTML Injection
    const sanitizedData = {
      name: escapeHtml(parsed.data.name),
      email: parsed.data.email, // Schema validates this as email
      company: parsed.data.company ? escapeHtml(parsed.data.company) : '',
      projectType: escapeHtml(parsed.data.projectType),
      message: escapeHtml(parsed.data.message),
    };

    // 4. Persist the inquiry into the database
    const savedContact = await createContact(sanitizedData);

    // 5. Fetch the admin email address dynamically
    const config = await getSiteConfig();
    const adminEmail = config?.email || 'anbarasan0909@gmail.com';

    // 6. Dispatch notification email
    const emailPayload = {
      from: process.env.RESEND_FROM_EMAIL || 'TectoFlow Studio <onboarding@resend.dev>', // Resend verified testing sandbox domain
      to: adminEmail,
      subject: `New Project Inquiry from ${sanitizedData.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 0;">New Website Contact Inquiry</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #333333;">You received a new inquiry from the contact form on TectoFlow. Here are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px; border-bottom: 1px solid #f0f0f0; color: #666666;">Sender Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #111111;">${sanitizedData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0; color: #666666;">Sender Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #111111;"><a href="mailto:${sanitizedData.email}" style="color: #f97316; text-decoration: none;">${sanitizedData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0; color: #666666;">Company:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #111111;">${sanitizedData.company || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0; color: #666666;">Project Type:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #111111;">${sanitizedData.projectType}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fcfcfc; border-left: 4px solid #f97316; border-radius: 4px;">
            <strong style="display: block; margin-bottom: 8px; font-size: 13px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">Message:</strong>
            <p style="margin: 0; font-size: 14px; white-space: pre-wrap; line-height: 1.6; color: #222222;">${sanitizedData.message}</p>
          </div>
          
          <p style="margin-top: 25px; font-size: 11px; color: #a0a0a0; text-align: center; border-top: 1px solid #eaeaea; padding-top: 15px; margin-bottom: 0;">
            This inquiry has also been stored in the database. Manage all inquiries at <a href="${config?.url || 'https://tectoflow.studio'}/admin" target="_blank" style="color: #f97316; text-decoration: none;">TectoFlow Admin Dashboard</a>.
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
          console.error('Failed to send email via Resend API:', errDetail);
        } else {
          console.log('Email inquiry successfully sent to Resend API.');
        }
      } catch (err) {
        console.error('Error dispatching mail through Resend API:', err);
      }
    } else {
      console.log('--- DEVELOPMENT/FALLBACK EMAIL NOTIFICATION LOG ---');
      console.log(`To: ${emailPayload.to}`);
      console.log(`Subject: ${emailPayload.subject}`);
      console.log(`Message Content:\n${sanitizedData.message}`);
      console.log('----------------------------------------------------');
    }

    return NextResponse.json({ success: true, id: savedContact._id || savedContact.id });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message },
      { status: 500 }
    );
  }
}
