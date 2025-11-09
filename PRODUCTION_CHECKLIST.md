# VoiceCraft Production Deployment Checklist

## ✅ Environment Variables Status

### Required Variables (Must be set before deployment)

| Variable | Status | Required For | Where to Get |
|----------|--------|--------------|-------------|
| `DATABASE_URL` | ✅ SET | Database connection | Vercel Postgres or Neon.tech |
| `REPLICATE_API_TOKEN` | ✅ SET | Voice cloning & generation | https://replicate.com/account/api-tokens |
| `BLOB_READ_WRITE_TOKEN` | ⚠️ MISSING | Audio file storage | Vercel Dashboard → Storage |
| `OPENAI_API_KEY` | ⚠️ MISSING | Project cost estimation | https://platform.openai.com/api-keys |
| `NEXT_PUBLIC_APP_URL` | ⚠️ MISSING | API calls in server components | Your production domain (e.g., https://voicecraft.app) |

### Optional Variables (Needed for full features)

| Variable | Status | Required For |
|----------|--------|--------------|
| `STRIPE_SECRET_KEY` | ❌ NOT SET | Payment processing |
| `STRIPE_PUBLISHABLE_KEY` | ❌ NOT SET | Payment UI |
| `STRIPE_WEBHOOK_SECRET` | ❌ NOT SET | Payment webhooks |
| `NEXTAUTH_URL` | ❌ NOT SET | Authentication |
| `NEXTAUTH_SECRET` | ❌ NOT SET | Authentication security |

## 🔧 How to Set Missing Environment Variables

### 1. BLOB_READ_WRITE_TOKEN
```bash
# In Vercel Dashboard:
# 1. Go to your project → Storage
# 2. Create or select Blob store
# 3. Copy the Read/Write token
# 4. Add via CLI:
vercel env add BLOB_READ_WRITE_TOKEN
# Paste token when prompted
# Select: Production
```

### 2. OPENAI_API_KEY
```bash
# 1. Get API key from https://platform.openai.com/api-keys
# 2. Add via CLI:
vercel env add OPENAI_API_KEY
# Paste key when prompted
# Select: Production
```

### 3. NEXT_PUBLIC_APP_URL
```bash
# Add your production domain
vercel env add NEXT_PUBLIC_APP_URL
# Enter: https://your-domain.com (or https://voicecraft-production-url.vercel.app)
# Select: Production
```

## 📋 Pre-Deployment Checklist

### Code Quality
- [x] TypeScript compilation passes (`npm run build`)
- [x] No ESLint errors
- [x] All tests pass (if applicable)
- [x] Cookie consent banner implemented
- [x] Cookie policy page created
- [x] Newsletter popup implemented
- [x] Payment icons in footer

### Database
- [ ] Production database created (Vercel Postgres or Neon)
- [ ] `DATABASE_URL` environment variable set
- [ ] Database migrations applied
  ```bash
  # Run this after setting DATABASE_URL:
  npx prisma migrate deploy
  ```
- [ ] Database seed data added (if needed)

### Storage & APIs
- [ ] Vercel Blob storage configured
- [ ] `BLOB_READ_WRITE_TOKEN` environment variable set
- [ ] Replicate API token verified and working
- [ ] OpenAI API key verified and working (optional, for estimates)

### Security
- [ ] All API routes have proper validation (Zod schemas)
- [ ] Rate limiting configured (optional but recommended)
- [ ] CORS settings configured (if needed)
- [ ] Environment variables are encrypted in Vercel
- [ ] No secrets committed to Git

### Legal & Compliance
- [x] Privacy Policy page exists (`/privacy`)
- [x] Terms of Service page exists (`/terms`)
- [x] Cookie Policy page exists (`/cookie-policy`)
- [x] Cookie consent banner implemented
- [x] Refund/Cancellation/Payment/Delivery policies exist

### Performance
- [ ] Images optimized and using Next.js Image component
- [ ] Lighthouse score > 90 (test on production URL)
- [ ] Page load time < 3 seconds
- [ ] No console errors in browser

### SEO
- [ ] Meta tags configured in all pages
- [ ] OpenGraph images set
- [ ] Sitemap generated (optional)
- [ ] robots.txt configured (optional)

## 🚀 Deployment Steps

### 1. Set All Required Environment Variables
```bash
# Check current variables
vercel env ls

# Add missing variables (see above)
vercel env add BLOB_READ_WRITE_TOKEN
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

### 2. Run Database Migrations (if not done)
```bash
# Make sure DATABASE_URL is set in .env for local testing
npx prisma migrate deploy
```

### 3. Deploy to Production
```bash
# Method 1: Push to main branch (auto-deploys)
git push origin main

# Method 2: Manual deployment via CLI
vercel --prod

# Method 3: Via Vercel Dashboard
# Go to your project → Deployments → Deploy
```

### 4. Verify Deployment
- [ ] Visit production URL
- [ ] Check homepage loads correctly
- [ ] Test cookie consent banner appears
- [ ] Test newsletter popup (wait 5 seconds)
- [ ] Check all navigation links work
- [ ] Test at least one API endpoint (e.g., /api/voices)
- [ ] Verify database connection works
- [ ] Check Vercel logs for errors

### 5. Post-Deployment
- [ ] Set up monitoring (Vercel Analytics, Sentry, etc.)
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate (automatic with Vercel)
- [ ] Configure DNS records for custom domain
- [ ] Test on mobile devices
- [ ] Test in different browsers (Chrome, Firefox, Safari, Edge)

## 🔍 Troubleshooting

### Build Fails
```bash
# Clear build cache
rm -rf .next
rm -rf node_modules/.cache
npm run build
```

### Database Connection Issues
```bash
# Verify DATABASE_URL format:
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require

# Test connection locally
npx prisma db pull
```

### Environment Variables Not Working
```bash
# Pull latest env vars
vercel env pull .env.local

# Redeploy to pick up new variables
vercel --prod --force
```

### API Routes Return 500 Errors
- Check Vercel function logs: `vercel logs --follow`
- Verify all required environment variables are set
- Check database connection is working
- Verify API tokens (Replicate, OpenAI) are valid

## 📊 Current Deployment Status

**Last Build:** Check with `vercel ls`

**Production URL:** Will be shown after deployment

**Environment:** Production

**Region:** Automatically selected by Vercel (closest to your users)

## 🎯 Next Steps After Deployment

1. **Set up monitoring:**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Configure uptime monitoring

2. **Marketing:**
   - Submit sitemap to Google Search Console
   - Set up Google Analytics (optional)
   - Configure social media meta tags

3. **Features to implement:**
   - Authentication (NextAuth.js)
   - Payment processing (Stripe)
   - Email service integration for newsletter
   - Analytics and tracking

4. **Performance optimization:**
   - Enable Vercel Image Optimization
   - Set up CDN for static assets
   - Implement caching strategies

---

## 📝 Notes

- Vercel automatically handles SSL certificates
- Vercel provides automatic HTTPS redirect
- Database should use connection pooling in production
- Consider using Vercel Edge Functions for better performance
- Monitor function execution times and costs

**Generated:** $(date)
**Last Updated:** Manual updates needed when env vars change
