export interface TreatmentOption {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'preventative' | 'cosmetic' | 'orthodontics' | 'restorative' | 'emergency';
  durationMinutes: number;
}

export interface EnquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  treatmentType: string;
  treatmentTitle?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  notes: string;
  patientType: 'new' | 'existing';
  urgency: 'routine' | 'soon' | 'urgent';
}

export interface WebhookSubmission {
  id: string;
  timestamp: string;
  data: EnquiryFormData;
  webhookUrl: string;
  status: 'pending' | 'success' | 'failed';
  responseDetails?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  treatment: string;
  date: string;
}
