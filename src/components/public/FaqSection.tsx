import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { FaqItem } from '../../types/database';
import { DB } from '../../lib/supabase';

interface FaqSectionProps {
  onOpenBooking: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenBooking }) => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    DB.getFaqs(true).then((list) => {
      setFaqs(list.sort((a, b) => a.display_order - b.display_order));
    });
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section id="faqs" className="py-24 bg-[#080808] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D91B24] font-semibold">
            Everything You Need To Know
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto">
            Answers to common questions regarding our reservation process, equipment, and heirloom delivery.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="bg-[#0D0D0D] border border-white/10 rounded-lg overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-medium text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D91B24] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center p-6 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white">Have a specific question about your date?</h4>
            <p className="text-xs text-neutral-400">Our studio team is here to assist you with custom requirements.</p>
          </div>
          <button
            onClick={onOpenBooking}
            className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded transition-colors cursor-pointer shrink-0"
          >
            Ask Saikat Directly
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
