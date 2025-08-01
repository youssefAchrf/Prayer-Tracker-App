// export default {
//   expo: {
//     name: "Prayer Tracker",
//     slug: "prayer-tracker",
//     version: "1.0.0",
//     orientation: "portrait",
//     userInterfaceStyle: "light",

//     // ✅ Native app icon
//     icon: "./assets/images/icon-512.png",

//     // ✅ Splash screen (for native apps only)
//     splash: {
//       image: "./assets/images/splash.png",
//       resizeMode: "contain",
//       backgroundColor: "#ffffff"
//     },

//     updates: {
//       fallbackToCacheTimeout: 0,
//       url: "https://u.expo.dev/your-project-id"
//     },

//     assetBundlePatterns: ["**/*"],

//     ios: {
//       supportsTablet: true,
//       bundleIdentifier: "com.yourcompany.prayertracker",
//       buildNumber: "1.0.0"
//     },

//     android: {
//       adaptiveIcon: {
//         foregroundImage: "./assets/images/adaptive-icon.png",
//         backgroundColor: "#FFFFFF"
//       },
//       package: "com.yourcompany.prayertracker",
//       versionCode: 1,
//       permissions: [
//         "CAMERA",
//         "READ_EXTERNAL_STORAGE",
//         "WRITE_EXTERNAL_STORAGE"
//       ]
//     },

//     web: {
//       favicon: "./public/icon-192.png"
//     },

//     // ✅ Optional: If you want to support web static output (recommended for PWA)
//     output: "static"
//   }
// };

// app.config.js
export default {
  expo: {
    name: "Prayer Tracker",
    slug: "prayer-tracker",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",

    icon: "./assets/images/icon-512.png",

    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/your-project-id"
    },

    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.prayertracker",
      buildNumber: "1.0.0"
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.yourcompany.prayertracker",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },

    web: {
      favicon: "./assets/images/icon-192.png",
      
      meta: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Prayer Tracker"     
   },
      
      links: [
        {
          rel: "manifest",
          href: "/manifest.json",
        },
        {
          rel: "apple-touch-icon",
          href: "/icon-192.png",
        }
      ],
    },

    output: "static"
  }
};