import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
    fr: string;
  };
}

export const translations: Translations = {
  // Checkout Wizard - Step Headers
  'checkout.title.service': {
    en: 'What Service Do You Provide?',
    es: '¿Qué Servicio Ofrece?',
    fr: 'Quel Service Proposez-Vous?',
  },
  'checkout.title.plan': {
    en: 'Choose Your Plan',
    es: 'Elija Su Plan',
    fr: 'Choisissez Votre Forfait',
  },
  'checkout.title.checkout': {
    en: 'Complete Your Setup',
    es: 'Complete Su Configuración',
    fr: 'Finalisez Votre Configuration',
  },
  'checkout.subtitle.service': {
    en: 'Select your service category to get started. You can list multiple services with one account.',
    es: 'Seleccione su categoría de servicio para comenzar. Puede listar múltiples servicios con una cuenta.',
    fr: 'Sélectionnez votre catégorie de service pour commencer. Vous pouvez lister plusieurs services avec un seul compte.',
  },
  'checkout.subtitle.plan': {
    en: 'Pick the plan that works best for your service.',
    es: 'Elija el plan que mejor se adapte a su servicio.',
    fr: 'Choisissez le forfait qui convient le mieux à votre service.',
  },
  'checkout.subtitle.checkout': {
    en: 'Review your selection and complete your registration.',
    es: 'Revise su selección y complete su registro.',
    fr: 'Vérifiez votre sélection et finalisez votre inscription.',
  },

  // Services
  'service.attractions': {
    en: 'Attractions & Tours',
    es: 'Atracciones y Tours',
    fr: 'Attractions et Visites',
  },
  'service.attractions.desc': {
    en: 'Waterfalls, hiking trails, historic sites, guided tours, and unique experiences',
    es: 'Cascadas, rutas de senderismo, sitios históricos, tours guiados y experiencias únicas',
    fr: 'Cascades, sentiers de randonnée, sites historiques, visites guidées et expériences uniques',
  },
  'service.accommodations': {
    en: 'Accommodations',
    es: 'Alojamientos',
    fr: 'Hébergements',
  },
  'service.accommodations.desc': {
    en: 'Vacation rentals, cabins, B&Bs, boutique hotels',
    es: 'Alquileres vacacionales, cabañas, B&Bs, hoteles boutique',
    fr: 'Locations de vacances, chalets, chambres d\'hôtes, hôtels boutique',
  },
  'service.transportation': {
    en: 'Transportation',
    es: 'Transporte',
    fr: 'Transport',
  },
  'service.transportation.desc': {
    en: 'Vehicle rentals, airport transfers, shuttle services',
    es: 'Alquiler de vehículos, traslados al aeropuerto, servicios de transporte',
    fr: 'Location de véhicules, transferts aéroport, services de navette',
  },
  'service.dining': {
    en: 'Dining & Catering',
    es: 'Restaurantes y Catering',
    fr: 'Restauration et Traiteur',
  },
  'service.dining.desc': {
    en: 'Restaurants, cafes, private chefs, catering services',
    es: 'Restaurantes, cafés, chefs privados, servicios de catering',
    fr: 'Restaurants, cafés, chefs privés, services de traiteur',
  },
  'service.photography': {
    en: 'Photography',
    es: 'Fotografía',
    fr: 'Photographie',
  },
  'service.photography.desc': {
    en: 'Vacation photography, event photographers, portraits',
    es: 'Fotografía vacacional, fotógrafos de eventos, retratos',
    fr: 'Photographie de vacances, photographes d\'événements, portraits',
  },

  // UI Elements
  'ui.back': {
    en: 'Back',
    es: 'Volver',
    fr: 'Retour',
  },
  'ui.service': {
    en: 'Service',
    es: 'Servicio',
    fr: 'Service',
  },
  'ui.plan': {
    en: 'Plan',
    es: 'Plan',
    fr: 'Forfait',
  },
  'ui.checkout': {
    en: 'Checkout',
    es: 'Pago',
    fr: 'Paiement',
  },
  'ui.loading': {
    en: 'Loading plans...',
    es: 'Cargando planes...',
    fr: 'Chargement des forfaits...',
  },
  'ui.mostPopular': {
    en: 'Most Popular',
    es: 'Más Popular',
    fr: 'Le Plus Populaire',
  },
  'ui.oneTime': {
    en: 'one-time',
    es: 'único',
    fr: 'unique',
  },
  'ui.listing': {
    en: 'listing',
    es: 'listado',
    fr: 'annonce',
  },
  'ui.listings': {
    en: 'listings',
    es: 'listados',
    fr: 'annonces',
  },
  'ui.unlimited': {
    en: 'Unlimited',
    es: 'Ilimitado',
    fr: 'Illimité',
  },
  'ui.audioSeries': {
    en: 'Audio Series',
    es: 'Serie de Audio',
    fr: 'Série Audio',
  },
  'ui.podcast': {
    en: 'Podcast',
    es: 'Podcast',
    fr: 'Podcast',
  },
  'ui.imageEnhancement': {
    en: 'Image Enhancement',
    es: 'Mejora de Imagen',
    fr: 'Amélioration d\'Image',
  },
  'ui.gamePlacement': {
    en: 'Game Placement',
    es: 'Ubicación en Juego',
    fr: 'Placement Jeu',
  },

  // Checkout Summary
  'checkout.yourSelection': {
    en: 'Your Selection',
    es: 'Su Selección',
    fr: 'Votre Sélection',
  },
  'checkout.serviceCategory': {
    en: 'Service Category',
    es: 'Categoría de Servicio',
    fr: 'Catégorie de Service',
  },
  'checkout.billing': {
    en: 'Billing',
    es: 'Facturación',
    fr: 'Facturation',
  },
  'checkout.oneTimePayment': {
    en: 'One-time payment',
    es: 'Pago único',
    fr: 'Paiement unique',
  },
  'checkout.monthly': {
    en: 'Monthly',
    es: 'Mensual',
    fr: 'Mensuel',
  },
  'checkout.yearly': {
    en: 'Yearly',
    es: 'Anual',
    fr: 'Annuel',
  },
  'checkout.total': {
    en: 'Total',
    es: 'Total',
    fr: 'Total',
  },
  'checkout.checkingAccount': {
    en: 'Checking account...',
    es: 'Verificando cuenta...',
    fr: 'Vérification du compte...',
  },
  'checkout.signedIn': {
    en: 'Signed in',
    es: 'Conectado',
    fr: 'Connecté',
  },
  'checkout.signInToComplete': {
    en: 'Sign in to complete your registration',
    es: 'Inicie sesión para completar su registro',
    fr: 'Connectez-vous pour finaliser votre inscription',
  },
  'checkout.signInWithReplit': {
    en: 'Sign In with Replit',
    es: 'Iniciar Sesión con Replit',
    fr: 'Se Connecter avec Replit',
  },
  'checkout.processing': {
    en: 'Processing...',
    es: 'Procesando...',
    fr: 'Traitement...',
  },
  'checkout.getStartedFree': {
    en: 'Get Started Free',
    es: 'Comenzar Gratis',
    fr: 'Commencer Gratuitement',
  },
  'checkout.signInComplete': {
    en: 'Sign In & Complete Setup',
    es: 'Iniciar Sesión y Completar',
    fr: 'Se Connecter et Finaliser',
  },
  'checkout.completeCheckout': {
    en: 'Complete Checkout',
    es: 'Completar Pago',
    fr: 'Finaliser le Paiement',
  },
  'checkout.changePlan': {
    en: 'Change Plan',
    es: 'Cambiar Plan',
    fr: 'Changer de Forfait',
  },
  'checkout.termsAgreement': {
    en: 'By continuing, you agree to our Terms of Service and Privacy Policy',
    es: 'Al continuar, acepta nuestros Términos de Servicio y Política de Privacidad',
    fr: 'En continuant, vous acceptez nos Conditions d\'Utilisation et Politique de Confidentialité',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('glibra_language') as Language;
      if (saved && ['en', 'es', 'fr'].includes(saved)) {
        return saved;
      }
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('glibra_language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'es', label: 'Español', flag: 'ES' },
    { code: 'fr', label: 'Français', flag: 'FR' },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            language === lang.code
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title={lang.label}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
