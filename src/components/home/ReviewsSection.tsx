import React from 'react';
import { Star, MessageSquarePlus, CheckCircle2, User } from 'lucide-react';
import { Review } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface ReviewsSectionProps {
  reviews: Review[];
  onOpenSubmitReview: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onOpenSubmitReview }) => {
  // Only display verified/approved reviews as mandated
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
              Verified Feedback
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] mt-1">
              Customer Experiences
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Authentic reviews submitted by travelers who have completed their holidays with Co Wonder. All reviews are verified prior to publication.
            </p>
          </div>

          <button
            onClick={onOpenSubmitReview}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[#0A192F] bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer shadow-xs self-start md:self-end"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-600" />
            <span>Submit Your Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        {approvedReviews.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
            No customer reviews currently published. If you have recently traveled with Co Wonder, please submit your feedback!
          </div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approvedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {rev.rating}.0
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-slate-700 leading-relaxed italic mb-4 line-clamp-5">
                    "{rev.review}"
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0A192F]">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0A192F] flex items-center gap-1">
                        <span>{rev.customerName}</span>
                        <span title="Verified Traveler" className="inline-flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {rev.packageTitle}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{rev.date}</p>
                    </div>
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
