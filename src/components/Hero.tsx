import React from 'react';
import { Calendar, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-sky-50/30 pt-8 sm:pt-12 pb-12 border-b border-sky-100/80">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-sky-200/30 via-cyan-100/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Headline & Pitch */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-sky-100/80 border border-sky-200/80 text-sky-800 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Instant Online Enquiry System • Powered by n8n</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Schedule Your Dental Checkup with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-600">Total Comfort</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Get an instant dental checkup assessment. Fill out our simple 1-minute enquiry form to request your preferred appointment time, select treatment preferences, and route directly to our care team via n8n.
            </p>

            {/* Value bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-700 font-medium max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-white/80 border border-sky-100 p-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Pain-Free & Gentle Dentistry</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 border border-sky-100 p-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Instant n8n Webhook Sync</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 border border-sky-100 p-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Experienced Specialist Dentists</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 border border-sky-100 p-2.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Flexible Morning & Evening Slots</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onScrollToForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-base px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-sky-600/30 hover:shadow-sky-600/40 active:scale-98"
              >
                <Calendar className="w-5 h-5" />
                <span>Start Enquiry Form</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="text-xs text-slate-500 flex items-center gap-1.5 px-2 py-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>No payment required for enquiry</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Card Preview */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-bl-full -z-0 opacity-50" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                      🦷
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Quick Checkup Enquiry</h3>
                      <p className="text-xs text-slate-500">Live Client Intake</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded-md border border-sky-200">
                    4 Questions
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">1. Patient Info</span>
                    <span className="font-semibold text-slate-700">Name, Email & Phone</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">2. Treatment Type</span>
                    <span className="font-semibold text-sky-700">Cleaning, Whitening, Braces...</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">3. Appointment</span>
                    <span className="font-semibold text-slate-700">Date & Preferred Time</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200/80 flex justify-between items-center text-sky-900 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
                      4. n8n Destination
                    </span>
                    <span className="font-mono text-[11px] truncate max-w-[130px] text-sky-700">
                      http://localhost:5678/...
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-slate-400">
                    Submissions trigger real-time HTTP POST requests directly to n8n.
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
