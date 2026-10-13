/**
 * Client Device Telemetry Utility
 * Dynamically detects client device model, OS, browser, and hardware fingerprint
 * to eliminate hardcoded device strings in BSA 65B certificates and Form 1 notices.
 */

export interface DeviceTelemetry {
  os: string;
  model: string;
  browser: string;
  fingerprint: string;
}

export function getDeviceOS(): string {
  if (typeof window === 'undefined' || !navigator) {
    return 'Unknown OS';
  }

  // Check User-Agent Client Hints if available
  const uaData = (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData;
  if (uaData?.platform) {
    return uaData.platform;
  }

  const ua = navigator.userAgent;
  if (/Windows NT 10.0/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT 6.3/i.test(ua)) return 'Windows 8.1';
  if (/Windows NT 6.1/i.test(ua)) return 'Windows 7';
  if (/Mac OS X/i.test(ua)) {
    const match = ua.match(/Mac OS X ([0-9_]+)/);
    return match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
  }
  if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s+([0-9.]+)/);
    return match ? `Android ${match[1]}` : 'Android';
  }
  if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS\s+([0-9_]+)/);
    return match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
  }
  if (/Linux/i.test(ua)) return 'Linux';
  if (/CrOS/i.test(ua)) return 'Chrome OS';

  return navigator.platform || 'Unknown OS';
}

export function getDeviceModel(): string {
  if (typeof window === 'undefined' || !navigator) {
    return 'Client Terminal';
  }

  const ua = navigator.userAgent;

  // Specific common tablet / field device patterns
  if (/SM-X200|SM-X205|SM-T500|SM-T505|SM-T510/i.test(ua)) return 'Samsung Galaxy Tab';
  if (/SM-G/i.test(ua)) return 'Samsung Galaxy Device';
  if (/iPad/i.test(ua)) return 'Apple iPad';
  if (/iPhone/i.test(ua)) return 'Apple iPhone';
  if (/Pixel/i.test(ua)) {
    const match = ua.match(/Pixel\s?[0-9a-zA-Z\s]+/);
    return match ? match[0] : 'Google Pixel';
  }
  if (/Surface/i.test(ua)) return 'Microsoft Surface';

  // Desktop / laptop detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (!isMobile) {
    const arch = navigator.userAgent.includes('Win64') || navigator.userAgent.includes('x64') ? ' (x64)' : '';
    const os = getDeviceOS();
    return `${os} Field Workstation${arch}`;
  }

  return 'Mobile Inspection Terminal';
}

export function getDeviceBrowser(): string {
  if (typeof window === 'undefined' || !navigator) {
    return 'Unknown Browser';
  }

  const ua = navigator.userAgent;
  if (/Edg\/([0-9.]+)/i.test(ua)) {
    const m = ua.match(/Edg\/([0-9.]+)/);
    return `Edge ${m ? m[1] : ''}`.trim();
  }
  if (/Chrome\/([0-9.]+)/i.test(ua)) {
    const m = ua.match(/Chrome\/([0-9.]+)/);
    return `Chrome ${m ? m[1] : ''}`.trim();
  }
  if (/Firefox\/([0-9.]+)/i.test(ua)) {
    const m = ua.match(/Firefox\/([0-9.]+)/);
    return `Firefox ${m ? m[1] : ''}`.trim();
  }
  if (/Safari\/([0-9.]+)/i.test(ua) && !/Chrome/i.test(ua)) {
    const m = ua.match(/Version\/([0-9.]+)/);
    return `Safari ${m ? m[1] : ''}`.trim();
  }

  return 'Standard Browser';
}

export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined' || !navigator) {
    return 'TERMINAL-GENERIC';
  }

  // Check localStorage for a stable persistent device UUID
  try {
    const stored = localStorage.getItem('nirikshak_device_fingerprint');
    if (stored) return stored;
  } catch {
    // localStorage might be unavailable/restricted
  }

  const os = getDeviceOS().replace(/[^a-zA-Z0-9]/g, '-').slice(0, 10);
  const screenRes = typeof window !== 'undefined' && window.screen ? `${window.screen.width}x${window.screen.height}` : 'std';
  const cores = navigator.hardwareConcurrency || 4;
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const fingerprint = `CLI-${os}-${screenRes}-${cores}C-${randomSuffix}`;

  try {
    localStorage.setItem('nirikshak_device_fingerprint', fingerprint);
  } catch {
    // ignore
  }

  return fingerprint;
}

export function getClientTelemetryHeaders(): Record<string, string> {
  const os = getDeviceOS();
  const model = getDeviceModel();
  const browser = getDeviceBrowser();
  const fingerprint = getDeviceFingerprint();

  return {
    'X-Device-Fingerprint': fingerprint,
    'X-Device-Model': model,
    'X-Device-OS': os,
    'X-Device-Browser': browser,
    'X-Clock-Source': 'CLIENT_SYSTEM_TIME',
  };
}
