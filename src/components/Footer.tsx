import React from 'react';
import { CLINIC_INFO } from '../data/dentalData';
import { Webhook, Heart } from 'lucide-react';

interface FooterProps {
  webhookUrl: string;
  onOpenWebhookConfig: () => void;
}

export const Footer: React.FC<FooterProps> = ({ webhookUrl, onOpenWebhookConfig }) => {
  return (
    <footer className="bg-[#1A1A1A] text-[#E9EDDE]/70 text-xs py-8 border-t border-[#D1D8C1]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#D1D8C1]/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5A5A40] flex items-center justify-center text-white font-bold">
              🦷
            </div>
            <div>
              <span className="font-serif font-bold text-white text-sm block">{CLINIC_INFO.name}</span>
              <span className="text-[11px] text-[#E9EDDE]/60">{CLINIC_INFO.tagline}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWebhookConfig}
              className="inline-flex items-center gap-1.5 bg-[#5A5A40]/40 hover:bg-[#5A5A40]/60 text-[#E9EDDE] px-3 py-1.5 rounded-lg border border-[#D1D8C1]/30 text-[11px] font-mono transition-colors"
            >
              <Webhook className="w-3.5 h-3.5 text-[#E9EDDE]" />
              <span>n8n Webhook: {webhookUrl.slice(0, 32)}...</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-[#E9EDDE]/50">
          <p>© {new Date().getFullYear()} {CLINIC_INFO.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for client enquiry generation with n8n HTTP POST integration.
          </p>
        </div>
      </div>
    </footer>
  );
};
