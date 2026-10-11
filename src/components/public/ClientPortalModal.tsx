import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  X,
  ExternalLink,
  Download,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { ClientGallery } from '../../types/database';
import { DB } from '../../lib/supabase';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [matchedGallery, setMatchedGallery] = useState<ClientGallery | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const galleries = await DB.getClientGalleries();
      const found = galleries.find(
        (g) => g.access_pin.trim() === pin.trim() && g.is_active
      );

      if (found) {
        setMatchedGallery(found);
      } else {
        setErrorMsg('Invalid Access PIN or gallery expired. Please check your delivery message or contact studio.');
      }
    } catch (err) {
      setErrorMsg('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101010] border border-white/15 rounded-xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#D91B24]" />
            <h3 className="text-base font-serif-display font-medium text-white">
              Private Client Proofing Portal
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!matchedGallery ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-xs text-neutral-400 leading-relaxed">
              Welcome to the private client suite. Please enter the secure 4-digit access PIN provided in your gallery delivery message to access your high-resolution heirloom collection.
            </p>

            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500/30 rounded flex items-center gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5 text-center">
                Enter Your Private 4-Digit Access PIN
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="• • • •"
                className="w-full bg-[#181818] border border-white/15 rounded px-4 py-3 text-center text-xl text-white font-mono font-bold tracking-[0.5em] focus:outline-none focus:border-[#D91B24]"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || !pin}
              className="w-full bg-[#D91B24] hover:bg-[#b5141c] disabled:opacity-50 text-white text-xs uppercase tracking-widest font-semibold py-3 rounded transition-colors cursor-pointer"
            >
              {isVerifying ? 'Verifying PIN...' : 'Access My Collection'}
            </button>

            <p className="text-[11px] text-center text-neutral-500">
              Need assistance? WhatsApp studio hotline at <span className="text-white">+91 98765 43210</span>
            </p>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="aspect-video relative rounded-lg overflow-hidden border border-white/10">
              <img
                src={matchedGallery.cover_image}
                alt={matchedGallery.event_title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <div className="text-left">
                  <h4 className="text-base font-semibold text-white">{matchedGallery.client_name}</h4>
                  <p className="text-xs text-neutral-300">{matchedGallery.event_title}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] p-3 rounded border border-white/5 flex items-center justify-around text-xs text-neutral-300">
              <span>Date: {matchedGallery.event_date}</span>
              <span>•</span>
              <span>{matchedGallery.images_count} Curated Frames</span>
            </div>

            <div className="space-y-2 pt-2">
              {matchedGallery.external_album_url ? (
                <a
                  href={matchedGallery.external_album_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-wider font-semibold py-3 rounded flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Full 4K Cloud Album</span>
                </a>
              ) : (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs text-emerald-300 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Access Granted: Curated high-resolution proofing active.</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setMatchedGallery(null);
                  setPin('');
                }}
                className="w-full bg-white/5 hover:bg-white/10 text-neutral-300 text-xs py-2 rounded cursor-pointer"
              >
                Log Out / Enter Another PIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPortalModal;
