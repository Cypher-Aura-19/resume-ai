import { UPLOAD_CONFIG, JOB_CONFIG } from './constants';

/**
 * Validates if a file is a valid PDF and within size limits
 */
export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  if (!UPLOAD_CONFIG.acceptedFormats.includes(file.type as any)) {
    return { valid: false, error: 'Please upload a PDF file' };
  }
  
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  return { valid: true };
}

/**
 * Formats file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Gets match score color and label
 */
export function getMatchScoreInfo(score: number): { color: string; label: string } {
  if (score >= JOB_CONFIG.matchScoreThresholds.excellent) {
    return { color: 'green', label: 'Excellent Match' };
  } else if (score >= JOB_CONFIG.matchScoreThresholds.good) {
    return { color: 'brand', label: 'Good Match' };
  } else if (score >= JOB_CONFIG.matchScoreThresholds.fair) {
    return { color: 'yellow', label: 'Fair Match' };
  }
  return { color: 'gray', label: 'Low Match' };
}

/**
 * Formats a date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Extracts initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Generates a random color for avatars
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-brand-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-brand-500',
    'bg-pink-500',
    'bg-brand-700',
    'bg-orange-500',
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculates skill proficiency percentage
 */
export function calculateSkillProficiency(
  yearsOfExperience: number,
  projectCount: number
): number {
  // Simple algorithm: base on years and projects
  const yearScore = Math.min(yearsOfExperience * 15, 60);
  const projectScore = Math.min(projectCount * 10, 40);
  return Math.min(yearScore + projectScore, 100);
}

/**
 * Determines experience level based on years
 */
export function getExperienceLevel(years: number): string {
  if (years < 1) return 'Entry Level';
  if (years < 3) return 'Junior';
  if (years < 5) return 'Mid-Level';
  if (years < 8) return 'Senior';
  return 'Lead/Principal';
}

/**
 * Formats salary range
 */
export function formatSalaryRange(min: number, max: number, currency = '$'): string {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return num.toString();
  };
  
  return `${currency}${formatNumber(min)}-${currency}${formatNumber(max)}`;
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parses technologies from comma-separated string
 */
export function parseTechnologies(input: string): string[] {
  return input
    .split(',')
    .map(tech => tech.trim())
    .filter(tech => tech.length > 0);
}

/**
 * Groups items by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Calculates reading time for text
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Safely parses JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
