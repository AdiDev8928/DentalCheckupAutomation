import React, { useState } from 'react';
import { CLINIC_INFO, FAQ_ITEMS, TESTIMONIALS } from '../data/dentalData';
import {
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  Stethoscope,
  Heart
} from 'lucide-react';

export const ClinicFeatures: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-16 py-12">
      
      {/* SECTION 1: WHY CHOOSE LUMINA DENTAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-[#E9EDDE] px-3 py-1 rounded-full border border-[#D1D8C1]">
            Patient-Centric Care
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Modern & Painless Dental Experience
          </h2>
          <p className="text-sm text-[#5A5A40]">
            Designed for maximum comfort, accuracy, and seamless client intake.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#D1D8C1] shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#E9EDDE] text-[#5A5A40] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Zero Pain Guarantee</h3>
            <p className="text-xs text-[#5A5A40] leading-relaxed">
              We employ gentle numbing techniques and modern laser technologies to ensure stress-free visits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D1D8C1] shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#E9EDDE] text-[#5A5A40] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Digital Diagnostics</h3>
            <p className="text-xs text-[#5A5A40] leading-relaxed">
              Low-radiation 3D intraoral imaging and instant digital smile simulations during checkups.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D1D8C1] shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#E9EDDE] text-[#5A5A40] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Instant n8n Automation</h3>
            <p className="text-xs text-[#5A5A40] leading-relaxed">
              Your appointment request is transmitted instantly to our front-desk system in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: TESTIMONIALS */}
      <section className="bg-[#E9EDDE]/30 py-12 border-y border-[#D1D8C1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Patient Experiences</h2>
            <p className="text-xs text-[#5A5A40]">Read what our clients say about our checkups and service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white p-5 rounded-2xl border border-[#D1D8C1] shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[#5A5A40]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#5A5A40]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#1A1A1A] italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D1D8C1]/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#1A1A1A] block">{t.name}</span>
                    <span className="text-[10px] text-[#5A5A40] font-medium">{t.treatment}</span>
                  </div>
                  <span className="text-[10px] text-[#5A5A40]/70">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Frequently Asked Questions</h2>
          <p className="text-xs text-[#5A5A40]">Everything you need to know about your enquiry & appointment</p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#D1D8C1] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4.5 flex items-center justify-between font-semibold text-[#1A1A1A] text-sm hover:bg-[#FDFCFB] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#5A5A40]"></span>
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#5A5A40] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5A5A40]/50 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4.5 pt-0 text-xs text-[#5A5A40] leading-relaxed border-t border-[#D1D8C1]/40 bg-[#FDFCFB]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: CLINIC CONTACT & LOCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#D1D8C1]/20">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-[#E9EDDE] uppercase tracking-widest bg-[#5A5A40]/40 px-3 py-1 rounded-full border border-[#D1D8C1]/30">
              Visit Lumina Dental
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Ready for a Brighter, Healthier Smile?
            </h2>
            <p className="text-xs sm:text-sm text-[#E9EDDE]/80 leading-relaxed max-w-xl">
              Our team of dedicated dental specialists is standing by to confirm your appointment and provide gentle, world-class oral care.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#E9EDDE]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E9EDDE] shrink-0 mt-0.5" />
                <span>{CLINIC_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E9EDDE] shrink-0" />
                <span>{CLINIC_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E9EDDE] shrink-0" />
                <span>{CLINIC_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E9EDDE] shrink-0" />
                <span>{CLINIC_INFO.hours}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#5A5A40]/30 p-5 rounded-2xl border border-[#D1D8C1]/30 text-xs space-y-3">
            <h4 className="font-serif font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E9EDDE]" />
              Emergency Care Hotline
            </h4>
            <p className="text-[#E9EDDE]/80">
              Facing acute dental pain or chipped teeth? Select "Emergency Dental Visit" in the form above or call directly.
            </p>
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="inline-flex items-center gap-2 bg-[#E9EDDE] hover:bg-white text-[#1A1A1A] font-bold px-4 py-2 rounded-xl transition-colors text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Hotline Now</span>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};
