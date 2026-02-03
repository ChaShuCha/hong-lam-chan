
export interface Feature {
  title: string;
  description: string;
  icon: 'Zap' | 'Shield' | 'Star' | 'Globe' | 'Camera' | 'Layout';
}

export interface Testimonial {
  author: string;
  role: string;
  quote: string;
}

export interface SiteConfig {
  companyName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryColor: string;
  secondaryColor: string;
  fontStyle: 'modern' | 'classic' | 'playful';
  aboutText: string;
  features: Feature[];
  testimonials: Testimonial[];
  ctaText: string;
}

export enum AppStatus {
  BOOTING = 'BOOTING',
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  READY = 'READY',
  ERROR = 'ERROR'
}
