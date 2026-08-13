/**
 * DownloadPulse Centralized Installer & Download Configuration
 * 
 * Replace the production URL values or place real binary installer files into /public/downloads/
 * (e.g. /public/downloads/DownloadPulse-Setup.exe) to enable instant direct downloads.
 */

export const PRODUCT_INFO = {
  name: "DownloadPulse",
  version: "1.0.0",
  releaseDate: "2026-08-13",
  tagline: "Real-Time File Activity Monitoring Across Your Devices",
  supportEmail: "support@downloadpulse.io"
};

export const DOWNLOADS = {
  windows: {
    id: "windows",
    name: "DownloadPulse for Windows",
    platformLabel: "Windows 10 / 11 (64-bit)",
    version: "1.0.0",
    filename: "DownloadPulse-Setup.exe",
    format: ".exe",
    fileSize: "124 MB",
    releaseDate: "2026-08-13",
    url: "/downloads/DownloadPulse-Setup.exe",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    iconName: "Monitor",
    badge: "Official Installer",
    requirements: "Windows 10 20H2 or Windows 11 (x64)",
    installSteps: [
      "Download DownloadPulse-Setup.exe",
      "Double-click the installer to launch setup wizard",
      "Follow on-screen instructions to complete installation",
      "DownloadPulse starts automatically in background system tray",
      "Sign in to pair your computer with your account"
    ]
  },
  macos: {
    id: "macos",
    name: "DownloadPulse for macOS",
    platformLabel: "macOS 12+ (Universal / Apple Silicon & Intel)",
    version: "1.0.0",
    filename: "DownloadPulse.dmg",
    format: ".dmg",
    fileSize: "118 MB",
    releaseDate: "2026-08-13",
    url: "/downloads/DownloadPulse.dmg",
    sha256: "8743b52063cd84097a65d1633f5c74f5",
    iconName: "Apple",
    badge: "Universal Binary",
    requirements: "macOS Monterey (12.0) or newer",
    installSteps: [
      "Download DownloadPulse.dmg disk image",
      "Open disk image and drag DownloadPulse to Applications folder",
      "Launch DownloadPulse from Launchpad or Finder",
      "Grant Accessibility & Full Disk Access permissions if prompted",
      "Sign in to start background file monitoring"
    ]
  },
  android: {
    id: "android",
    name: "DownloadPulse for Android",
    platformLabel: "Android 8.0+",
    version: "1.0.0",
    filename: "DownloadPulse.apk",
    format: ".apk",
    fileSize: "42 MB",
    releaseDate: "2026-08-13",
    url: "/downloads/DownloadPulse.apk",
    sha256: "a1b2c3d4e5f67890123456789abcdef0",
    iconName: "Smartphone",
    badge: "Direct APK",
    requirements: "Android 8.0 Oreo or higher",
    installSteps: [
      "Download DownloadPulse.apk onto your Android device",
      "Open the downloaded APK file from downloads or file manager",
      "Allow installation from unknown sources if prompted by browser",
      "Open DownloadPulse app and sign in",
      "Enable notification permissions for live activity push alerts"
    ]
  },
  ios: {
    id: "ios",
    name: "DownloadPulse for iOS",
    platformLabel: "iOS 15.0+ (iPhone & iPad)",
    version: "1.0.0",
    filename: "App Store Link",
    format: "App Store",
    fileSize: "38 MB",
    releaseDate: "2026-08-13",
    url: "https://apps.apple.com/app/downloadpulse/id123456789", // Replace with real App Store URL
    iconName: "Smartphone",
    badge: "App Store",
    requirements: "iOS 15.0 or iPadOS 15.0 or newer",
    installSteps: [
      "Open Apple App Store on your iPhone or iPad",
      "Search for DownloadPulse or click App Store button",
      "Tap 'Get' or Cloud icon to download application",
      "Open DownloadPulse and sign in to connect device",
      "Allow Push Notifications for immediate file activity alerts"
    ]
  }
};

/**
 * Initiates file download and returns metadata for user UI progress simulation.
 */
export function initiateDownload(platformId) {
  const config = DOWNLOADS[platformId] || DOWNLOADS.windows;
  
  // Create invisible link element to trigger browser download
  if (config.url && config.url.startsWith('/')) {
    const link = document.createElement('a');
    link.href = config.url;
    link.download = config.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (config.url && config.url.startsWith('http')) {
    window.open(config.url, '_blank', 'noopener,noreferrer');
  }

  return config;
}
