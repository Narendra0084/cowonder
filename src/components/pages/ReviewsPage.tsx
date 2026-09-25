import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, User, Filter } from 'lucide-react';
import { Review } from '../../types';
import { useAgency } from '../../context/AgencyContext';

interface ReviewsPageProps {
  reviews: Review[];
  onOpenSubmitReview: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ reviews, onOpenSubmitReview }) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const filtered = filterRating === 'all'
    ? approvedReviews
    : approvedReviews.filter((r) => r.rating === filterRating);

  const avgRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-600">
              Verified Traveler Experiences
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0A192F] mt-1">
              What Our Travelers Say
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Authentic reviews from families, couples, and adventurers who planned and completed their trips with An Wonder Co.
            </p>
          </div>

          <button
            onClick={onOpenSubmitReview}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-semibold text-white bg-[#0A192F] hover:bg-[#132A4A] transition shadow-xs cursor-pointer self-start md:self-end"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
            <span>Submit Your Review</span>
          </button>
        </div>

        {/* Rating Summary Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div>
              <span className="text-4xl sm:text-5xl font-bold text-[#0A192F] font-display">
                {avgRating}
              </span>
              <span className="text-xs text-slate-400 block mt-1">out of 5.0</span>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600">
                Based on <strong>{approvedReviews.length}</strong> verified customer reviews
              </p>
            </div>
          </div>

          {/* Filter by star rating */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold mr-1">Filter:</span>
            <button
              onClick={() => setFilterRating('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition ${
                filterRating === 'all'
                  ? 'bg-[#0A192F] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({approvedReviews.length})
            </button>
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition flex items-center gap-1 ${
                  filterRating === star
                    ? 'bg-[#0A192F] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{star} Stars</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
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
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
