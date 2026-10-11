import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
  brandName?: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, brandName = 'Saikat Photography' }) => {
  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0D0D0D] border border-white/10 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col justify-between shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {type === 'privacy' ? (
              <Shield className="w-5 h-5 text-[#D91B24]" />
            ) : (
              <FileText className="w-5 h-5 text-[#D91B24]" />
            )}
            <h3 className="text-xl font-serif-display text-white font-medium">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms & Booking Conditions'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                At <strong className="text-white">{brandName}</strong>, we are committed to respecting and protecting the privacy of our clients and site visitors.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">1. Information We Collect</h4>
              <p>
                When you submit a booking or consultation inquiry, we collect your name, email, phone number, event dates, and personal celebration preferences solely to respond with accurate proposals and schedule photography sessions.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">2. Client Gallery Protection</h4>
              <p>
                All private client galleries delivered post-celebration are password-protected or hosted on private links. We will never sell, lease, or distribute your private contact details or raw footage to third parties.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">3. Image Rights & Portfolio Usage</h4>
              <p>
                As an artistic studio, {brandName} reserves the right to display selected artistic photographs in our portfolio, competitions, and exhibitions unless mutually agreed upon in writing through a non-disclosure agreement prior to the booking date.
              </p>
            </>
          ) : (
            <>
              <p>
                By commissioning <strong className="text-white">{brandName}</strong> for photography or cinematography services, you agree to the standard studio terms outlined below:
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">1. Retainer & Date Reservation</h4>
              <p>
                A date is officially locked in our studio calendar only upon receipt of the agreed initial booking advance and signed commission agreement. Inquiries without an advance deposit remain open to other couples.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">2. Deliverables & Turnaround</h4>
              <p>
                Sneak-peek previews are typically provided within 48 to 72 hours of your celebration. Final high-resolution color-graded galleries and master photobooks are delivered within the timeframe specified in your chosen package.
              </p>
              <h4 className="text-sm font-semibold text-white pt-2">3. Artistic Discretion</h4>
              <p>
                {brandName} captures and color-grades every photograph in our proprietary artistic and cinematic visual style as exhibited on this website.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#050505] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
