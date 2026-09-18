import { useState, useEffect } from 'react';
import { fetchPlans, createCheckoutSession, Plan } from '../lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useI18n, LanguageSwitcher } from '@/lib/i18n';
import { MapPin, Home, Car, UtensilsCrossed, Camera } from 'lucide-react';

type Step = 'service' | 'plan' | 'checkout';

interface WizardState {
  selectedService: string | null;
  selectedPlan: Plan | null;
}

const ServiceIcon = ({ id, className }: { id: string; className?: string }) => {
  const iconClass = className || "w-6 h-6";
  switch (id) {
    case 'attractions':
      return <MapPin className={iconClass} />;
    case 'accommodations':
      return <Home className={iconClass} />;
    case 'transportation':
      return <Car className={iconClass} />;
    case 'dining':
      return <UtensilsCrossed className={iconClass} />;
    case 'photography':
      return <Camera className={iconClass} />;
    default:
      return <MapPin className={iconClass} />;
  }
};

export default function CheckoutWizard() {
  const { t } = useI18n();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>('service');
  const [plans, setPlans] = useState<{ travelerPlans: Plan[]; hostPlans: Plan[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    selectedService: null,
    selectedPlan: null,
  });

  const services = [
    { id: 'attractions' },
    { id: 'accommodations' },
    { id: 'transportation' },
    { id: 'dining' },
    { id: 'photography' },
  ];

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

  const handleServiceSelect = (serviceId: string) => {
    setWizardState(prev => ({ ...prev, selectedService: serviceId }));
    setStep('plan');
  };

  const handlePlanSelect = (plan: Plan) => {
    setWizardState(prev => ({ ...prev, selectedPlan: plan }));
    setStep('checkout');
  };

  const handleCheckout = async () => {
    if (!wizardState.selectedPlan) return;

    if (wizardState.selectedPlan.planCode.includes('FREE')) {
      if (!isAuthenticated) {
        window.location.href = '/api/login';
        return;
      }
      alert('Free plan activated! Your account is all set.');
      window.location.href = '/';
      return;
    }

    if (!isAuthenticated) {
      window.location.href = '/api/login';
      return;
    }

    setCheckoutLoading(true);
    try {
      const { url } = await createCheckoutSession(wizardState.selectedPlan.planCode);
      window.location.href = url;
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'service') window.location.href = '/';
    else if (step === 'plan') setStep('service');
    else if (step === 'checkout') setStep('plan');
  };

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const getServiceName = (id: string) => t(`service.${id}`);
  const getServiceDesc = (id: string) => t(`service.${id}.desc`);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">{t('ui.loading')}</div>
      </div>
    );
  }

  const hostPlans = plans?.hostPlans || [];
  const selectedServiceName = wizardState.selectedService ? getServiceName(wizardState.selectedService) : '';

  const stepIndex = ['service', 'plan', 'checkout'].indexOf(step);
  const isStepComplete = (targetStep: string) => {
    const targetIndex = ['service', 'plan', 'checkout'].indexOf(targetStep);
    return stepIndex >= targetIndex;
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white pt-8 pb-12 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-gray-600 hover:text-cyan-600 transition-colors group"
              data-testid="btn-wizard-back"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('ui.back')}
            </button>
            
            <LanguageSwitcher />
          </div>

          <div className="flex items-center justify-center space-x-3 text-sm text-gray-500 mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isStepComplete('service') ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>1</div>
              <span className={isStepComplete('service') ? 'text-cyan-600 font-medium hidden sm:inline' : 'hidden sm:inline'}>{t('ui.service')}</span>
            </div>
            <div className={`w-8 h-0.5 ${isStepComplete('plan') ? 'bg-cyan-500' : 'bg-gray-300'}`} />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isStepComplete('plan') ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>2</div>
              <span className={isStepComplete('plan') ? 'text-cyan-600 font-medium hidden sm:inline' : 'hidden sm:inline'}>{t('ui.plan')}</span>
            </div>
            <div className={`w-8 h-0.5 ${isStepComplete('checkout') ? 'bg-cyan-500' : 'bg-gray-300'}`} />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isStepComplete('checkout') ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>3</div>
              <span className={isStepComplete('checkout') ? 'text-cyan-600 font-medium hidden sm:inline' : 'hidden sm:inline'}>{t('ui.checkout')}</span>
            </div>
          </div>

          <h1 className="font-orbitron text-3xl md:text-4xl font-bold gradient-title text-center">
            {step === 'service' && t('checkout.title.service')}
            {step === 'plan' && t('checkout.title.plan')}
            {step === 'checkout' && t('checkout.title.checkout')}
          </h1>
          <p className="text-gray-600 text-center mt-3">
            {step === 'service' && t('checkout.subtitle.service')}
            {step === 'plan' && t('checkout.subtitle.plan')}
            {step === 'checkout' && t('checkout.subtitle.checkout')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === 'service' && (
          <div className="space-y-4">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service.id)}
                className="w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-cyan-400 hover:shadow-lg transition-all group"
                data-testid={`btn-service-${service.id}`}
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform text-cyan-600">
                    <ServiceIcon id={service.id} className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-cyan-600 mb-1">{getServiceName(service.id)}</h3>
                    <p className="text-sm text-gray-500">{getServiceDesc(service.id)}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'plan' && (
          <div className="space-y-4">
            {hostPlans.map(plan => {
              const entitlements = plan.entitlements as any;
              const listingCount = entitlements.listings === -1 ? t('ui.unlimited') : entitlements.listings;
              const listingLabel = entitlements.listings === 1 ? t('ui.listing') : t('ui.listings');
              return (
                <button
                  key={plan.planCode}
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full text-left p-6 border-2 rounded-xl transition-all relative ${
                    plan.isPopular 
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' 
                      : 'border-gray-200 hover:border-cyan-300 hover:shadow-md'
                  }`}
                  data-testid={`btn-plan-${plan.planCode}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {t('ui.mostPopular')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">{plan.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold gradient-title">{plan.price.display}</span>
                      {plan.interval !== 'one-time' && plan.price.cents > 0 && (
                        <span className="text-sm text-gray-500">/{plan.interval}</span>
                      )}
                      {plan.interval === 'one-time' && (
                        <span className="text-xs text-gray-500 block">{t('ui.oneTime')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {listingCount} {listingLabel}
                    </span>
                    {entitlements.bundlesBloodlines && (
                      <span className="inline-flex items-center text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {t('ui.audioSeries')}
                      </span>
                    )}
                    {entitlements.connectedTravelWaves && (
                      <span className="inline-flex items-center text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                        {t('ui.podcast')}
                      </span>
                    )}
                    {entitlements.nanoBanana && (
                      <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                        {t('ui.imageEnhancement')}
                      </span>
                    )}
                    {entitlements.interactiveGame && (
                      <span className="inline-flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {t('ui.gamePlacement')}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 'checkout' && wizardState.selectedPlan && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-cyan-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">{t('checkout.yourSelection')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t('checkout.serviceCategory')}</span>
                  <span className="font-medium text-gray-800">{selectedServiceName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t('ui.plan')}</span>
                  <span className="font-medium text-gray-800">{wizardState.selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t('checkout.billing')}</span>
                  <span className="font-medium text-gray-800">
                    {wizardState.selectedPlan.interval === 'one-time' 
                      ? t('checkout.oneTimePayment') 
                      : wizardState.selectedPlan.interval === 'month' 
                        ? t('checkout.monthly')
                        : t('checkout.yearly')}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 text-lg font-bold">
                  <span className="text-gray-800">{t('checkout.total')}</span>
                  <span className="gradient-title text-2xl">{wizardState.selectedPlan.price.display}</span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            {authLoading ? (
              <div className="text-center py-4">
                <div className="text-gray-500">{t('checkout.checkingAccount')}</div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {((user as any).firstName?.[0] || (user as any).email?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {(user as any).firstName ? `${(user as any).firstName} ${(user as any).lastName || ''}`.trim() : t('checkout.signedIn')}
                    </p>
                    <p className="text-sm text-gray-600">{(user as any).email}</p>
                  </div>
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-4">{t('checkout.signInToComplete')}</p>
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  data-testid="btn-login"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('checkout.signInWithReplit')}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                data-testid="btn-complete-checkout"
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('checkout.processing')}
                  </span>
                ) : wizardState.selectedPlan.price.cents === 0 ? (
                  t('checkout.getStartedFree')
                ) : !isAuthenticated ? (
                  t('checkout.signInComplete')
                ) : (
                  t('checkout.completeCheckout')
                )}
              </button>

              <button
                onClick={() => setStep('plan')}
                className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                data-testid="btn-change-plan"
              >
                {t('checkout.changePlan')}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500">
              {t('checkout.termsAgreement')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
