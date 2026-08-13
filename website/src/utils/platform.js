/**
 * Client Platform & OS Auto-Detection Utility
 */

export function detectUserPlatform() {
  if (typeof window === 'undefined' || !window.navigator) {
    return { id: 'windows', name: 'Windows', recommendation: 'Recommended for your device' };
  }

  const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera || '';
  const platform = window.navigator.platform || '';

  // Android Detection
  if (/android/i.test(userAgent)) {
    return {
      id: 'android',
      name: 'Android',
      recommendation: 'Recommended for your Android Phone / Tablet',
      icon: 'Smartphone',
      actionText: 'Download Android APK'
    };
  }

  // iOS Detection (iPhone, iPad, iPod)
  if (/iPad|iPhone|iPod/.test(platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || /iPhone|iPad|iPod/i.test(userAgent)) {
    return {
      id: 'ios',
      name: 'iOS',
      recommendation: 'Recommended for your iPhone / iPad',
      icon: 'Smartphone',
      actionText: 'Open in App Store'
    };
  }

  // macOS Detection
  if (/Mac/i.test(platform) || /Macintosh|Mac OS X/i.test(userAgent)) {
    return {
      id: 'macos',
      name: 'macOS',
      recommendation: 'Recommended for your Mac',
      icon: 'Apple',
      actionText: 'Download for macOS (.dmg)'
    };
  }

  // Windows Detection
  if (/Win/i.test(platform) || /Windows/i.test(userAgent)) {
    return {
      id: 'windows',
      name: 'Windows',
      recommendation: 'Recommended for your Windows PC',
      icon: 'Monitor',
      actionText: 'Download for Windows (.exe)'
    };
  }

  // Fallback (Linux / Unix / Other)
  return {
    id: 'windows',
    name: 'Windows',
    recommendation: 'Recommended for your Desktop',
    icon: 'Monitor',
    actionText: 'Download Installer'
  };
}
