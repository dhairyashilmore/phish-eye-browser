
/**
 * URL Feature Extractor
 * Extracts features from URLs for phishing detection
 */

// Feature extraction for phishing detection
export interface UrlFeatures {
  urlLength: number;
  domainLength: number;
  hasHttps: boolean;
  numDots: number;
  numDashes: number;
  numDigits: number;
  numSubdomains: number;
  hasIpAddress: boolean;
  hasSuspiciousTld: boolean;
  hasUrlShortener: boolean;
  entropy: number;
}

// List of common URL shorteners
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 
  'cli.gs', 'pic.gd', 'ddp.ly', 'su.pr', 'ow.ly'
];

// List of suspicious TLDs often used in phishing
const SUSPICIOUS_TLDS = [
  'xyz', 'top', 'club', 'online', 'site', 'live', 'stream', 
  'click', 'bid', 'cf', 'ga', 'ml', 'gq', 'tk'
];

/**
 * Calculate Shannon entropy of a string
 */
const calculateEntropy = (str: string): number => {
  const len = str.length;
  const frequencies: Record<string, number> = {};

  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  return Object.values(frequencies).reduce((entropy, count) => {
    const p = count / len;
    return entropy - (p * Math.log2(p));
  }, 0);
};

/**
 * Check if string is an IP address
 */
const isIpAddress = (str: string): boolean => {
  const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  if (!ipRegex.test(str)) return false;
  
  const parts = str.split('.').map(Number);
  return parts.every(part => part >= 0 && part <= 255);
};

/**
 * Extract domain from URL
 */
const extractDomain = (url: string): string => {
  try {
    let hostname;
    if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
  } catch (e) {
    return url;
  }
};

/**
 * Count subdomains in a domain
 */
const countSubdomains = (domain: string): number => {
  return domain.split('.').length - 1;
};

/**
 * Extract features from a URL
 */
export const extractFeatures = (url: string): UrlFeatures => {
  // Normalize the URL
  const normalizedUrl = url.toLowerCase();
  const domain = extractDomain(normalizedUrl);
  const tld = domain.split('.').pop() || '';
  
  // Calculate features
  return {
    urlLength: url.length,
    domainLength: domain.length,
    hasHttps: url.startsWith('https://'),
    numDots: (url.match(/\./g) || []).length,
    numDashes: (url.match(/-/g) || []).length,
    numDigits: (url.match(/\d/g) || []).length,
    numSubdomains: countSubdomains(domain),
    hasIpAddress: isIpAddress(domain),
    hasSuspiciousTld: SUSPICIOUS_TLDS.includes(tld),
    hasUrlShortener: URL_SHORTENERS.some(shortener => domain.includes(shortener)),
    entropy: calculateEntropy(url),
  };
};

/**
 * Normalize features for machine learning models
 */
export const normalizeFeatures = (features: UrlFeatures): number[] => {
  // Convert features to array of numbers normalized between 0 and 1
  return [
    Math.min(features.urlLength / 100, 1), // Cap at 100 chars
    Math.min(features.domainLength / 50, 1), // Cap at 50 chars
    features.hasHttps ? 0 : 1, // Invert for risk (no HTTPS = higher risk)
    Math.min(features.numDots / 10, 1), // Cap at 10 dots
    Math.min(features.numDashes / 5, 1), // Cap at 5 dashes
    Math.min(features.numDigits / 10, 1), // Cap at 10 digits
    Math.min(features.numSubdomains / 5, 1), // Cap at 5 subdomains
    features.hasIpAddress ? 1 : 0,
    features.hasSuspiciousTld ? 1 : 0,
    features.hasUrlShortener ? 1 : 0,
    features.entropy / 5, // Normalize entropy (typically 0-5)
  ];
};
