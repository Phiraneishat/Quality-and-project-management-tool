import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, HelpCircle, CreditCard, QrCode, Building, Smartphone, Copy, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';

interface PricingTier {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  desc: string;
  features: string[];
  isPopular?: boolean;
  color: string;
  btnVariant: 'primary' | 'outline';
}

const tiers: PricingTier[] = [
  {
    name: 'Starter (Free)',
    priceMonthly: 0,
    priceYearly: 0,
    desc: 'Perfect for small teams seeking core backlog and issue tracking tools. Free forever.',
    features: [
      'Up to 5 active members',
      'Basic sprint planning & boards',
      'Simple bug tracking system',
      'Standard email support assistance',
      'Single Repository integration',
    ],
    color: 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-surface-900/70',
    btnVariant: 'outline',
  },
  {
    name: 'Pro',
    priceMonthly: 59,
    priceYearly: 47,
    desc: 'Ideal for scaling engineering departments needing advanced QA reporting.',
    features: [
      'Unlimited active members',
      'Full Agile backlog & burn-down',
      'Code coverage & QA metric indexes',
      'Integrated test case suites runs',
      'Advanced Slack & Git integrations',
      'Priority Support (24h response)',
    ],
    isPopular: true,
    color: 'border-primary-500/50 dark:border-primary-500/30 bg-white dark:bg-surface-900 ring-2 ring-primary-500/10 shadow-primary-500/5',
    btnVariant: 'primary',
  },
  {
    name: 'Enterprise',
    priceMonthly: 149,
    priceYearly: 119,
    desc: 'Tailored for compliance-driven businesses requiring custom deployments.',
    features: [
      'Unlimited everything',
      'SSO & SAML authentication',
      'Dedicated support account manager',
      'Custom SLA uptime agreements',
      'SOC2 compliance reporting',
      'Automated defect leakage analytics',
    ],
    color: 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-surface-900/70',
    btnVariant: 'outline',
  },
];

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [checkoutPlan, setCheckoutPlan] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr' | 'bank'>('card');
  const [processing, setProcessing] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast.success(`Payment Approved! Welcome to the ${checkoutPlan.name} Plan.`);
      setCheckoutPlan(null);
      // Reset card form
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCardName('');
      navigate('/register');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-16 grid-bg mesh-gradient">
      {/* ── Title Hero Section ── */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] animate-orb-1" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-orb-2" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-wider mb-6 border border-primary-500/20"
          >
            <Info className="h-3.5 w-3.5" /> Pricing Options
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white leading-tight tracking-tight">
            Plans for Teams of <span className="text-gradient-primary">Every Size</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-705 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Choose a pricing model that scales with your deployment. Get started with a 14-day free trial on any plan. No credit card required.
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className={`text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))}
              className="w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800 p-1 relative flex items-center cursor-pointer transition-colors hover:bg-slate-350 dark:hover:bg-slate-700"
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-primary-500 shadow-md"
                animate={{ x: billingCycle === 'yearly' ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-semibold transition-colors ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'} flex items-center gap-1.5`}>
              Yearly
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Pricing Tiers Grid ── */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, i) => {
            const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-3xl border p-8 flex flex-col justify-between relative shadow-sm hover:shadow-xl hover:shadow-primary-500/2 transition-all ${tier.color}`}
              >
                {tier.isPopular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-violet-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-md tracking-widest border border-white/15">
                    Most Popular
                  </span>
                )}
                
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white">{tier.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-2 leading-relaxed">{tier.desc}</p>
                  
                  <div className="mt-6 flex items-baseline">
                    <span className="text-3xl font-bold text-slate-400">$</span>
                    <span className="text-5xl sm:text-6xl font-black font-display text-slate-900 dark:text-white leading-none tracking-tight">
                      {price}
                    </span>
                    <span className="text-slate-450 text-sm font-semibold ml-2">/ user / mo</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                    {billingCycle === 'yearly' ? `billed annually ($${price * 12}/yr)` : 'billed monthly'}
                  </p>

                  <div className="mt-8 space-y-4">
                    {tier.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className="p-0.5 bg-emerald-500/10 rounded text-emerald-500 shrink-0 mt-0.5">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-normal">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-850">
                  {tier.priceMonthly === 0 ? (
                    <Link to="/register" className="w-full block">
                      <button
                        className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 active:scale-[0.98]"
                      >
                        Get Started Free
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setCheckoutPlan({ ...tier, activePrice: price })}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-[0.98] ${
                        tier.btnVariant === 'primary'
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      Buy {tier.name} Plan
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Feature Comparison Matrix Section ── */}
      <section className="py-20 bg-slate-50 dark:bg-surface-900/50 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Detailed Feature Comparison
            </h2>
          </div>

          <div className="border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-surface-900 text-left text-xs sm:text-sm">
            <div className="grid grid-cols-4 bg-slate-100 dark:bg-surface-950 p-4 font-bold text-slate-700 dark:text-slate-350">
              <div>Features</div>
              <div className="text-center">Starter</div>
              <div className="text-center">Pro</div>
              <div className="text-center">Enterprise</div>
            </div>
            
            {[
              { name: 'Issue & Sprint Boards', starter: 'Basic', pro: 'Full', ent: 'Full' },
              { name: 'Custom Ticket Status workflows', starter: '✖', pro: '✓', ent: '✓' },
              { name: 'Test Case execution suites', starter: '✖', pro: '✓', ent: '✓' },
              { name: 'SSO & SAML integration', starter: '✖', pro: '✖', ent: '✓' },
              { name: 'API rate limits', starter: '1k/hr', pro: '10k/hr', ent: 'Custom' },
              { name: 'Uptime SLA warranty', starter: '✖', pro: '✖', ent: '99.99%' },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-4 p-4 border-t border-slate-150 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-surface-950/20 transition-colors">
                <div className="font-semibold text-slate-850 dark:text-slate-200">{row.name}</div>
                <div className="text-center text-slate-550 dark:text-slate-400">{row.starter}</div>
                <div className="text-center text-slate-550 dark:text-slate-400 font-bold">{row.pro}</div>
                <div className="text-center text-slate-550 dark:text-slate-400">{row.ent}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Checkout / Payment Modal ── */}
      <AnimatePresence>
        {checkoutPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutPlan(null)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-3xl bg-white dark:bg-surface-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row text-left text-slate-900 dark:text-white animate-fade-in"
            >
              {/* Close Button */}
              <button
                onClick={() => setCheckoutPlan(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-25 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Side: Order Summary */}
              <div className="flex-1 p-8 bg-slate-50 dark:bg-surface-950/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Checkout Plan</span>
                  <h3 className="text-2xl font-black font-display mt-1 text-slate-900 dark:text-white">
                    QualityDesk {checkoutPlan.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {checkoutPlan.desc}
                  </p>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-black font-display">
                      ${checkoutPlan.activePrice}
                    </span>
                    <span className="text-slate-450 text-sm font-semibold ml-2">/ user / mo</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5 font-mono">
                    {billingCycle === 'yearly' ? 'Billed Annually (14-Day Free Trial first)' : 'Billed Monthly (14-Day Free Trial first)'}
                  </span>

                  <div className="mt-6 space-y-3">
                    {checkoutPlan.features.slice(0, 4).map((feat: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-white dark:bg-surface-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-mono text-slate-500 leading-normal">
                  🔐 Secure 256-bit encrypted checkout gateway. Transactions are authenticated instantly.
                </div>
              </div>

              {/* Right Side: Payment Form */}
              <div className="flex-1 p-8 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white mb-4">
                    Select Payment Method
                  </h4>

                  {/* Payment Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[
                      { id: 'card', label: 'Card', icon: <CreditCard className="h-4 w-4" /> },
                      { id: 'qr', label: 'Scan QR', icon: <QrCode className="h-4 w-4" /> },
                      { id: 'bank', label: 'Bank', icon: <Building className="h-4 w-4" /> },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPaymentMethod(tab.id as any)}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                          paymentMethod === tab.id
                            ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Form Container */}
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 min-h-[190px]">
                    {paymentMethod === 'card' && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Card Number</label>
                            <div className="flex items-center gap-1.5 select-none">
                              {/* Visa */}
                              <div className="h-5 w-8 rounded bg-[#1A1F71] flex items-center justify-center text-[7px] font-black italic text-white tracking-tight px-0.5 select-none">
                                VISA
                              </div>
                              {/* Mastercard */}
                              <div className="h-5 w-8 rounded bg-[#111111] border border-slate-700/30 flex items-center justify-center gap-0.5 px-0.5 select-none">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#EB001B]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] -ml-1.5 opacity-90" />
                                <span className="text-[5px] font-bold text-white leading-none">MC</span>
                              </div>
                              {/* Amex */}
                              <div className="h-5 w-8 rounded bg-[#0070CD] flex items-center justify-center text-[6px] font-black text-white select-none">
                                AMEX
                              </div>
                            </div>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="💳  4111 2222 3333 4444"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Expiry Date</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CVV</label>
                            <input
                              type="password"
                              required
                              placeholder="•••"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'qr' && (
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl relative shadow-md flex items-center justify-center">
                          {/* Real Scannable QR Code Image */}
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0f172a&bgcolor=ffffff&data=${encodeURIComponent('upi://pay?pa=pay@qualitydesk.io&pn=QualityDesk&am=' + (checkoutPlan?.activePrice || '47.00') + '&cu=USD')}`}
                            alt="Scan to Pay QR Code"
                            className="w-32 h-32 select-none"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Scan using GPay, PhonePe, Paytm or any BHIM UPI app.
                        </div>
                        {/* UPI Brand Apps Badges Row */}
                        <div className="flex items-center justify-center gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/40 w-full max-w-[220px] select-none">
                          {/* GPay */}
                          <div className="h-5 px-1.5 rounded bg-white border border-slate-200 flex items-center justify-center text-[7px] font-extrabold select-none">
                            <span className="text-[#4285F4]">G</span>
                            <span className="text-[#EA4335]">P</span>
                            <span className="text-[#FBBC05]">a</span>
                            <span className="text-[#34A853]">y</span>
                          </div>
                          {/* PhonePe */}
                          <div className="h-5 px-1.5 rounded bg-[#5f259f] flex items-center justify-center text-[7px] font-black text-white select-none">
                            PhonePe
                          </div>
                          {/* Paytm */}
                          <div className="h-5 px-1.5 rounded bg-white border border-slate-200 flex items-center justify-center text-[7px] font-black select-none">
                            <span className="text-[#00BAF2]">pay</span>
                            <span className="text-[#002E6E]">tm</span>
                          </div>
                          {/* BHIM UPI */}
                          <div className="h-5 px-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-0.5 text-[7px] font-black select-none">
                            <span className="text-[#FF8F00] font-black">U</span>
                            <span className="text-[#097939] font-black">PI</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-surface-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-mono">
                          <span>pay@qualitydesk.io</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('pay@qualitydesk.io');
                              toast.success('UPI ID copied!');
                            }}
                            className="text-primary-500 hover:text-primary-600 cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'bank' && (
                      <div className="space-y-2 bg-slate-50 dark:bg-surface-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-mono text-left">
                        <div className="flex justify-between border-b border-slate-200/50 dark:border-slate-850 pb-1.5">
                          <span className="text-slate-400">Account Name:</span>
                          <span className="font-bold text-slate-805 dark:text-slate-200">QualityDesk Ltd</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-850 pb-1.5">
                          <span className="text-slate-400">Account No:</span>
                          <div className="flex items-center gap-1.5 font-bold text-slate-805 dark:text-slate-200">
                            <span>1209 0045 7712</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('120900457712');
                                toast.success('Account number copied!');
                              }}
                              className="text-primary-500 cursor-pointer"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-850 pb-1.5">
                          <span className="text-slate-400">IFSC Code:</span>
                          <div className="flex items-center gap-1.5 font-bold text-slate-805 dark:text-slate-200">
                            <span>QDESK000109</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('QDESK000109');
                                toast.success('IFSC Code copied!');
                              }}
                              className="text-primary-500 cursor-pointer"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between pb-0.5">
                          <span className="text-slate-400">Bank Name:</span>
                          <span className="font-bold text-slate-805 dark:text-slate-200">Chase Bank (Corporate)</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 pt-4">
                      <Button
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2"
                        type="submit"
                        isLoading={processing}
                      >
                        {paymentMethod === 'qr' ? 'Confirm Scan Payment' : 'Process Checkout'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
