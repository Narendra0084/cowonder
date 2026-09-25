import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Clock, 
  Users, 
  Award, 
  Headphones, 
  FileCheck2, 
  Percent, 
  Sparkles,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Activity,
  Calculator,
  Building2,
  Check
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';

interface MetricData {
  label: string;
  value: string;
  subtext: string;
  badge: string;
  color: string;
}

const STAT_METRICS: MetricData[] = [
  {
    label: 'Verified Trips Completed',
    value: '4,850+',
    subtext: 'Across domestic & global hubs',
    badge: '100% Audit Pass',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    label: 'Guest Satisfaction',
    value: '99.4%',
    subtext: 'Real verified reviews logged',
    badge: 'Top Tier',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    label: 'Hidden Fees or Surcharges',
    value: '₹0',
    subtext: 'Itemized written transparency',
    badge: 'Guaranteed',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    label: 'Direct Concierge Response',
    value: '< 12m',
    subtext: 'Dedicated human manager',
    badge: '24/7 Live Line',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
];

interface ComparisonRow {
  feature: string;
  cowonder: string;
  cowonderPass: boolean;
  others: string;
  othersPass: boolean;
  category: 'all' | 'pricing' | 'stays' | 'support';
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: 'Upfront Itemized Inclusions & Tax Details',
    cowonder: 'Full itemized list with GST & TCS breakdown before token payment',
    cowonderPass: true,
    others: 'Vague summaries, hidden driver night allowances & local checkpoint surprises',
    othersPass: false,
    category: 'pricing',
  },
  {
    feature: 'Pre-inspected 4-Star Accommodations',
    cowonder: 'Verified properties, clean linen guarantee & guaranteed hotel names before booking',
    cowonderPass: true,
    others: '“Or similar” fallback to inferior budget guest houses on arrival',
    othersPass: false,
    category: 'stays',
  },
  {
    feature: 'Dedicated Human Trip Concierge',
    cowonder: 'Direct coordinator with personal WhatsApp & direct phone assigned to your booking',
    cowonderPass: true,
    others: 'Call center bots, endless IVR queues, and outsourced ticketing lines',
    othersPass: false,
    category: 'support',
  },
  {
    feature: 'Private Dedicated Chauffeur & Vehicle',
    cowonder: 'Dedicated private AC sedan/SUV with vetted, courteous mountain/highway drivers',
    cowonderPass: true,
    others: 'Shared tempo travelers or fluctuating daily ride app pickups',
    othersPass: false,
    category: 'stays',
  },
  {
    feature: 'No-Penalty Date Alterations Guarantee',
    cowonder: 'Free date shift guidance with hotel supplier coordination up to 7 days prior',
    cowonderPass: true,
    others: 'Immediate 100% forfeiture or hefty non-negotiable cancellation fines',
    othersPass: false,
    category: 'pricing',
  },
];

