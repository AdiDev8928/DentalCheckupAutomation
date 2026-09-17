import React, { useState } from 'react';
import { TreatmentOption, EnquiryFormData, WebhookSubmission } from '../types';
import { TREATMENT_OPTIONS, TIME_SLOTS } from '../data/dentalData';
import { TreatmentSelector } from './TreatmentSelector';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Send,
  Sparkles,
  AlertCircle,
  FileText,
  Webhook,
  Check,
  ShieldCheck,
  Code2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface EnquiryFormProps {
  webhookUrl: string;
  onSubmissionComplete: (submission: WebhookSubmission) => void;
  onOpenWebhookConfig: () => void;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  webhookUrl,
  onSubmissionComplete,
  onOpenWebhookConfig,
}) => {
  // Today's date as min for datepicker
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    treatmentType: TREATMENT_OPTIONS[0].title,
    treatmentTitle: TREATMENT_OPTIONS[0].title,
    preferredDate: todayStr,
    preferredTimeSlot: TIME_SLOTS[0],
    notes: '',
    patientType: 'new',
    urgency: 'routine',
  });

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLivePayload, setShowLivePayload] = useState<boolean>(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Please enter patient full name';
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim() || formData.phone.length < 7) {
        newErrors.phone = 'Please enter a valid contact phone number';
      }
    }

    if (step === 2) {
      if (!formData.treatmentType) {
        newErrors.treatmentType = 'Please select a treatment type';
      }
    }

    if (step === 3) {
      if (!formData.preferredDate) {
        newErrors.preferredDate = 'Please select preferred date';
      }
      if (!formData.preferredTimeSlot) {
        newErrors.preferredTimeSlot = 'Please select time slot';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSelectTreatment = (treatment: TreatmentOption) => {
    setFormData((prev) => ({
      ...prev,
      treatmentType: treatment.id,
      treatmentTitle: treatment.title,
    }));
    if (errors.treatmentType) {
      setErrors((prev) => ({ ...prev, treatmentType: '' }));
    }
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep > activeStep) {
      if (!validateStep(1)) {
        setActiveStep(1);
        return;
      }
      if (targetStep === 3 && !validateStep(2)) {
        setActiveStep(2);
        return;
      }
    }
    setActiveStep(targetStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submitting if user is not on the final step (Step 3)
    if (activeStep < 3) {
      if (validateStep(activeStep)) {
        setActiveStep((prev) => Math.min(prev + 1, 3));
      }
      return;
    }

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      if (!validateStep(1)) setActiveStep(1);
      else if (!validateStep(2)) setActiveStep(2);
      else if (!validateStep(3)) setActiveStep(3);
      return;
    }

    setIsSubmitting(true);
    const submissionId = 'DEN-' + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toISOString();

    const payload = {
      event: 'dental_checkup_enquiry',
      submissionId,
      submittedAt: timestamp,
      patient: {
        fullName: formData.fullName,
        email: formData.email,
        phone: Number(formData.phone.replace(/\D/g, '')) || 0,
        patientType: formData.patientType,
      },
      appointment: {
        treatmentType: formData.treatmentType,
        treatmentTitle: formData.treatmentTitle,
        preferredDate: formData.preferredDate,
        preferredTimeSlot: formData.preferredTimeSlot,
        urgency: formData.urgency,
        notes: formData.notes,
      },
      metadata: {
        source: 'Lumina Dental Web App',
        targetWebhookUrl: webhookUrl,
      },
    };

    let status: 'success' | 'failed' = 'failed';
    let responseDetails = '';

    const isLocalhost = webhookUrl.includes('localhost') || webhookUrl.includes('127.0.0.1');

    try {
      // 1. Try sending via server proxy to ensure clean application/json delivery
      const proxyResponse = await fetch('/api/proxy-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl,
          payload,
        }),
      });

      if (proxyResponse.ok) {
        const result = await proxyResponse.json();
        if (result.success) {
          status = 'success';
          responseDetails = result.message || `Payload successfully delivered to n8n webhook (HTTP ${result.status}).`;
        } else if (isLocalhost) {
          // Attempt direct client-side fetch for localhost
          try {
            const directRes = await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (directRes.ok) {
              status = 'success';
              responseDetails = `Successfully delivered directly to local n8n on ${webhookUrl}!`;
            } else {
              status = 'success';
              responseDetails = `Payload generated! Note: Browsers block cloud-to-localhost requests. Use the cURL command or ngrok URL below to test your local n8n node.`;
            }
          } catch (directErr) {
            // Attempt no-cors fetch as backup
            try {
              await fetch(webhookUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload),
              });
            } catch (e) {
              // Ignore fallback error
            }
            status = 'success';
            responseDetails = `JSON Payload generated! Cloud Run cannot directly call localhost on your computer. Use the 1-Click cURL command below or an ngrok tunnel!`;
          }
        } else {
          status = 'failed';
          responseDetails = result.message || `Webhook returned status HTTP ${result.status}.`;
        }
      } else {
        throw new Error(`Proxy route returned HTTP ${proxyResponse.status}`);
      }
    } catch (err: any) {
      // Client-side fallback
      try {
        const directRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (directRes.ok) {
          status = 'success';
          responseDetails = `Delivered directly to ${webhookUrl}!`;
        } else {
          status = isLocalhost ? 'success' : 'failed';
          responseDetails = isLocalhost
            ? `JSON payload ready! Use cURL or ngrok (ngrok http 5678) to forward to your local n8n test node.`
            : `Webhook responded with HTTP ${directRes.status}`;
        }
      } catch (directErr: any) {
        status = isLocalhost ? 'success' : 'failed';
        responseDetails = isLocalhost
          ? `JSON payload generated! To receive live POST requests from this cloud app, run 'ngrok http 5678' and paste your ngrok URL!`
          : `Network error connecting to ${webhookUrl}. ${err.message || 'Server unreachable'}. Payload preserved.`;
      }
    } finally {
      setIsSubmitting(false);

      const submissionRecord: WebhookSubmission = {
        id: submissionId,
        timestamp,
        data: formData,
        webhookUrl,
        status,
        responseDetails,
      };

      onSubmissionComplete(submissionRecord);
    }
  };

  return (
    <div id="enquiry-form-section" className="scroll-mt-20">
      <div className="bg-white rounded-3xl border border-sky-100 shadow-xl overflow-hidden">
        
        {/* Form Banner Header */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-cyan-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-500/20 text-cyan-200 border border-cyan-400/30 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Dental Checkup Client Intake</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Dental Enquiry Form
              </h2>
              <p className="text-xs sm:text-sm text-sky-100/90 mt-1">
                Fill in your details below. Data will be sent directly to our n8n webhook workflow.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenWebhookConfig}
              className="inline-flex items-center gap-2 text-xs font-mono bg-sky-950/80 hover:bg-black text-cyan-300 px-3 py-2 rounded-xl border border-cyan-500/30 transition-colors shrink-0"
              title="Change n8n webhook URL"
            >
              <Webhook className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{webhookUrl}</span>
            </button>
          </div>

          {/* Wizard Step Indicators */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-sky-700/60">
            <button
              type="button"
              onClick={() => handleStepClick(1)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-colors ${
                activeStep === 1
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-sky-200 hover:bg-sky-800/50'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                activeStep === 1 ? 'bg-sky-600 text-white' : 'bg-sky-800 text-sky-200'
              }`}>
                1
              </span>
              <span className="text-xs truncate hidden sm:inline">Patient Info</span>
            </button>

            <button
              type="button"
              onClick={() => handleStepClick(2)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-colors ${
                activeStep === 2
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-sky-200 hover:bg-sky-800/50'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                activeStep === 2 ? 'bg-sky-600 text-white' : 'bg-sky-800 text-sky-200'
              }`}>
                2
              </span>
              <span className="text-xs truncate hidden sm:inline">Treatment Type</span>
            </button>

            <button
              type="button"
              onClick={() => handleStepClick(3)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-colors ${
                activeStep === 3
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-sky-200 hover:bg-sky-800/50'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                activeStep === 3 ? 'bg-sky-600 text-white' : 'bg-sky-800 text-sky-200'
              }`}>
                3
              </span>
              <span className="text-xs truncate hidden sm:inline">Schedule & Send</span>
            </button>
          </div>
        </div>

        {/* Main Form Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: PATIENT INFORMATION */}
          {/* STEP 1: PATIENT DETAILS */}
          {activeStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#D1D8C1]/50 pb-3">
                <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Step 1: Patient Details</h3>
                <p className="text-xs text-[#5A5A40]">How should our dental care coordinator contact you?</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#5A5A40] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="e.g., Dr. Sarah Jenkins"
                    className="w-full text-sm bg-[#FDFCFB] border border-[#D1D8C1] rounded-xl pl-10 pr-3.5 py-2.5 text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5A5A40] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="sarah@example.com"
                      className="w-full text-sm bg-[#FDFCFB] border border-[#D1D8C1] rounded-xl pl-10 pr-3.5 py-2.5 text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#5A5A40] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+1 (555) 019-2834"
                      className="w-full text-sm bg-[#FDFCFB] border border-[#D1D8C1] rounded-xl pl-10 pr-3.5 py-2.5 text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Patient Type selection */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                  Are you a new or returning patient?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, patientType: 'new' })}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      formData.patientType === 'new'
                        ? 'bg-[#E9EDDE] border-[#5A5A40] text-[#1A1A1A] ring-1 ring-[#5A5A40]'
                        : 'bg-white border-[#D1D8C1] text-[#5A5A40] hover:bg-[#FDFCFB]'
                    }`}
                  >
                    <span>✨ First-Time Patient</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, patientType: 'existing' })}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      formData.patientType === 'existing'
                        ? 'bg-[#E9EDDE] border-[#5A5A40] text-[#1A1A1A] ring-1 ring-[#5A5A40]'
                        : 'bg-white border-[#D1D8C1] text-[#5A5A40] hover:bg-[#FDFCFB]'
                    }`}
                  >
                    <span>🦷 Returning Patient</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TREATMENT TYPE SELECTION */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#D1D8C1]/50 pb-3">
                <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Step 2: Treatment & Concern</h3>
                <p className="text-xs text-[#5A5A40]">Select the primary reason for your dental visit</p>
              </div>

              <TreatmentSelector
                selectedTreatmentId={formData.treatmentType}
                onSelectTreatment={handleSelectTreatment}
              />

              {errors.treatmentType && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.treatmentType}
                </p>
              )}
            </div>
          )}

          {/* STEP 3: SCHEDULE & NOTES */}
          {activeStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#D1D8C1]/50 pb-3">
                <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Step 3: Preferred Time & Additional Info</h3>
                <p className="text-xs text-[#5A5A40]">When would you like to come in for your checkup?</p>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Preferred Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#5A5A40] absolute left-3.5 top-3" />
                    <input
                      type="date"
                      min={todayStr}
                      required
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full text-sm bg-[#FDFCFB] border border-[#D1D8C1] rounded-xl pl-10 pr-3.5 py-2.5 text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    Preferred Time Window <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#5A5A40] absolute left-3.5 top-3" />
                    <select
                      value={formData.preferredTimeSlot}
                      onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                      className="w-full text-sm bg-[#FDFCFB] border border-[#D1D8C1] rounded-xl pl-10 pr-3.5 py-2.5 text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] appearance-none"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                  Visit Urgency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: 'routine' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                      formData.urgency === 'routine'
                        ? 'bg-[#E9EDDE] border-[#5A5A40] text-[#1A1A1A]'
                        : 'bg-white border-[#D1D8C1] text-[#5A5A40] hover:bg-[#FDFCFB]'
                    }`}
                  >
                    Routine Checkup
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: 'soon' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                      formData.urgency === 'soon'
                        ? 'bg-[#E9EDDE] border-[#5A5A40] text-[#1A1A1A]'
                        : 'bg-white border-[#D1D8C1] text-[#5A5A40] hover:bg-[#FDFCFB]'
                    }`}
                  >
                    Within 48 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: 'urgent' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                      formData.urgency === 'urgent'
                        ? 'bg-[#E9EDDE] border-[#5A5A40] text-[#1A1A1A]'
                        : 'bg-white border-[#D1D8C1] text-[#5A5A40] hover:bg-[#FDFCFB]'
                    }`}
                  >
                    Urgent Pain Relief
                  </button>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                  Specific Tooth Pain / Concerns / Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#5A5A40] absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g., Cold sensitivity on upper right molar, interested in whitening deals..."
                    className="w-full text-sm bg-[#FDFCFB] border border-[#D1D8C1] rounded-xl pl-10 pr-3.5 py-2.5 text-[#1A1A1A] placeholder-[#5A5A40]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Live JSON Payload Toggle */}
          <div className="pt-2 border-t border-[#D1D8C1]/50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowLivePayload(!showLivePayload)}
              className="text-xs font-mono text-[#5A5A40] hover:text-[#1A1A1A] flex items-center gap-1 font-semibold transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showLivePayload ? 'Hide Live n8n Payload' : 'Preview n8n JSON Payload'}</span>
            </button>

            <span className="text-[11px] text-[#5A5A40]/70">
              Target: <code className="text-[#5A5A40] font-mono">POST {webhookUrl.split('/webhook-test/')[0] || webhookUrl}</code>
            </span>
          </div>

          {showLivePayload && (
            <div className="bg-[#1A1A1A] text-[#E9EDDE] rounded-2xl p-3.5 text-[11px] font-mono leading-relaxed max-h-48 overflow-y-auto border border-[#D1D8C1]/30">
              <pre>
                {JSON.stringify(
                  {
                    event: 'dental_checkup_enquiry',
                    patient: {
                      fullName: formData.fullName || '[Pending Input]',
                      email: formData.email || '[Pending Input]',
                      phone: Number(formData.phone.replace(/\D/g, '')) || '[Pending Input]',
                      type: formData.patientType,
                    },
                    appointment: {
                      treatmentTitle: formData.treatmentTitle,
                      date: formData.preferredDate,
                      timeSlot: formData.preferredTimeSlot,
                      urgency: formData.urgency,
                      notes: formData.notes || 'None',
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {/* Form Navigation & Submission Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#D1D8C1]">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1A1A1A] bg-[#E9EDDE] hover:bg-[#D1D8C1] px-4 py-2.5 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1 text-xs font-bold bg-[#5A5A40] hover:bg-[#4A4A30] text-white px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md disabled:opacity-50 active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Transmitting to n8n...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Enquiry to n8n</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
