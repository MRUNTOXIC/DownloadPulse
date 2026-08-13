/**
 * DownloadPulse Centralized Downloads & Installers Config
 */

export const PRODUCT_INFO = {
  name: "DownloadPulse",
  displayName: "Download PULSE",
  version: "1.0.0",
  releaseDate: "2026-08-13",
  tagline: "Real-Time File Activity Monitoring Across Mac, Windows & Mobile",
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
    badge: "Official Windows Setup",
    requirements: "Windows 10 20H2 or Windows 11 (x64)",
    installSteps: [
      "Download DownloadPulse-Setup.exe installer",
      "Launch installer to start the DownloadPulse setup wizard",
      "Follow on-screen steps to install background Desktop Agent",
      "DownloadPulse launches automatically in system tray",
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
    badge: "Universal macOS Image",
    requirements: "macOS Monterey (12.0) or newer (Apple Silicon M1/M2/M3 & Intel)",
    installSteps: [
      "Download DownloadPulse.dmg disk image",
      "Open disk image and drag DownloadPulse app into Applications folder",
      "Launch DownloadPulse from Launchpad or Applications",
      "Grant required Accessibility / Notification permissions when prompted",
      "DownloadPulse runs silently in macOS Menu Bar"
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
    badge: "Direct Mobile APK",
    requirements: "Android 8.0 Oreo or higher",
    installSteps: [
      "Download DownloadPulse.apk directly to your Android device",
      "Tap the downloaded APK file to initiate installation",
      "Allow installation from browser / file manager if prompted",
      "Open DownloadPulse and sign in to link your account",
      "Allow push notification permissions for live activity alerts"
    ]
  },
  ios: {
    id: "ios",
    name: "DownloadPulse for iOS",
    platformLabel: "iOS 15.0+ (iPhone & iPad)",
    version: "1.0.0",
    filename: "App Store",
    format: "App Store",
    fileSize: "38 MB",
    releaseDate: "2026-08-13",
    url: "https://apps.apple.com/app/downloadpulse/id123456789",
    iconName: "Smartphone",
    badge: "Official App Store",
    requirements: "iOS 15.0 or iPadOS 15.0 or newer",
    installSteps: [
      "Open Apple App Store on your iPhone or iPad",
      "Search for DownloadPulse or tap App Store button",
      "Tap Get to install application",
      "Sign in to pair your mobile phone with your Mac/PC",
      "Enable Push Notifications to receive file activity alerts"
    ]
  }
};

export function triggerFileDownload(platformId) {
  const config = DOWNLOADS[platformId] || DOWNLOADS.windows;
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