export const WhyChooseUs: React.FC = () => {
  const { openPlanTripPopup, getWhatsAppUrl, config } = useAgency();
  const [activeTab, setActiveTab] = useState<'matrix' | 'calculator' | 'live'>('matrix');
  const [comparisonFilter, setComparisonFilter] = useState<'all' | 'pricing' | 'stays' | 'support'>('all');
  
  // Interactive Cost Breakdown state
  const [budgetInput, setBudgetInput] = useState<number>(35000);

  const filteredComparison = COMPARISON_DATA.filter(
    (item) => comparisonFilter === 'all' || item.category === comparisonFilter
  );

  return (
    <section className="py-14 sm:py-18 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span>Agency Data & Performance Metrics</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              Why Choose An Wonder Co
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Factual benchmarks, verified operational performance, and full working guarantees.
            </p>
          </div>

          {/* Interactive Working Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl self-start md:self-end text-xs font-bold">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white text-[#0A192F] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard Audit
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-white text-[#0A192F] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cost Transparency
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'live'
                  ? 'bg-white text-[#0A192F] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Concierge Desk
            </button>
          </div>
        </div>

        {/* Small Data Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {STAT_METRICS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${stat.color}`}>
                  {stat.badge}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-0.5 truncate">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Working Functionality View 1: Standard Audit Matrix */}
        {activeTab === 'matrix' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
            {/* Filter Sub-bar */}
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Filter Standard:</span>
                {(['all', 'pricing', 'stays', 'support'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setComparisonFilter(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                      comparisonFilter === cat
                        ? 'bg-[#0A192F] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Criteria' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>An Wonder Co 100% Compliance Level</span>
              </div>
            </div>

            {/* Compact Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5 w-1/3">Travel Criteria</th>
                    <th className="py-3 px-5 w-1/3 bg-amber-50/50 text-[#0A192F]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>An Wonder Co Standard</span>
                      </div>
                    </th>
                    <th className="py-3 px-5 w-1/3 text-slate-400">Ordinary Portals / Brokers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredComparison.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        {row.feature}
                      </td>
                      <td className="py-3.5 px-5 bg-amber-50/30 font-medium text-slate-900">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{row.cowonder}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{row.others}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-600 font-medium">
                Want a personalized itinerary customized to your specific family preferences?
              </span>
              <button
                onClick={() => openPlanTripPopup()}
                className="px-4 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Working Functionality View 2: Interactive Cost Transparency Breakdown */}
        {activeTab === 'calculator' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm animate-in fade-in-50 duration-200">
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0A192F]">
                    Where Does Your Travel Investment Go?
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Test our transparent fund distribution model with any tour package budget.
                  </p>
                </div>

                {/* Quick Budget Preset Buttons */}
                <div className="flex items-center gap-1.5">
                  {[20000, 35000, 50000, 75000].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudgetInput(b)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                        budgetInput === b 
                          ? 'bg-[#0A192F] text-amber-400' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₹{(b / 1000)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for interactive testing */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Selected Package Budget:</span>
                  <span className="text-base text-[#0A192F] font-black">₹{budgetInput.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={120000}
                  step={5000}
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Breakdown Distribution Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
                
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">55% Accommodations</div>
                  <div className="text-lg font-black text-emerald-950 mt-1">
                    ₹{Math.round(budgetInput * 0.55).toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-1 leading-tight">
                    Verified 4-star stays, daily buffet breakfasts & taxes.
                  </p>
                </div>

                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200/80">
                  <div className="text-[10px] uppercase font-bold text-blue-700">25% Dedicated Cab</div>
                  <div className="text-lg font-black text-blue-950 mt-1">
                    ₹{Math.round(budgetInput * 0.25).toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-blue-800 mt-1 leading-tight">
                    Private AC car, toll permits, parking & vetted driver.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/80">
                  <div className="text-[10px] uppercase font-bold text-amber-700">12% Sightseeing & Entry</div>
                  <div className="text-lg font-black text-amber-950 mt-1">
                    ₹{Math.round(budgetInput * 0.12).toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 leading-tight">
                    Cruises, Shikaras, Gondola permits & monument entries.
                  </p>
                </div>

                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200/80">
                  <div className="text-[10px] uppercase font-bold text-purple-700">8% 24/7 Concierge</div>
                  <div className="text-lg font-black text-purple-950 mt-1">
                    ₹{Math.round(budgetInput * 0.08).toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-purple-800 mt-1 leading-tight">
                    Dedicated human coordinator & emergency on-ground line.
                  </p>
                </div>

              </div>

              {/* Zero Hidden Cost Guarantee Stamp */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-300/50 flex items-center justify-between text-xs text-amber-900">
                <span className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Every quote includes a written 100% itemized guarantee against mid-trip price hikes.
                </span>
                <span className="font-black text-amber-800">ZERO HIDDEN CHARGES</span>
              </div>

            </div>
          </div>
        )}

        {/* Working Functionality View 3: Live Concierge Desk */}
        {activeTab === 'live' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm animate-in fade-in-50 duration-200">
            <div className="max-w-2xl mx-auto space-y-5 text-center">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Concierge Desk Live & Active Now</span>
              </div>

              <h3 className="font-display text-xl font-bold text-[#0A192F]">
                Direct Human Assistance • No Chatbots, No Queues
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                When you plan or travel with An Wonder Co, your dedicated trip coordinator is reachable directly on WhatsApp and phone. Test our response now with a quick pre-trip consultation message.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2 text-left">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Response Speed</div>
                  <div className="text-base font-bold text-[#0A192F] mt-0.5">Average 8-12 Minutes</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Mon – Sat (9:30 AM – 7:30 PM)</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Emergency On-Trip Line</div>
                  <div className="text-base font-bold text-[#0A192F] mt-0.5">24/7 Priority Channel</div>
                  <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Immediate Flight/Hotel escalation</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <a
                  href={getWhatsAppUrl(`Hello An Wonder Co Concierge, I would like to verify the live assistance response time and enquire about travel packages.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Test Direct Concierge on WhatsApp</span>
                </a>

                <button
                  onClick={() => openPlanTripPopup()}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0A192F] hover:bg-[#132A4A] transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Open Inquiry Form</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
