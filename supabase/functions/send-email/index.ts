import React from "https://esm.sh/react@18.3.1"
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0"
import { Resend } from "https://esm.sh/resend@4.0.0"
import { renderAsync, Body, Container, Head, Heading, Html, Link, Preview, Text } from "https://esm.sh/@react-email/components@0.0.22"

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

// Confirmation Email Template
const ConfirmationEmail = ({
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
}) => (
  React.createElement(Html, null,
    React.createElement(Head, null),
    React.createElement(Preview, null, "Confirm your Juicy Fish account"),
    React.createElement(Body, { style: { backgroundColor: '#f6f9fc', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif" } },
      React.createElement(Container, { style: { backgroundColor: '#ffffff', margin: '0 auto', padding: '40px 20px', borderRadius: '8px', maxWidth: '560px' } },
        React.createElement(Heading, { style: { color: '#1a1a1a', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 24px' } }, "🐟 Welcome to Juicy Fish!"),
        React.createElement(Text, { style: { color: '#333', fontSize: '16px', lineHeight: '26px', textAlign: 'center' } },
          "Thanks for signing up! Please confirm your email address to get started with your SGPA/CGPA calculator and attendance tracker."
        ),
        React.createElement(Link, {
          href: `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`,
          target: "_blank",
          style: { backgroundColor: '#10b981', borderRadius: '8px', color: '#fff', display: 'block', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', textDecoration: 'none', padding: '14px 24px', margin: '24px auto', maxWidth: '240px' }
        }, "Confirm Email Address"),
        React.createElement(Text, { style: { color: '#666', fontSize: '14px', textAlign: 'center', marginTop: '24px' } },
          "Or copy and paste this link in your browser:"
        ),
        React.createElement(Text, { style: { color: '#2754C5', fontSize: '12px', textAlign: 'center', wordBreak: 'break-all' } },
          `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`
        ),
        React.createElement(Text, { style: { color: '#999', fontSize: '12px', textAlign: 'center', marginTop: '32px' } },
          "If you didn't create an account with Juicy Fish, you can safely ignore this email."
        ),
        React.createElement(Text, { style: { color: '#898989', fontSize: '12px', textAlign: 'center', marginTop: '32px' } },
          "© Juicy Fish by Team Dino"
        )
      )
    )
  )
)

// Password Reset Email Template
const PasswordResetEmail = ({
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
}) => (
  React.createElement(Html, null,
    React.createElement(Head, null),
    React.createElement(Preview, null, "Reset your Juicy Fish password"),
    React.createElement(Body, { style: { backgroundColor: '#f6f9fc', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif" } },
      React.createElement(Container, { style: { backgroundColor: '#ffffff', margin: '0 auto', padding: '40px 20px', borderRadius: '8px', maxWidth: '560px' } },
        React.createElement(Heading, { style: { color: '#1a1a1a', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 24px' } }, "🔐 Password Reset"),
        React.createElement(Text, { style: { color: '#333', fontSize: '16px', lineHeight: '26px', textAlign: 'center' } },
          "We received a request to reset your Juicy Fish account password. Click the button below to set a new password."
        ),
        React.createElement(Link, {
          href: `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`,
          target: "_blank",
          style: { backgroundColor: '#ef4444', borderRadius: '8px', color: '#fff', display: 'block', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', textDecoration: 'none', padding: '14px 24px', margin: '24px auto', maxWidth: '240px' }
        }, "Reset Password"),
        React.createElement(Text, { style: { color: '#666', fontSize: '14px', textAlign: 'center', marginTop: '24px' } },
          "Or copy and paste this link in your browser:"
        ),
        React.createElement(Text, { style: { color: '#2754C5', fontSize: '12px', textAlign: 'center', wordBreak: 'break-all' } },
          `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`
        ),
        React.createElement(Text, { style: { color: '#999', fontSize: '12px', textAlign: 'center', marginTop: '32px' } },
          "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged."
        ),
        React.createElement(Text, { style: { color: '#999', fontSize: '12px', textAlign: 'center' } },
          "This link will expire in 1 hour."
        ),
        React.createElement(Text, { style: { color: '#898989', fontSize: '12px', textAlign: 'center', marginTop: '32px' } },
          "© Juicy Fish by Team Dino"
        )
      )
    )
  )
)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const wh = new Webhook(hookSecret)
  
  try {
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
        token_new: string
        token_hash_new: string
      }
    }

    console.log('Processing email for action type:', email_action_type)
    console.log('User email:', user.email)

    let html: string
    let subject: string
    const supabase_url = Deno.env.get('SUPABASE_URL') ?? ''
    const finalRedirect = redirect_to || 'https://www.juicyfish.online/auth'

    // Determine email template based on action type
    if (email_action_type === 'recovery') {
      subject = 'Reset your Juicy Fish password'
      html = await renderAsync(
        PasswordResetEmail({
          supabase_url,
          token_hash,
          redirect_to: finalRedirect,
          email_action_type,
        })
      )
    } else {
      // Default to confirmation email (signup, email_change, etc.)
      subject = 'Confirm your Juicy Fish account'
      html = await renderAsync(
        ConfirmationEmail({
          supabase_url,
          token_hash,
          redirect_to: finalRedirect,
          email_action_type,
        })
      )
    }

    const { error } = await resend.emails.send({
      from: 'Juicy Fish <noreply@juicyfish.online>',
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully to:', user.email)
  } catch (error: any) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code,
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
