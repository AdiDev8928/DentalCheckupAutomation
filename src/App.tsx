import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { EnquiryForm } from './components/EnquiryForm';
import { ClinicFeatures } from './components/ClinicFeatures';
import { Footer } from './components/Footer';
import { WebhookConfigModal } from './components/WebhookConfigModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { DEFAULT_WEBHOOK_URL } from './data/dentalData';
import { WebhookSubmission } from './types';

export default function App() {
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('n8n_webhook_url') || DEFAULT_WEBHOOK_URL;
  });

  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [activeSubmission, setActiveSubmission] = useState<WebhookSubmission | null>(null);

  const handleSaveWebhookUrl = (newUrl: string) => {
    setWebhookUrl(newUrl);
    localStorage.setItem('n8n_webhook_url', newUrl);
  };

  const handleScrollToForm = () => {
    const el = document.getElementById('enquiry-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmissionComplete = (submission: WebhookSubmission) => {
    setActiveSubmission(submission);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#1A1A1A] flex flex-col selection:bg-[#E9EDDE] selection:text-[#1A1A1A]">
      
      {/* Sticky Top Bar / Navbar */}
      <Header
        webhookUrl={webhookUrl}
        onOpenWebhookConfig={() => setIsConfigModalOpen(true)}
        onScrollToForm={handleScrollToForm}
      />

      {/* Main Single Page Content */}
      <main className="flex-1 space-y-8">
        
        {/* Hero Section */}
        <Hero onScrollToForm={handleScrollToForm} />

        {/* Core Enquiry Form Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-4">
          <EnquiryForm
            webhookUrl={webhookUrl}
            onSubmissionComplete={handleSubmissionComplete}
            onOpenWebhookConfig={() => setIsConfigModalOpen(true)}
          />
        </div>

        {/* Dental Features, Testimonials, FAQs & Location */}
        <ClinicFeatures />

      </main>

      {/* Footer */}
      <Footer
        webhookUrl={webhookUrl}
        onOpenWebhookConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Webhook Settings Modal */}
      <WebhookConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentWebhookUrl={webhookUrl}
        onSaveWebhookUrl={handleSaveWebhookUrl}
      />

      {/* Confirmation & Payload Inspector Modal */}
      <ConfirmationModal
        submission={activeSubmission}
        onClose={() => setActiveSubmission(null)}
        onRetry={() => {
          if (activeSubmission) {
            handleScrollToForm();
            setActiveSubmission(null);
          }
        }}
      />

    </div>
  );
}
