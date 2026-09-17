import React, { useState } from 'react';
import { WebhookSubmission } from '../types';
import {
  CheckCircle2,
  X,
  Copy,
  Check,
  Calendar,
  User,
  Phone,
  Mail,
  Stethoscope,
  Clock,
  Code2,
  Send,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ConfirmationModalProps {
  submission: WebhookSubmission | null;
  onClose: () => void;
  onRetry: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  submission,
  onClose,
  onRetry,
}) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!submission) return null;

  const { data, webhookUrl, status, responseDetails, timestamp } = submission;
  const isLocalhostUrl = webhookUrl.includes('localhost') || webhookUrl.includes('127.0.0.1');

  const rawPayload = {
    event: 'dental_checkup_enquiry',
    submissionId: submission.id,
    submittedAt: timestamp,
    patient: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      patientType: data.patientType,
    },
    appointment: {
      treatmentType: data.treatmentType,
      treatmentTitle: data.treatmentTitle || data.treatmentType,
      preferredDate: data.preferredDate,
      preferredTimeSlot: data.preferredTimeSlot,
      urgency: data.urgency,
      notes: data.notes || 'None provided',
    },
    metadata: {
      source: 'Lumina Dental Web Portal',
      webhookDestination: webhookUrl,
    },
  };

  const jsonPayloadString = JSON.stringify(rawPayload, null, 2);

  const curlCommand = `curl -X POST "${webhookUrl}" -H "Content-Type: application/json" -d '${JSON.stringify(rawPayload)}'`;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonPayloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-[#FDFCFB] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D1D8C1] my-8 space-y-6">
        
        {/* Header Icon */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#E9EDDE] text-[#5A5A40]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A5A40]">
                Enquiry Processed
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] leading-tight">
                Enquiry Sent to n8n!
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5A5A40] hover:text-[#1A1A1A] rounded-xl hover:bg-[#E9EDDE]/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Transmission Status Badge */}
        <div className="p-3.5 rounded-2xl border flex items-start gap-3 bg-[#E9EDDE] border-[#5A5A40] text-[#1A1A1A]">
          <Send className="w-5 h-5 text-[#5A5A40] shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold">
              Target Endpoint:{' '}
              <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[11px] border border-[#D1D8C1] text-[#1A1A1A]">
                {webhookUrl}
              </code>
            </p>
            <p className="opacity-90">
              {responseDetails ||
                'HTTP POST request was initiated with patient enquiry details.'}
            </p>
          </div>
        </div>

        {/* Client Enquiry Summary Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D1D8C1] space-y-3">
          <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#5A5A40] border-b border-[#D1D8C1]/50 pb-2">
            Submitted Client Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <div>
                <span className="text-[#5A5A40]/70 block text-[10px]">Patient Name</span>
                <span className="font-bold text-[#1A1A1A]">{data.fullName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <div>
                <span className="text-[#5A5A40]/70 block text-[10px]">Email Address</span>
                <span className="font-medium text-[#1A1A1A]">{data.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <div>
                <span className="text-[#5A5A40]/70 block text-[10px]">Phone Number</span>
                <span className="font-semibold text-[#1A1A1A]">{data.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <div>
                <span className="text-[#5A5A40]/70 block text-[10px]">Treatment</span>
                <span className="font-bold text-[#5A5A40]">
                  {data.treatmentTitle || data.treatmentType}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <div>
                <span className="text-[#5A5A40]/70 block text-[10px]">Preferred Date</span>
                <span className="font-semibold text-[#1A1A1A]">{data.preferredDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <div>
                <span className="text-[#5A5A40]/70 block text-[10px]">Time Slot</span>
                <span className="font-medium text-[#1A1A1A]">{data.preferredTimeSlot}</span>
              </div>
            </div>
          </div>

          {data.notes && (
            <div className="pt-2 border-t border-[#D1D8C1]/50 text-xs">
              <span className="text-[#5A5A40]/70 block text-[10px] font-medium">Dental Notes / Comments:</span>
              <p className="text-[#1A1A1A] bg-[#FDFCFB] p-2.5 rounded-xl border border-[#D1D8C1] mt-1 italic">
                "{data.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Localhost / ngrok Guidance Banner if target is localhost */}
        {isLocalhostUrl && (
          <div className="p-3.5 rounded-2xl bg-[#E9EDDE]/80 border border-[#D1D8C1] text-xs text-[#1A1A1A] space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-[#5A5A40]">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Connecting Cloud App to Local n8n</span>
            </p>
            <p className="text-[11px] leading-relaxed text-[#5A5A40]">
              Since this app runs on a Cloud Run server, browsers restrict direct requests to <code className="bg-white px-1 py-0.5 rounded font-mono">http://localhost</code>. Click <strong>Copy cURL Command</strong> below to send this exact JSON payload directly to your n8n test node!
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#D1D8C1]/60 mt-1">
              <button
                type="button"
                onClick={handleCopyCurl}
                className="inline-flex items-center gap-1.5 bg-[#5A5A40] text-white hover:bg-[#4A4A30] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Copied cURL Command!' : 'Copy cURL Command for Terminal'}</span>
              </button>
              <span className="text-[10px] text-[#5A5A40]">For automatic posting, run <code className="bg-white px-1 font-mono border border-[#D1D8C1]">ngrok http 5678</code></span>
            </div>
          </div>
        )}

        {/* Payload Toggle & Code Inspector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5A40] hover:text-[#1A1A1A]"
            >
              <Code2 className="w-4 h-4" />
              <span>{showJson ? 'Hide Transmitted JSON Payload' : 'View Raw n8n JSON Payload'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCurl}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-[#E9EDDE] hover:bg-[#D1D8C1] text-[#1A1A1A] px-2.5 py-1.5 rounded-lg transition-colors"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-[#5A5A40]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Copied cURL!' : 'Copy cURL'}</span>
              </button>

              <button
                onClick={handleCopyJson}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-[#E9EDDE] hover:bg-[#D1D8C1] text-[#1A1A1A] px-2.5 py-1.5 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#5A5A40]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          {showJson && (
            <div className="bg-[#1A1A1A] text-[#E9EDDE] rounded-2xl p-4 font-mono text-[11px] leading-relaxed overflow-x-auto border border-[#D1D8C1]/30 max-h-56">
              <pre>{jsonPayloadString}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-[#D1D8C1]/50">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 bg-[#E9EDDE] hover:bg-[#D1D8C1] text-[#1A1A1A] rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resend to Webhook</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <span>Done / Close</span>
          </button>
        </div>

      </div>
    </div>
  );
};
