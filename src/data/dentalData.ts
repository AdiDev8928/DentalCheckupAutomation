import { TreatmentOption, FAQItem, Testimonial } from '../types';

export const DEFAULT_WEBHOOK_URL = 'YOUR_N8N_URL';

export const CLINIC_INFO = {
  name: 'Lumina Dental & Oral Health',
  tagline: 'Gentle, Painless & Modern Dental Care',
  phone: '+1 (800) 555-DENTAL',
  email: 'care@luminadental.com',
  address: '452 Healthcare Ave, Suite 300, Medical District',
  hours: 'Mon - Fri: 8:00 AM - 7:00 PM | Sat: 9:00 AM - 4:00 PM',
  emergencyAvailable: true,
};

export const TREATMENT_OPTIONS: TreatmentOption[] = [
  {
    id: 'checkup-cleaning',
    title: 'Routine Checkup & Cleaning',
    description: 'Comprehensive oral examination, digital X-rays, plaque removal, and fluoride polish.',
    iconName: 'Sparkles',
    category: 'preventative',
    durationMinutes: 45,
  },
  {
    id: 'teeth-whitening',
    title: 'Professional Teeth Whitening',
    description: 'Laser whitening treatment to lift stubborn stains up to 8 shades lighter safely.',
    iconName: 'Sun',
    category: 'cosmetic',
    durationMinutes: 60,
  },
  {
    id: 'orthodontics-aligners',
    title: 'Clear Aligners & Braces',
    description: 'Discreet invisible aligners and orthodontic assessment for perfectly straight teeth.',
    iconName: 'Smile',
    category: 'orthodontics',
    durationMinutes: 30,
  },
  {
    id: 'root-canal-care',
    title: 'Root Canal & Pain Relief',
    description: 'Painless endodontic therapy to save infected teeth and relieve severe toothaches.',
    iconName: 'ShieldAlert',
    category: 'restorative',
    durationMinutes: 60,
  },
  {
    id: 'implants-crowns',
    title: 'Dental Implants & Crowns',
    description: 'Natural-looking permanent tooth replacements, porcelain crowns, and bridges.',
    iconName: 'ShieldCheck',
    category: 'restorative',
    durationMinutes: 60,
  },
  {
    id: 'pediatric-dentistry',
    title: 'Pediatric Dental Care',
    description: 'Gentle, friendly checkups and protective sealants designed specially for children.',
    iconName: 'HeartHandshake',
    category: 'preventative',
    durationMinutes: 30,
  },
  {
    id: 'emergency-care',
    title: 'Emergency Dental Visit',
    description: 'Same-day urgent treatment for chipped, knocked-out, or severely painful teeth.',
    iconName: 'Activity',
    category: 'emergency',
    durationMinutes: 45,
  },
  {
    id: 'general-consultation',
    title: 'General Dental Consultation',
    description: 'Discussion of specific concerns, second opinions, and customized treatment plans.',
    iconName: 'Stethoscope',
    category: 'preventative',
    durationMinutes: 30,
  },
];

export const TIME_SLOTS = [
  'Morning (08:30 AM - 10:30 AM)',
  'Late Morning (10:30 AM - 01:00 PM)',
  'Early Afternoon (01:00 PM - 03:30 PM)',
  'Late Afternoon (03:30 PM - 05:30 PM)',
  'Evening (05:30 PM - 07:00 PM)',
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How often should I get a routine dental checkup?',
    answer: 'We recommend visiting every 6 months for a preventative inspection and professional hygiene cleaning to catch issues early and keep your smile healthy.',
    category: 'General',
  },
  {
    question: 'Is the initial consultation painful?',
    answer: 'Not at all! Our checkups are entirely painless. We use high-resolution intraoral cameras and gentle diagnostic tools to inspect your teeth comfortably.',
    category: 'Checkups',
  },
  {
    question: 'How does the n8n webhook appointment enquiry work?',
    answer: 'When you submit your enquiry, your contact info, preferred time, and treatment preferences are instantly formatted into a structured JSON payload and sent directly to our n8n automation workflow for immediate front-desk routing.',
    category: 'Booking',
  },
  {
    question: 'What happens if I have an urgent dental emergency?',
    answer: 'Please select "Emergency Dental Visit" in the enquiry form or call our emergency hotline directly at +1 (800) 555-DENTAL for prioritized same-day placement.',
    category: 'Emergency',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah M.',
    rating: 5,
    comment: 'Submitting my enquiry online was so quick! The front desk reached out within 15 minutes to confirm my slot.',
    treatment: 'Teeth Whitening',
    date: '2 days ago',
  },
  {
    id: 't2',
    name: 'David K.',
    rating: 5,
    comment: 'Super gentle dentists and state-of-the-art facility. The checkup and cleaning left my teeth feeling amazing.',
    treatment: 'Routine Checkup & Cleaning',
    date: '1 week ago',
  },
  {
    id: 't3',
    name: 'Elena R.',
    rating: 5,
    comment: 'Extremely easy process. I selected my preferred time and treatment type online without any hassle.',
    treatment: 'Clear Aligners',
    date: '3 days ago',
  },
];
