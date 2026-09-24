import React, { useState } from 'react';
import { X, Star, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import { submitReview } from '../../services/dbService';

export const SubmitReviewModal: React.FC = () => {
  const { 
    isReviewModalOpen, 
    closeReviewModal, 
    reviewPrefill, 
    addToast 
  } = useAgency();

  const [customerName, setCustomerName] = useState('');
  const [packageTitle, setPackageTitle] = useState(reviewPrefill?.packageTitle || '');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [bookingId, setBookingId] = useState(reviewPrefill?.bookingId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isReviewModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      addToast('Please provide your name', 'error');
      return;
    }
    if (!reviewText.trim()) {
      addToast('Please provide your review feedback', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        customerName: customerName.trim(),
        packageTitle: packageTitle.trim() || 'Custom Co Wonder Tour',
        rating,
        review: reviewText.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        bookingId: bookingId.trim() || undefined,
      });

      setIsSubmitted(true);
      addToast('Thank you! Your review has been submitted for verification.', 'success');
    } catch (e: any) {
      console.error(e);
      addToast('Could not submit review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    closeReviewModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0A192F] text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">
            {isSubmitted ? 'Feedback Received' : 'Share Your Travel Experience'}
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>
              <h4 className="text-xl font-bold text-[#0A192F]">Thank You For Your Feedback</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                To preserve authentic quality and prevent spam, customer reviews are checked against booking records before appearing on the website.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Star Rating Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-slate-700 text-sm">
                    {hoverRating || rating} out of 5
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul & Megha Verma"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                />
              </div>

              {/* Package or Destination */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Package / Destination Travelled
                </label>
                <input
                  type="text"
                  value={packageTitle}
                  onChange={(e) => setPackageTitle(e.target.value)}
                  placeholder="e.g. Kashmir Escape - 6 Days"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                />
              </div>

              {/* Optional Booking ID */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Booking Reference ID <span className="text-slate-400 font-normal">(Optional, helps expedite verification)</span>
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g. BK-2026-10294"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Review & Experience <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell other travelers about the hotels, cab service, on-ground driver, and overall experience..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A192F]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] disabled:opacity-75 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Review...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>Submit Review for Verification</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
