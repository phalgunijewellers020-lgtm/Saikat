import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../../types/database';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const publishedList = testimonials
    .filter((t) => t.is_published)
    .sort((a, b) => a.display_order - b.display_order);

  if (publishedList.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-[#0D0D0D] relative border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#D91B24]" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-400">
              Client Love
            </span>
            <span className="w-6 h-[2px] bg-[#D91B24]" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-display font-light text-white tracking-tight">
            Kind Words From Our Couples
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            The greatest honor of our craft is becoming a part of your family's most sacred moments and delivering memories that outlive time.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publishedList.map((test) => (
            <div
              key={test.id}
              className="bg-[#050505] p-8 rounded-lg border border-white/10 flex flex-col justify-between relative shadow-xl hover:border-white/20 transition-all duration-300 group"
            >
              <Quote className="w-8 h-8 text-[#D91B24]/40 absolute top-6 right-6" />

              <div className="space-y-4">
                {/* Star Rating */}
                <div className="flex items-center gap-1 text-[#D91B24]">
                  {Array.from({ length: test.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-neutral-300 text-sm sm:text-base font-light italic leading-relaxed pt-2">
                  "{test.review_text}"
                </p>
              </div>

              {/* Client Info Bar */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-4">
                {test.client_image ? (
                  <img
                    src={test.client_image}
                    alt={test.client_name}
                    className="w-12 h-12 rounded-full object-cover border border-[#D91B24]/40"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-white font-serif-display font-bold text-lg">
                    {test.client_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {test.client_name}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {test.event_type}
                  </p>
                  {test.event_date && (
                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                      {test.event_date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
