import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Service } from '../../types/database';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  const activeServices = services
    .filter((s) => s.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#0D0D0D] relative border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#D91B24]" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-400">
              Bespoke Disciplines
            </span>
            <span className="w-6 h-[2px] bg-[#D91B24]" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-display font-light text-white tracking-tight">
            Our Photography Services
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            From regal multi-day wedding celebrations to private high-fashion portraits, we bring deliberate lighting, candid sensitivity, and timeless grading to every commission.
          </p>
        </div>

        {/* Services Grid */}
        {activeServices.length === 0 ? (
          <div className="text-center py-16 px-6 bg-[#050505] rounded-xl border border-white/5 max-w-xl mx-auto space-y-4">
            <p className="text-sm font-medium text-neutral-200">Bespoke Commissions & Coverage</p>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              We offer personalized coverage for luxury weddings, pre-wedding sessions, fashion editorials, and destination ceremonies. Contact us directly to tailor your coverage.
            </p>
            <button
              onClick={() => onSelectService('Bespoke Photography Service')}
              className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-[0.2em] font-semibold px-6 py-3 rounded transition-all cursor-pointer shadow-md"
            >
              Inquire For Custom Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {activeServices.map((service, idx) => (
              <div
                key={service.id}
                className="bg-[#050505] rounded-lg border border-white/10 overflow-hidden shadow-xl hover:border-white/25 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Service Visual Banner */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                  
                  {/* Starting Price Overlay */}
                  <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-300 font-medium">
                      0{idx + 1}. Discipline
                    </span>
                    <span className="text-sm font-display-modern font-semibold text-white bg-black/75 px-3 py-1 rounded backdrop-blur-md border border-white/10">
                      {service.starting_price}
                    </span>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-serif-display text-white font-medium">
                      {service.title}
                    </h3>
                    <p className="text-sm text-neutral-400 font-light leading-relaxed">
                      {service.short_description}
                    </p>
                  </div>

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2.5 pt-4 border-t border-white/10">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-[#D91B24] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Book CTA */}
                  <div className="pt-4">
                    <button
                      onClick={() => onSelectService(service.title)}
                      className="w-full bg-white/5 hover:bg-[#D91B24] text-neutral-200 hover:text-white border border-white/10 hover:border-transparent text-xs uppercase tracking-[0.2em] font-semibold py-3 rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-[0_0_20px_rgba(217,27,36,0.3)]"
                    >
                      <span>{service.cta_text || 'Inquire For This Service'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
