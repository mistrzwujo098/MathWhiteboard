# MathWhiteboard Deployment Guide

## Prerequisites

- GitHub account (already set up)
- Supabase project (already created)
- Vercel account (free tier is sufficient)

## Supabase Configuration

Your Supabase project has been created with:
- **Project ID**: `cxolsmpknvxgbcgdqgmb`
- **Project URL**: `https://cxolsmpknvxgbcgdqgmb.supabase.co`
- **Region**: `eu-central-1`

### Enable Authentication Providers

1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable Email/Password authentication
4. (Optional) Enable Google OAuth:
   - Add your Google OAuth credentials
   - Set redirect URL to: `https://your-vercel-domain.vercel.app/auth/callback`

## Deploy to Vercel

### Method 1: Deploy with Vercel Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mistrzwujo098/MathWhiteboard&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Method 2: Manual Deployment

1. **Fork or Clone the Repository**
   ```bash
   git clone https://github.com/mistrzwujo098/MathWhiteboard.git
   cd MathWhiteboard
   ```

2. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

3. **Deploy via CLI**
   ```bash
   vercel
   ```

4. **Or Deploy via Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

## Environment Variables

Add these environment variables in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cxolsmpknvxgbcgdqgmb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4b2xzbXBrbnZ4Z2JjZ2RxZ21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTU0MDAsImV4cCI6MjA2OTQ5MTQwMH0.Nkq804R6s6Hkc-xbhOglJDjteDiFpF954JsOypm8z1o
```

### How to Add Environment Variables in Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add each variable with its value
4. Select all environments (Production, Preview, Development)
5. Save changes

## Post-Deployment Configuration

### 1. Update Supabase Allowed URLs

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Vercel domains to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs:
     - `https://your-app.vercel.app/auth/callback`
     - `https://your-app.vercel.app/*`
     - `http://localhost:3000/auth/callback` (for local development)

### 2. Configure CORS (if needed)

If you encounter CORS issues:
1. Go to Supabase Dashboard > Settings > API
2. Add your Vercel domain to allowed origins

### 3. Enable Realtime

1. Go to Supabase Dashboard > Database > Replication
2. Enable replication for:
   - `sessions` table
   - `session_participants` table
   - `chat_messages` table
   - `canvas_state` table

## Testing the Deployment

1. Visit your deployed URL
2. Create a new account
3. Create a session
4. Share the session link
5. Join from another browser/device
6. Test:
   - Real-time drawing
   - Chat messages
   - LaTeX rendering
   - Video calling

## Troubleshooting

### Common Issues:

1. **Authentication not working**
   - Check Supabase URL configuration
   - Verify environment variables in Vercel
   - Ensure redirect URLs are properly configured

2. **Real-time features not working**
   - Check if Realtime is enabled in Supabase
   - Verify WebSocket connections are allowed
   - Check browser console for errors

3. **Video calling issues**
   - Ensure HTTPS is enabled (required for WebRTC)
   - Check if PeerJS server is accessible
   - Verify camera/microphone permissions

4. **Database errors**
   - Check RLS policies in Supabase
   - Verify user has proper permissions
   - Check Supabase logs for detailed errors

## Performance Optimization

1. **Enable Vercel Edge Functions** for better global performance
2. **Use Vercel Analytics** to monitor performance
3. **Enable ISR** (Incremental Static Regeneration) where applicable
4. **Optimize images** and assets

## Monitoring

1. **Vercel Dashboard**: Monitor deployments, functions, and logs
2. **Supabase Dashboard**: Monitor database usage, auth events, and logs
3. **Set up alerts** for errors and performance issues

## Scaling Considerations

- **Supabase Free Tier Limits**:
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth
  - 50MB file uploads

- **Vercel Free Tier Limits**:
  - 100GB bandwidth
  - Serverless function execution
  - Unlimited deployments

For production use, consider upgrading to paid tiers for both services.

## Security Best Practices

1. **Never commit `.env.local` files**
2. **Use environment variables for all secrets**
3. **Enable 2FA on GitHub, Supabase, and Vercel**
4. **Regularly update dependencies**
5. **Monitor for security vulnerabilities**

## Support

- **Issues**: [GitHub Issues](https://github.com/mistrzwujo098/MathWhiteboard/issues)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)