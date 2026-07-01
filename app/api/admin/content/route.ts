import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyJWT } from '@/lib/crypto';

import {
  getSiteConfig,
  updateSiteConfig,
  getServices,
  saveServices,
  getProjects,
  saveProject,
  createProject,
  deleteProject,
  getTeam,
  saveTeam,
  getStats,
  saveStats,
  getTestimonials,
  saveTestimonials,
  getProcessSteps,
  saveProcessSteps,
  getFAQs,
  saveFAQs,
  getValues,
  saveValues,
  getAwards,
  saveAwards,
  isDbConnected,
  getContacts,
  markContactRead,
  deleteContact,
  addContactReply,
  getNewsletterSubscribers,
  deleteNewsletterSubscriber
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('admin_session')?.value;
  const session = sessionCookie ? await verifyJWT(sessionCookie) : null;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const dbStatus = await isDbConnected();
    const config = await getSiteConfig();
    const services = await getServices();
    const projects = await getProjects();
    const team = await getTeam();
    const stats = await getStats();
    const testimonials = await getTestimonials();
    const processSteps = await getProcessSteps();
    const faqs = await getFAQs();
    const values = await getValues();
    const awards = await getAwards();
    const contacts = await getContacts();
    const subscribers = await getNewsletterSubscribers();
 
    return NextResponse.json({
      dbConnected: dbStatus,
      siteConfig: config,
      services,
      projects,
      team,
      stats,
      testimonials,
      processSteps,
      faqs,
      values,
      awards,
      contacts,
      subscribers
    });
  } catch (error: any) {
    console.error('Error fetching admin content:', error);
    return NextResponse.json({ error: error.message || 'Failed to load content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('admin_session')?.value;
  const session = sessionCookie ? await verifyJWT(sessionCookie) : null;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { type, action, data } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing type parameter' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'site_config':
        result = await updateSiteConfig(data);
        break;
      case 'services':
        result = await saveServices(data);
        break;
      case 'team':
        result = await saveTeam(data);
        break;
      case 'stats':
        result = await saveStats(data);
        break;
      case 'testimonials':
        result = await saveTestimonials(data);
        break;
      case 'process_steps':
        result = await saveProcessSteps(data);
        break;
      case 'faqs':
        result = await saveFAQs(data);
        break;
      case 'values':
        result = await saveValues(data);
        break;
      case 'awards':
        result = await saveAwards(data);
        break;
      case 'project':
        if (action === 'delete') {
          result = await deleteProject(data.slug);
        } else if (action === 'create') {
          result = await createProject(data);
        } else {
          result = await saveProject(data.slug, data);
        }
        break;
      case 'contact':
        if (action === 'mark_read') {
          result = await markContactRead(data.id, data.read);
        } else if (action === 'delete') {
          result = await deleteContact(data.id);
        } else if (action === 'reply') {
          const { id, to, subject, message, originalMessage } = data;
          if (!id || !to || !subject || !message) {
            return NextResponse.json({ error: 'Missing required reply details' }, { status: 400 });
          }

          const config = await getSiteConfig();
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'TectoFlow Studio <onboarding@resend.dev>';
          const adminReplyTo = config?.email || 'anbarasan0909@gmail.com';

          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
              <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 0;">Reply from TectoFlow Studio</h2>
              
              <div style="font-size: 15px; line-height: 1.6; color: #222222; margin-top: 15px; white-space: pre-wrap;">
                ${message}
              </div>

              <div style="margin-top: 30px; padding: 15px; background-color: #fcfcfc; border-left: 4px solid #d1d5db; border-radius: 4px; font-size: 13px; color: #555555;">
                <strong style="display: block; margin-bottom: 8px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-size: 11px;">Original Inquiry:</strong>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.5;">${originalMessage}</p>
              </div>

              <p style="margin-top: 30px; font-size: 11px; color: #a0a0a0; text-align: center; border-top: 1px solid #eaeaea; padding-top: 15px; margin-bottom: 0;">
                TectoFlow Studio &copy; ${new Date().getFullYear()} &bull; <a href="${config?.url || 'https://tectoflow.studio'}" style="color: #f97316; text-decoration: none;">tectoflow.studio</a>
              </p>
            </div>
          `;

          if (process.env.RESEND_API_KEY) {
            const mailRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
              },
              body: JSON.stringify({
                from: fromEmail,
                to: to,
                reply_to: adminReplyTo,
                subject: subject,
                html: emailHtml
              })
            });

            if (!mailRes.ok) {
              const errText = await mailRes.text();
              const isSandboxRestriction = errText.includes('You can only send testing emails to your own email address') || mailRes.status === 403;

              if (isSandboxRestriction) {
                console.warn(`Resend sandbox restriction detected. Retrying dispatch to authorized test email: ${adminReplyTo}`);
                const retryRes = await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                  },
                  body: JSON.stringify({
                    from: fromEmail,
                    to: adminReplyTo,
                    reply_to: adminReplyTo,
                    subject: `[SANDBOX TO: ${to}] ${subject}`,
                    html: `
                      <div style="background: #fff8e1; border: 1px solid #ffe082; padding: 15px; margin-bottom: 20px; border-radius: 6px; font-family: sans-serif; font-size: 13px; color: #b78103; line-height: 1.5;">
                        <strong>Sandbox Mode Fallback:</strong> This email was originally addressed to <strong>${to}</strong>, but has been redirected to you due to Resend sandbox limitations.
                      </div>
                      ${emailHtml}
                    `
                  })
                });

                if (!retryRes.ok) {
                  const retryErrText = await retryRes.text();
                  throw new Error(`Failed to dispatch reply email (even with sandbox redirect): ${retryErrText}`);
                }
              } else {
                throw new Error(`Failed to dispatch reply email: ${errText}`);
              }
            }
          } else {
            console.log('--- DEVELOPMENT/FALLBACK REPLY EMAIL LOG ---');
            console.log(`From: ${fromEmail}`);
            console.log(`To: ${to}`);
            console.log(`Reply-To: ${adminReplyTo}`);
            console.log(`Subject: ${subject}`);
            console.log(`HTML Content:\n${emailHtml}`);
            console.log('---------------------------------------------');
          }

          result = await addContactReply(id, {
            subject,
            message,
            repliedAt: new Date().toISOString()
          });
        }
        break;
      case 'newsletter':
        if (action === 'delete') {
          result = await deleteNewsletterSubscriber(data.id);
        } else if (action === 'send') {
          const { subject, body } = data;
          if (!subject || !body) {
            return NextResponse.json({ error: 'Missing subject or body' }, { status: 400 });
          }
 
          const subscribers = await getNewsletterSubscribers();
          if (subscribers.length === 0) {
            return NextResponse.json({ error: 'No subscribers to send to' }, { status: 400 });
          }
 
          const emails = subscribers.map((s: any) => s.email).filter(Boolean);
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'TectoFlow Studio <onboarding@resend.dev>';
          const config = await getSiteConfig();
          const adminReplyTo = config?.email || 'anbarasan0909@gmail.com';
 
          if (process.env.RESEND_API_KEY) {
            const sendPromises = emails.map(async (recipientEmail: string) => {
              const htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                  <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 0;">${subject}</h2>
                  <div style="font-size: 15px; line-height: 1.6; color: #222222; white-space: pre-wrap; margin-top: 15px;">
                    ${body}
                  </div>
                  <p style="margin-top: 30px; font-size: 11px; color: #a0a0a0; text-align: center; border-top: 1px solid #eaeaea; padding-top: 15px; margin-bottom: 0;">
                    You are receiving this email because you subscribed to the TectoFlow Studio newsletter.
                  </p>
                </div>
              `;

              const emailPayload = {
                from: fromEmail,
                to: recipientEmail,
                subject: subject,
                html: htmlContent
              };
 
              const mailRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                },
                body: JSON.stringify(emailPayload)
              });
 
              if (!mailRes.ok) {
                const errText = await mailRes.text();
                const isSandboxRestriction = errText.includes('You can only send testing emails to your own email address') || mailRes.status === 403;

                if (isSandboxRestriction) {
                  console.warn(`Resend sandbox restriction detected. Retrying newsletter dispatch to authorized test email: ${adminReplyTo}`);
                  const retryRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                      from: fromEmail,
                      to: adminReplyTo,
                      subject: `[SANDBOX TO: ${recipientEmail}] ${subject}`,
                      html: `
                        <div style="background: #fff8e1; border: 1px solid #ffe082; padding: 15px; margin-bottom: 20px; border-radius: 6px; font-family: sans-serif; font-size: 13px; color: #b78103; line-height: 1.5;">
                          <strong>Sandbox Mode Fallback:</strong> This newsletter email was originally addressed to <strong>${recipientEmail}</strong>, but has been redirected to you due to Resend sandbox limitations.
                        </div>
                        ${htmlContent}
                      `
                    })
                  });

                  if (!retryRes.ok) {
                    const retryErrText = await retryRes.text();
                    throw new Error(`Failed to send to ${recipientEmail} (even with sandbox redirect): ${retryErrText}`);
                  }
                } else {
                  throw new Error(`Failed to send to ${recipientEmail}: ${errText}`);
                }
              }
            });
 
            await Promise.all(sendPromises);
            console.log(`Newsletter broadcasted successfully to ${emails.length} subscribers.`);
          } else {
            console.log('--- DEVELOPMENT/FALLBACK NEWSLETTER BROADCAST LOG ---');
            console.log(`Subject: ${subject}`);
            console.log(`Recipients count: ${emails.length}`);
            console.log(`Recipients list: ${emails.join(', ')}`);
            console.log(`Body Content:\n${body}`);
            console.log('------------------------------------------------------');
          }
 
          result = { success: true, count: emails.length };
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    try {
      revalidatePath('/');
      revalidatePath('/about');
      revalidatePath('/work');
      revalidatePath('/work/[slug]', 'page');
    } catch (revalError) {
      console.error('On-demand revalidation failed:', revalError);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: error.message || 'Failed to save content' }, { status: 500 });
  }
}
