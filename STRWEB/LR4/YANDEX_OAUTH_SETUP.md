# Yandex OAuth Configuration Guide

## Important: Update Your Yandex OAuth Application Settings

The application is now configured to use the correct OAuth callback URL. You need to update your Yandex OAuth application settings:

### Steps to Configure Yandex OAuth:

1. Go to https://oauth.yandex.com/client/my
2. Select your OAuth application (or create a new one)
3. In the **Callback URI** (Redirect URI) field, add:
   ```
   http://localhost:3000/auth/yandex/callback
   ```

4. Make sure the following permissions are enabled:
   - Access to email address
   - Access to username
   - Access to user ID

5. Save the changes

### Current Configuration:

- **Client ID**: `31d7c386b4ad4772a12d7f6c5108c8bc`
- **Callback URI**: `http://localhost:3000/auth/yandex/callback`

### What Changed:

✅ **Fixed Issues:**
- Added `redirect_uri` parameter to OAuth authorization URL
- Added `redirect_uri` parameter to token exchange request
- Created `/auth/yandex/callback` route in the React app
- Added Yandex OAuth button to RegisterPage (now users can register with Yandex)
- Updated Google AI model from deprecated `gemini-pro` to `gemini-1.5-flash`

✅ **Features:**
- Users can now **register** with Yandex ID (not just login)
- OAuth callback properly handles the authorization code
- Seamless integration between popup window and main application

### Testing:

1. Start the application: `npm run dev`
2. Go to http://localhost:3000/register or http://localhost:3000/login
3. Click "Register with Yandex" or "Continue with Yandex"
4. You'll be redirected to Yandex OAuth
5. After authorization, you'll be redirected back to the app

### Troubleshooting:

If you still see "ERR_CONNECTION_REFUSED":
- Make sure the Yandex OAuth app has `http://localhost:3000/auth/yandex/callback` in the allowed redirect URIs
- Do NOT use `https://localhost` - use `http://localhost:3000`
- Ensure both frontend (port 3000) and backend (port 5000) are running
