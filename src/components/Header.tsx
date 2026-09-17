import React from 'react';
import { CLINIC_INFO } from '../data/dentalData';
import { Phone, Webhook, Shield, Clock } from 'lucide-react';

interface HeaderProps {
  webhookUrl: string;
  onOpenWebhookConfig: () => void;
  onScrollToForm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  webhookUrl,
  onOpenWebhookConfig,
  onScrollToForm,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      {/* Top micro bar */}
      <div className="bg-sky-950 text-sky-100 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-sky-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {CLINIC_INFO.hours}
            </span>
            <span className="hidden md:inline-block text-sky-700">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Accepting New Patients
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWebhookConfig}
              className="inline-flex items-center gap-1.5 bg-sky-900/80 hover:bg-sky-800 text-sky-200 hover:text-white px-2.5 py-0.5 rounded-full text-xs transition-colors border border-sky-800"
              title="Click to view or edit target n8n webhook URL"
            >
              <Webhook className="w-3 h-3 text-cyan-400" />
              <span>n8n Endpoint Active</span>
            </button>
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="hover:text-white transition-colors flex items-center gap-1 font-medium text-sky-200"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span>{CLINIC_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            {/* Tooth SVG Icon */}
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C8 2 6 4.5 6 8c0 2.5 1 5 2 8 .6 1.8 1 4 2 4 1 0 1.5-1.5 2-3 .5 1.5 1 3 2 3 1 0 1.4-2.2 2-4 1-3 2-5.5 2-8 0-3.5-2-6-6-6z" />
              <path d="M9 10c1.5.5 4.5.5 6 0" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
              Lumina Dental
            </h1>
            <p className="text-xs text-sky-600 font-medium">
              Checkup & Oral Care Clinic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenWebhookConfig}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600 bg-slate-100 hover:bg-sky-50 px-3 py-2 rounded-lg transition-colors border border-slate-200"
          >
            <Webhook className="w-3.5 h-3.5 text-sky-600" />
            <span>Webhook Config</span>
          </button>

          <button
            onClick={onScrollToForm}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-sky-600/25 active:scale-95"
          >
            <Shield className="w-4 h-4" />
            <span>Book Enquiry</span>
          </button>
        </div>
      </div>
    </header>
  );
};
