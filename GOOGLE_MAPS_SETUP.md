# Google Maps API Setup Guide

This guide will help you set up Google Maps API for RouteWise TMS to resolve common configuration issues.

## Common Issues and Solutions

### 1. BillingNotEnabledMapError
**Error:** `Google Maps JavaScript API error: BillingNotEnabledMapError`

**Solution:**
1. Go to [Google Cloud Console - Billing](https://console.cloud.google.com/billing)
2. Create a billing account or link an existing one to your project
3. Enable billing for your Google Cloud project
4. Note: Google Maps API requires a valid payment method even for free tier usage

### 2. ApiNotActivatedMapError
**Error:** `Google Maps JavaScript API error: ApiNotActivatedMapError`

**Solution:**
1. Go to [Google Cloud Console - APIs & Services](https://console.cloud.google.com/apis/dashboard)
2. Click "Enable APIs and Services"
3. Search for and enable the following APIs:
   - **Maps JavaScript API**
   - **Geocoding API** (for address-to-coordinates conversion)
   - **Places API** (optional, for enhanced location features)

### 3. InvalidKeyMapError
**Error:** `Google Maps JavaScript API error: InvalidKeyMapError`

**Solution:**
1. Verify your API key is correct in `.env.local`
2. Check API key restrictions in [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
3. Ensure the API key has the necessary permissions for Maps JavaScript API

### 4. RefererNotAllowedMapError
**Error:** `Google Maps JavaScript API error: RefererNotAllowedMapError`

**Solution:**
1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your API key
3. Under "Application restrictions", either:
   - Choose "None" (less secure, for development)
   - Choose "HTTP referrers" and add your domains:
     - `localhost/*`
     - `127.0.0.1/*`
     - `your-production-domain.com/*`

## Step-by-Step Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### Step 2: Enable Billing
1. Navigate to [Billing](https://console.cloud.google.com/billing)
2. Link a billing account to your project
3. **Important:** This is required even for free tier usage

### Step 3: Enable Required APIs
1. Go to [APIs & Services](https://console.cloud.google.com/apis/dashboard)
2. Click "Enable APIs and Services"
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API

### Step 4: Create API Key
1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key for security

### Step 5: Configure API Key Restrictions (Recommended)
1. Click on your API key in the credentials page
2. Under "API restrictions", select "Restrict key"
3. Choose:
   - Maps JavaScript API
   - Geocoding API
4. Under "Application restrictions":
   - For development: Select "None" or add localhost
   - For production: Add your domain

### Step 6: Update Environment Variables
1. Create or update `route_wise_frontend/.env.local`:
```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Step 7: Test the Configuration
1. Restart your development server
2. Navigate to Order Routes page
3. Click "View on Map" for any order
4. The map should load without errors

## Current Configuration

Your current API key is configured in `.env.local`. If you're still seeing errors, please check:

1. **Billing Status**: Ensure billing is enabled in Google Cloud Console
2. **API Status**: Verify Maps JavaScript API is enabled
3. **Key Validity**: Check if the API key is valid and has proper permissions

## Troubleshooting

### If maps still don't load:
1. Check the browser console for specific error messages
2. Verify the API key in `.env.local` matches your Google Cloud Console key
3. Ensure your Google Cloud project has billing enabled
4. Check that Maps JavaScript API is enabled in your project

### Cost Considerations:
- Google Maps API has a free tier with monthly credits
- Typical usage for a TMS application should stay within free limits
- Monitor usage in [Google Cloud Console - APIs & Services](https://console.cloud.google.com/apis/dashboard)

## Support

If you continue to experience issues:
1. Check the [Google Maps Platform documentation](https://developers.google.com/maps/documentation)
2. Review error messages in the browser console
3. Verify all setup steps have been completed correctly

---

**Note:** The API key currently configured needs proper billing and API activation to work correctly. 