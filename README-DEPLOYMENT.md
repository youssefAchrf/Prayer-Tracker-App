# 📱 Prayer Tracker - App Store Deployment Guide

## 🚀 Quick Start for App Store Deployment

This guide will help you deploy your Prayer Tracker app to both iOS App Store and Google Play Store using Expo Application Services (EAS).

## 📋 Prerequisites

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev)
2. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   ```
3. **Developer Accounts**:
   - Apple Developer Account ($99/year)
   - Google Play Console Account ($25 one-time)

## 🔧 Setup Steps

### 1. Configure EAS Project

```bash
# Login to Expo
eas login

# Initialize EAS in your project
eas build:configure

# Create EAS project
eas project:init
```

### 2. Update App Configuration

Update the following in `app.json`:
- `expo.name`: Your app's display name
- `expo.slug`: Unique identifier
- `ios.bundleIdentifier`: iOS bundle ID (e.g., com.yourcompany.prayertracker)
- `android.package`: Android package name (same as bundle ID)
- `extra.eas.projectId`: Your EAS project ID

### 3. Environment Variables

Set up your production environment variables:

```bash
# Set Supabase credentials for production builds
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value your_supabase_url
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your_supabase_anon_key
```

### 4. Build for App Stores

```bash
# Build for iOS App Store
eas build --platform ios --profile production

# Build for Google Play Store  
eas build --platform android --profile production

# Build for both platforms
eas build --platform all --profile production
```

### 5. Submit to App Stores

```bash
# Submit to iOS App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

## 📱 App Store Requirements

### iOS App Store
- **App Name**: Prayer Tracker
- **Category**: Lifestyle
- **Age Rating**: 4+ (No Objectionable Content)
- **Keywords**: prayer, islam, muslim, tracking, spiritual, community
- **Description**: Use the content from `store-assets/app-store-description.md`

### Google Play Store
- **App Category**: Lifestyle
- **Content Rating**: Everyone
- **Target Audience**: All ages
- **Privacy Policy**: Required (use `store-assets/privacy-policy.md`)

## 🎨 Required Assets

You'll need to create these assets:

### App Icons
- **iOS**: 1024x1024px PNG (no transparency)
- **Android**: 512x512px PNG + adaptive icon layers

### Screenshots
- **iOS**: Various iPhone and iPad sizes
- **Android**: Phone and tablet screenshots

### Marketing Assets
- **Feature Graphic**: 1024x500px (Google Play)
- **App Preview Video**: Optional but recommended

## 🔒 Privacy & Compliance

### Privacy Policy
- Use the template in `store-assets/privacy-policy.md`
- Host it on your website
- Update the URL in app store listings

### Terms of Service
- Use the template in `store-assets/terms-of-service.md`
- Host it on your website
- Link from your app settings

### Data Safety (Google Play)
- Declare what data you collect
- Explain how data is used
- Specify data sharing practices

## 🚀 Launch Strategy

### Pre-Launch
1. **Beta Testing**: Use TestFlight (iOS) and Internal Testing (Android)
2. **App Store Optimization**: Research keywords and optimize descriptions
3. **Marketing Materials**: Prepare social media assets and website

### Launch Day
1. **Monitor Reviews**: Respond to user feedback quickly
2. **Track Analytics**: Monitor downloads and user engagement
3. **Bug Fixes**: Be ready to push updates if needed

### Post-Launch
1. **Regular Updates**: Add new features and improvements
2. **User Engagement**: Build community through social media
3. **App Store Optimization**: Continuously improve based on data

## 🛠 Troubleshooting

### Common Issues

**Build Failures**
- Check that all required assets are present
- Verify environment variables are set correctly
- Ensure bundle identifiers are unique

**App Store Rejection**
- Review Apple/Google guidelines carefully
- Ensure privacy policy is accessible
- Test all app functionality thoroughly

**Supabase Configuration**
- Verify database is properly set up
- Check RLS policies are configured
- Test authentication flows

## 📞 Support

- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **EAS Build**: [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction)
- **App Store Guidelines**: Apple and Google developer documentation

---

## 🎯 Next Steps

1. Set up your developer accounts
2. Configure EAS project
3. Create required assets (icons, screenshots)
4. Set up Supabase production database
5. Build and test your app
6. Submit to app stores
7. Launch and promote your app!

**May Allah bless your app's success in helping Muslims maintain their prayer consistency! 🤲**