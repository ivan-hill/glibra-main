import React, { useState, useEffect } from 'react';
import { fetchPlans, createCheckoutSession, Plan } from '../lib/api';

export default function Pricing() {
  const [plans, setPlans] = useState<{ travelerPlans: Plan[]; hostPlans: Plan[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'traveler' | 'host'>('traveler');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await fetchPlans();
      setPlans(data);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (planCode: string) => {
    if (planCode.includes('FREE') || planCode.includes('BASIC')) {
      alert('Free plan selected! Sign up to get started.');
      return;
    }

    setCheckoutLoading(planCode);
    try {
      const { url } = await createCheckoutSession(planCode);
      window.location.href = url;
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading plans...</div>
      </div>
    );
  }

  const currentPlans = activeTab === 'traveler' ? plans?.travelerPlans || [] : plans?.hostPlans || [];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <a 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-cyan-600 transition-colors mb-8 group"
            data-testid="btn-back-home"
          >
            <svg 
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
          
          <div className="text-center">
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold gradient-title mb-6">
              Host Plans
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business. Start free and upgrade as you grow.
            </p>
          </div>
        </div>
      </div>

      {/* Plan Type Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('traveler')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'traveler'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              For Travelers
            </button>
            <button
              onClick={() => setActiveTab('host')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'host'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              For Hosts
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentPlans.map((plan) => (
            <PlanCard
              key={plan.planCode}
              plan={plan}
              onSelect={handlePlanSelect}
              loading={checkoutLoading === plan.planCode}
            />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-orbitron text-3xl font-bold text-center mb-12 gradient-title">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <FAQItem
              question="Can I change my plan later?"
              answer="Yes! You can upgrade, downgrade, or cancel your plan at any time through your dashboard. Changes take effect at your next billing cycle."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, MasterCard, American Express) and digital wallets through our secure payment processor."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
            />
            <FAQItem
              question="How do credits work?"
              answer="Credits are used for AI-powered features like automated booking and smart recommendations. They automatically refill when you run low, so you never have to worry about interruptions."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  onSelect: (planCode: string) => void;
  loading: boolean;
}

function PlanCard({ plan, onSelect, loading }: PlanCardProps) {
  const entitlements = plan.entitlements as any;
  
  return (
    <div className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
      plan.isPopular 
        ? 'border-cyan-400 shadow-lg shadow-cyan-500/25' 
        : 'border-gray-200 hover:border-cyan-300'
    }`}>
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2 text-gray-800">{plan.name}</h3>
        <p className="text-gray-500 mb-4">{plan.description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-800">{plan.price.display}</span>
          {plan.price.cents > 0 && (
            <span className="text-gray-500">/{plan.interval}</span>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {plan.role === 'TRAVELER' && (
          <>
            <Feature
              text={`${entitlements.bookingsPerMonth === -1 ? 'Unlimited' : entitlements.bookingsPerMonth} bookings per month`}
            />
            {entitlements.creditsIncluded > 0 && (
              <Feature text={`${entitlements.creditsIncluded} credits included`} />
            )}
            {entitlements.serviceFeeDiscount > 0 && (
              <Feature text={`${Math.round(entitlements.serviceFeeDiscount * 100)}% off service fees`} />
            )}
            {entitlements.advancedFilters && <Feature text="Advanced filters" />}
            {entitlements.prioritySupport && <Feature text="Priority support" />}
            {entitlements.conciergeService && <Feature text="Concierge service" />}
          </>
        )}
        {plan.role === 'HOST' && (
          <>
            <Feature
              text={`${entitlements.listings === -1 ? 'Unlimited' : entitlements.listings} listing${entitlements.listings !== 1 ? 's' : ''}`}
            />
            {entitlements.discoveryVisibility && <Feature text="Discovery visibility" />}
            {entitlements.aiRecommendations && <Feature text="AI recommendations" />}
            {entitlements.basicDashboard && <Feature text="Basic dashboard" />}
            {entitlements.unlimitedDashboard && <Feature text="Full dashboard access" />}
            {entitlements.visibilityScoring && <Feature text="Visibility scoring" />}
            {entitlements.fallbacksPerMonth && <Feature text={`${entitlements.fallbacksPerMonth} fallback${entitlements.fallbacksPerMonth > 1 ? 's' : ''}/month`} />}
            {entitlements.unlimitedFallback && <Feature text="Unlimited fallbacks" />}
            {entitlements.priorityFallbackPlacement && <Feature text="Priority fallback placement" />}
            {entitlements.aiGuestMessaging && <Feature text="AI guest messaging" />}
            {entitlements.advancedAnalytics && <Feature text="Advanced analytics" />}
            {entitlements.dynamicPricingEngine && <Feature text="Dynamic pricing engine" />}
            {entitlements.guestAiConcierge && <Feature text="Guest AI concierge" />}
            {entitlements.smartGlassesArVisibility && <Feature text="Smart glasses AR visibility" />}
            {entitlements.prioritySupport && <Feature text="Priority support" />}
            {entitlements.bundlesBloodlines && <Feature text="Bundles & Bloodlines audio series" />}
            {entitlements.connectedTravelWaves && <Feature text="Connected Travel Waves podcast" />}
            {entitlements.nanoBanana && <Feature text="Nano Banana image enhancement" />}
            {entitlements.interactiveGame && <Feature text="Interactive game placement" />}
          </>
        )}
      </div>

      <button
        onClick={() => onSelect(plan.planCode)}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
          plan.price.cents === 0
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : plan.isPopular
            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
            : 'bg-transparent border border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Processing...' : plan.price.cents === 0 ? 'Get Started' : 'Choose Plan'}
      </button>
    </div>
  );
}

interface FeatureProps {
  text: string;
}

function Feature({ text }: FeatureProps) {
  return (
    <div className="flex items-center space-x-3">
      <svg className="w-5 h-5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-lg font-semibold text-gray-800">{question}</h3>
        <svg
          className={`w-5 h-5 text-cyan-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <p className="mt-4 text-gray-600 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}