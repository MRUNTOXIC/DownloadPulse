/**
 * Platform Auto-Detection Utility
 */

export function detectUserPlatform() {
  if (typeof window === 'undefined' || !window.navigator) {
    return { id: 'windows', name: 'Windows', recommendation: 'Recommended for your PC', ext: '.exe' };
  }

  const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera || '';
  const platform = window.navigator.platform || '';

  if (/android/i.test(userAgent)) {
    return {
      id: 'android',
      name: 'Android',
      recommendation: 'Recommended for your Android Phone',
      icon: 'Smartphone',
      actionText: 'Download APK (.apk)',
      ext: '.apk'
    };
  }

  if (/iPad|iPhone|iPod/.test(platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || /iPhone|iPad|iPod/i.test(userAgent)) {
    return {
      id: 'ios',
      name: 'iOS',
      recommendation: 'Recommended for your iPhone / iPad',
      icon: 'Smartphone',
      actionText: 'Open App Store Page',
      ext: 'App Store'
    };
  }

  if (/Mac/i.test(platform) || /Macintosh|Mac OS X/i.test(userAgent)) {
    return {
      id: 'macos',
      name: 'macOS',
      recommendation: 'Recommended for your Mac',
      icon: 'Apple',
      actionText: 'Download for macOS (.dmg)',
      ext: '.dmg'
    };
  }

  return {
    id: 'windows',
    name: 'Windows',
    recommendation: 'Recommended for your Windows PC',
    icon: 'Monitor',
    actionText: 'Download for Windows (.exe)',
    ext: '.exe'
  };
}
