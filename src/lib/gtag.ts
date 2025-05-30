// Google Analytics tracking utilities

export const GA_TRACKING_ID = 'G-CYRCEEEQDM';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific event helpers for VibeForge
export const trackGenerateKit = (techStack: {
  framework: string;
  backend: string;
  database: string;
  ide: string;
}) => {
  event({
    action: 'generate_kit',
    category: 'engagement',
    label: `${techStack.framework}-${techStack.backend}-${techStack.database}`,
  });
};

export const trackCopyContent = (contentType: 'rules' | 'prompts' | 'structure') => {
  event({
    action: 'copy_content',
    category: 'engagement',
    label: contentType,
  });
};

export const trackDownloadContent = (contentType: 'rules' | 'prompts' | 'structure') => {
  event({
    action: 'download_content',
    category: 'engagement', 
    label: contentType,
  });
};

export const trackTechStackSelection = (category: string, selection: string) => {
  event({
    action: 'tech_stack_selection',
    category: 'user_interaction',
    label: `${category}:${selection}`,
  });
};

// Type declaration for window.gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
} 