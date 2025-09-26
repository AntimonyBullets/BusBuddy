"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Common
    'common.busbuddy': 'BusBuddy',
    'common.smartTransitCompanion': 'Smart Transit Companion',
    'common.login': 'Login',
    'common.signup': 'Sign Up',
    'common.logout': 'Logout',
    'common.back': 'Back',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.comingSoon': 'Coming Soon',
    'common.required': 'Required',
    'common.optional': 'Optional',

    // Landing Page
    'landing.hero.title': 'Track. Connect. Travel Smart.',
    'landing.hero.subtitle': 'Your all-in-one solution for bus tracking, route planning, and seamless urban transportation.',
    'landing.trackChild.title': 'Track Your Child\'s Bus',
    'landing.trackChild.description': 'Keep your children safe with real-time school bus tracking and notifications',
    'landing.trackChild.action': 'Start Tracking',
    'landing.institution.title': 'Register Your Institution',
    'landing.institution.description': 'Connect your school or organization to our transportation network',
    'landing.institution.action': 'Get Started',
    'landing.cityBus.title': 'Track City Bus Routes',
    'landing.cityBus.description': 'Real-time updates for public transportation and route optimization',
    'landing.cityBus.action': 'Explore Routes',

    // Auth Page
    'auth.welcomeBack': 'Welcome back',
    'auth.loginToContinue': 'Login to your account to continue',
    'auth.createAccount': 'Create your account',
    'auth.signupToStart': 'Sign up to get started with BusBuddy',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.loginButton': 'Login',
    'auth.signupButton': 'Sign Up',
    'auth.switchToSignup': 'Don\'t have an account? Sign up',
    'auth.switchToLogin': 'Already have an account? Login',

    // Passenger Page
    'passenger.dashboard': 'Passenger Dashboard',
    'passenger.findBus': 'Find Your Bus',
    'passenger.recentSearches': 'Recent Searches',
    'passenger.trackingView': 'Bus Tracking View',

    // Driver Page
    'driver.dashboard': 'Driver Dashboard',
    'driver.busInfo': 'Bus Information',
    'driver.tripControls': 'Trip Controls',
    'driver.startTrip': 'Start Trip',
    'driver.endTrip': 'End Trip',

    // Institution Registration
    'institution.title': 'Institution Registration',
    'institution.subtitle': 'Register your school, college, or organization with BusBuddy',
    'institution.email': 'Email Address',
    'institution.password': 'Password',
    'institution.orgName': 'Organization Name',
    'institution.phone': 'Phone Number',
    'institution.state': 'State',
    'institution.city': 'City/Town/Village',
    'institution.location': 'Location',
    'institution.website': 'Website URL',
    'institution.enterEmail': 'Enter institution email',
    'institution.createPassword': 'Create a secure password',
    'institution.enterOrgName': 'Enter your institution name',
    'institution.enterPhone': 'Enter contact number',
    'institution.selectState': 'Select your state',
    'institution.searchCity': 'Search cities in',
    'institution.selectStateFirst': 'Please select a state first',
    'institution.enterWebsite': 'https://your-institution-website.com',
    'institution.fetchLocation': 'Fetch Current Location',
    'institution.locationFetched': 'Location Fetched',
    'institution.fetchingLocation': 'Fetching Location...',
    'institution.registerButton': 'Register Institution',
    'institution.submittingRegistration': 'Submitting Registration...',
    'institution.missingInfo': 'Missing Information',
    'institution.fillRequired': 'Please fill in all required fields',
    'institution.registrationSuccess': 'Registration Successful',
    'institution.registrationSuccessDesc': 'Your institution has been registered successfully!',
    'institution.registrationFailed': 'Registration Failed',
    'institution.registrationFailedDesc': 'An error occurred during registration. Please try again.',

    // Bus Search
    'busSearch.from': 'From',
    'busSearch.to': 'To',
    'busSearch.enterDeparture': 'Enter departure location',
    'busSearch.enterDestination': 'Enter destination',
    'busSearch.swap': 'Swap locations',
    'busSearch.searchBuses': 'Search Buses',

    // Tracking
    'tracking.busLocation': 'Bus Location',
    'tracking.route': 'Route',
    'tracking.estimatedArrival': 'Estimated Arrival',

    // Language
    'language.select': 'Language',
    'language.english': 'English',
    'language.hindi': 'हिंदी',

    // Location errors
    'location.denied': 'Location access denied. Please enable location permissions.',
    'location.unavailable': 'Location information is unavailable.',
    'location.timeout': 'Location request timed out.',
    'location.failed': 'Failed to get location',

    // Cities search
    'cities.noResults': 'No cities found matching',
    'cities.in': 'in',

    // Landing page additional
    'landing.services.title': 'More Services',
    'landing.services.subtitle': 'Discover additional features to enhance your transportation experience',
    'landing.passenger.title': 'I\'m a Passenger',
    'landing.passenger.subtitle': 'Find & track buses',
    'landing.driver.title': 'I\'m a Driver',
    'landing.driver.subtitle': 'Manage your routes',

    // Contact page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our team',

    // Demo page  
    'demo.title': 'Demo',
    'demo.subtitle': 'Try out our features',

    // General messages
    'messages.featureComingSoon': 'feature will be available soon!',
  },
  hi: {
    // Common
    'common.busbuddy': 'बसबडी',
    'common.smartTransitCompanion': 'स्मार्ट परिवहन साथी',
    'common.login': 'लॉग इन',
    'common.signup': 'साइन अप',
    'common.logout': 'लॉग आउट',
    'common.back': 'वापस',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.comingSoon': 'जल्द आ रहा है',
    'common.required': 'आवश्यक',
    'common.optional': 'वैकल्पिक',

    // Landing Page
    'landing.hero.title': 'ट्रैक करें। जुड़ें। स्मार्ट यात्रा करें।',
    'landing.hero.subtitle': 'बस ट्रैकिंग, रूट प्लानिंग और सहज शहरी परिवहन के लिए आपका संपूर्ण समाधान।',
    'landing.trackChild.title': 'अपने बच्चे की बस को ट्रैक करें',
    'landing.trackChild.description': 'रियल-टाइम स्कूल बस ट्रैकिंग और नोटिफिकेशन के साथ अपने बच्चों को सुरक्षित रखें',
    'landing.trackChild.action': 'ट्रैकिंग शुरू करें',
    'landing.institution.title': 'अपनी संस्था का पंजीकरण करें',
    'landing.institution.description': 'अपने स्कूल या संगठन को हमारे परिवहन नेटवर्क से जोड़ें',
    'landing.institution.action': 'शुरू करें',
    'landing.cityBus.title': 'शहरी बस रूट ट्रैक करें',
    'landing.cityBus.description': 'सार्वजनिक परिवहन और रूट अनुकूलन के लिए रियल-टाइम अपडेट',
    'landing.cityBus.action': 'रूट एक्सप्लोर करें',

    // Auth Page
    'auth.welcomeBack': 'वापस स्वागत है',
    'auth.loginToContinue': 'जारी रखने के लिए अपने खाते में लॉगिन करें',
    'auth.createAccount': 'अपना खाता बनाएं',
    'auth.signupToStart': 'BusBuddy के साथ शुरुआत करने के लिए साइन अप करें',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.enterEmail': 'अपना ईमेल दर्ज करें',
    'auth.enterPassword': 'अपना पासवर्ड दर्ज करें',
    'auth.loginButton': 'लॉग इन',
    'auth.signupButton': 'साइन अप',
    'auth.switchToSignup': 'खाता नहीं है? साइन अप करें',
    'auth.switchToLogin': 'पहले से खाता है? लॉगिन करें',

    // Passenger Page
    'passenger.dashboard': 'यात्री डैशबोर्ड',
    'passenger.findBus': 'अपनी बस खोजें',
    'passenger.recentSearches': 'हाल की खोजें',
    'passenger.trackingView': 'बस ट्रैकिंग व्यू',

    // Driver Page
    'driver.dashboard': 'ड्राइवर डैशबोर्ड',
    'driver.busInfo': 'बस की जानकारी',
    'driver.tripControls': 'ट्रिप नियंत्रण',
    'driver.startTrip': 'ट्रिप शुरू करें',
    'driver.endTrip': 'ट्रिप समाप्त करें',

    // Institution Registration
    'institution.title': 'संस्था पंजीकरण',
    'institution.subtitle': 'अपने स्कूल, कॉलेज या संगठन को BusBuddy के साथ पंजीकृत करें',
    'institution.email': 'ईमेल पता',
    'institution.password': 'पासवर्ड',
    'institution.orgName': 'संगठन का नाम',
    'institution.phone': 'फोन नंबर',
    'institution.state': 'राज्य',
    'institution.city': 'शहर/कस्बा/गांव',
    'institution.location': 'स्थान',
    'institution.website': 'वेबसाइट URL',
    'institution.enterEmail': 'संस्था का ईमेल दर्ज करें',
    'institution.createPassword': 'एक सुरक्षित पासवर्ड बनाएं',
    'institution.enterOrgName': 'अपनी संस्था का नाम दर्ज करें',
    'institution.enterPhone': 'संपर्क नंबर दर्ज करें',
    'institution.selectState': 'अपना राज्य चुनें',
    'institution.searchCity': 'शहर खोजें',
    'institution.selectStateFirst': 'कृपया पहले राज्य चुनें',
    'institution.enterWebsite': 'https://आपकी-संस्था-वेबसाइट.com',
    'institution.fetchLocation': 'वर्तमान स्थान प्राप्त करें',
    'institution.locationFetched': 'स्थान प्राप्त हुआ',
    'institution.fetchingLocation': 'स्थान प्राप्त कर रहे हैं...',
    'institution.registerButton': 'संस्था पंजीकृत करें',
    'institution.submittingRegistration': 'पंजीकरण जमा कर रहे हैं...',
    'institution.missingInfo': 'जानकारी गुम',
    'institution.fillRequired': 'कृपया सभी आवश्यक फ़ील्ड भरें',
    'institution.registrationSuccess': 'पंजीकरण सफल',
    'institution.registrationSuccessDesc': 'आपकी संस्था सफलतापूर्वक पंजीकृत हो गई है!',
    'institution.registrationFailed': 'पंजीकरण असफल',
    'institution.registrationFailedDesc': 'पंजीकरण के दौरान एक त्रुटि हुई। कृपया पुनः प्रयास करें।',

    // Bus Search
    'busSearch.from': 'से',
    'busSearch.to': 'तक',
    'busSearch.enterDeparture': 'प्रस्थान स्थान दर्ज करें',
    'busSearch.enterDestination': 'गंतव्य दर्ज करें',
    'busSearch.swap': 'स्थान बदलें',
    'busSearch.searchBuses': 'बस खोजें',

    // Tracking
    'tracking.busLocation': 'बस स्थान',
    'tracking.route': 'रूट',
    'tracking.estimatedArrival': 'अनुमानित आगमन',

    // Language
    'language.select': 'भाषा',
    'language.english': 'English',
    'language.hindi': 'हिंदी',

    // Location errors
    'location.denied': 'स्थान पहुंच अस्वीकृत। कृपया स्थान अनुमतियां सक्षम करें।',
    'location.unavailable': 'स्थान की जानकारी उपलब्ध नहीं है।',
    'location.timeout': 'स्थान अनुरोध का समय समाप्त हुआ।',
    'location.failed': 'स्थान प्राप्त करने में असफल',

    // Cities search
    'cities.noResults': 'कोई शहर नहीं मिला',
    'cities.in': 'में',

    // Landing page additional
    'landing.services.title': 'अधिक सेवाएं',
    'landing.services.subtitle': 'अपने परिवहन अनुभव को बेहतर बनाने के लिए अतिरिक्त सुविधाओं की खोज करें',
    'landing.passenger.title': 'मैं एक यात्री हूं',
    'landing.passenger.subtitle': 'बस खोजें और ट्रैक करें',
    'landing.driver.title': 'मैं एक ड्राइवर हूं',
    'landing.driver.subtitle': 'अपने रूट का प्रबंधन करें',

    // Contact page
    'contact.title': 'संपर्क करें',
    'contact.subtitle': 'हमारी टीम से संपर्क करें',

    // Demo page
    'demo.title': 'डेमो',
    'demo.subtitle': 'हमारी सुविधाओं को आजमाएं',

    // General messages
    'messages.featureComingSoon': 'सुविधा जल्द उपलब्ध होगी!',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('busbuddy-language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('busbuddy-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}