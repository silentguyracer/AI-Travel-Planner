'use client';

import React, { useState } from 'react';
import {
  Volume2,
  Copy,
  Check,
  HeartPulse,
  Maximize2,
  X,
  Search,
  MessageSquare
} from 'lucide-react';

interface LiveTranslatorProps {
  destination: string;
  country: string;
}

interface QuickPhrase {
  english: string;
  native: string;
  phonetic: string;
  category: 'essentials' | 'dining' | 'transit' | 'emergency';
}

interface LanguageDataset {
  name: string;
  code: string;
  speechLang: string;
  emergencyNumber: string;
  phrases: QuickPhrase[];
  dietaryCards: {
    title: string;
    icon: string;
    nativeText: string;
    phonetic: string;
    englishMeaning: string;
    warningNote: string;
  }[];
}

const GLOBAL_LANGUAGES: Record<string, LanguageDataset> = {
  japanese: {
    name: 'Japanese',
    code: 'ja',
    speechLang: 'ja-JP',
    emergencyNumber: '110 (Police) / 119 (Ambulance)',
    phrases: [
      { english: 'Hello / Good day', native: 'こんにちは', phonetic: 'Konnichiwa', category: 'essentials' },
      { english: 'Thank you very much', native: 'ありがとうございます', phonetic: 'Arigatou gozaimasu', category: 'essentials' },
      { english: 'Excuse me / Sorry', native: 'すみません', phonetic: 'Sumimasen', category: 'essentials' },
      { english: 'Where is the restroom?', native: 'トイレはどこですか？', phonetic: 'Toire wa doko desu ka?', category: 'transit' },
      { english: 'The bill, please', native: 'お会計をお願いします', phonetic: 'O-kaikei o onegaishimasu', category: 'dining' },
      { english: 'Water, please', native: 'お水をお願いします', phonetic: 'O-mizu o onegaishimasu', category: 'dining' },
      { english: 'Delicious!', native: '美味しいです！', phonetic: 'Oishii desu!', category: 'dining' },
      { english: 'How much is this?', native: 'これはいくらですか？', phonetic: 'Kore wa ikura desu ka?', category: 'essentials' },
      { english: 'Please help me', native: '助けてください', phonetic: 'Tasukete kudasai', category: 'emergency' },
      { english: 'Where is the train station?', native: '駅はどこですか？', phonetic: 'Eki wa doko desu ka?', category: 'transit' },
    ],
    dietaryCards: [
      {
        title: 'Peanut & Nut Allergy',
        icon: '🥜',
        nativeText: '私には重度のナッツ・ピーナッツアレルギーがあります。ナッツ、ピーナッツ、またはナッツオイルを含む料理は食べられません。シェフにご確認ください。',
        phonetic: 'Watashi ni wa juudo no nattsu piinattsu arerugii ga arimasu. Nattsu, piinattsu, matawa nattsu oiru o fukumu ryouri wa taberaremasen.',
        englishMeaning: 'I have a severe nut/peanut allergy. I cannot consume nuts, peanuts, or nut oils. Please confirm with the kitchen.',
        warningNote: 'Crucial for Japan where peanut paste or sesame-peanut mixes are used in sauces and ramen broth.',
      },
      {
        title: 'Strict Gluten-Free / Celiac',
        icon: '🌾',
        nativeText: '私は小麦アレルギー（セリアック病）があります。小麦、醤油、大麦、パン粉、麺類が入ったものは食べられません。グルテンフリーの調味料を使用してください。',
        phonetic: 'Watashi wa komugi arerugii ga arimasu. Komugi, shouyu, koomugi, panko, menrui ga haitta mono wa taberaremasen.',
        englishMeaning: 'I have celiac disease. I cannot eat wheat, regular soy sauce, barley, breading, or wheat noodles.',
        warningNote: 'Note: Traditional Japanese soy sauce contains wheat; ask for Tamari or unseasoned grilled options.',
      },
      {
        title: 'Strict Vegetarian / No Fish Dashi',
        icon: '🥬',
        nativeText: '私は完全な菜食主義者です。肉、魚介類、かつお節、魚のだし（出汁）が入ったものは食べられません。昆布だしや野菜のみの料理をお願いします。',
        phonetic: 'Watashi wa kanzen na saishoku shugisha desu. Niku, gyokairui, katsuobushi, dashi ga haitta mono wa taberaremasen.',
        englishMeaning: 'I am strict vegetarian. No meat, fish, bonito flakes, or fish broth. Only kelp or vegetable stock please.',
        warningNote: 'Almost all Japanese broths default to bonito fish flakes unless specifically requested otherwise.',
      },
      {
        title: 'Take Me to This Hotel Address',
        icon: '🚕',
        nativeText: 'この住所まで連れて行ってください。ありがとうございます。',
        phonetic: 'Kono juusho made tsurete itte kudasai. Arigatou gozaimasu.',
        englishMeaning: 'Please take me to this address. Thank you.',
        warningNote: 'Hand your phone to the taxi driver with the destination address visible.',
      },
      {
        title: 'Medical Emergency / Call Ambulance',
        icon: '🚨',
        nativeText: '緊急事態です！すぐに救急車（119番）を呼んでください！',
        phonetic: 'Kinkyuu jitai desu! Sugu ni kyuukyuusha o yonde kudasai!',
        englishMeaning: 'This is an emergency! Please call an ambulance (dial 119) immediately!',
        warningNote: 'Universal GSM emergency helpline or 119 in Japan.',
      },
    ],
  },
  french: {
    name: 'French',
    code: 'fr',
    speechLang: 'fr-FR',
    emergencyNumber: '112 (European Universal) / 15 (SAMU Medical)',
    phrases: [
      { english: 'Hello / Good day', native: 'Bonjour', phonetic: 'Bohn-zhoor', category: 'essentials' },
      { english: 'Thank you very much', native: 'Merci beaucoup', phonetic: 'Mair-see boh-koo', category: 'essentials' },
      { english: 'Please', native: "S'il vous plaît", phonetic: 'Seel voo play', category: 'essentials' },
      { english: 'The bill, please', native: "L'addition, s'il vous plaît", phonetic: 'Lah-dee-syohn seel voo play', category: 'dining' },
      { english: 'Where is the restroom?', native: 'Où sont les toilettes ?', phonetic: 'Oo soh lay twah-let?', category: 'transit' },
      { english: 'Tap water carafe, please', native: "Une carafe d'eau, s'il vous plaît", phonetic: 'Ewn kah-raf doh seel voo play', category: 'dining' },
      { english: 'How much does it cost?', native: 'Combien ça coûte ?', phonetic: 'Kohm-byen sah koot?', category: 'essentials' },
      { english: 'Do you speak English?', native: 'Parlez-vous anglais ?', phonetic: 'Par-lay voo ahn-glay?', category: 'essentials' },
      { english: 'Excuse me', native: 'Excusez-moi / Pardon', phonetic: 'Ex-kew-zay mwah', category: 'essentials' },
      { english: 'Help!', native: "À l'aide !", phonetic: 'Ah laid!', category: 'emergency' },
    ],
    dietaryCards: [
      {
        title: 'Peanut & Nut Allergy',
        icon: '🥜',
        nativeText: "J'ai une allergie sévère aux arachides et aux fruits à coque. Si j'en consomme, je risque un choc anaphylactique mortel. Pouvez-vous vérifier avec le chef ?",
        phonetic: 'Zhay ewn ah-lair-zhee say-vair oh zah-rah-sheed...',
        englishMeaning: 'I have a life-threatening nut allergy. Can you please check with the chef?',
        warningNote: 'Watch out for walnut oils in dressings and almond meal in French pastries.',
      },
      {
        title: 'Strict Gluten-Free / Celiac',
        icon: '🌾',
        nativeText: "Je suis atteint(e) de la maladie cœliaque (intolérance sévère au gluten). Je ne peux consommer ni blé, ni pain, ni farine, ni pâtes, ni bière.",
        phonetic: 'Zhuh swee zah-tahn duh lah mah-lah-dee suh-lyak...',
        englishMeaning: 'I have celiac disease. No wheat, bread, flour, pasta, or sauces with roux.',
        warningNote: 'Traditional galettes (buckwheat crêpes) are naturally gluten-free in Brittany/Paris bistros.',
      },
      {
        title: 'Vegetarian / No Meat or Animal Stock',
        icon: '🥬',
        nativeText: 'Je suis végétarien(ne). Je ne mange ni viande, ni volaille, ni poisson, ni bouillon de bœuf ou de volaille.',
        phonetic: 'Zhuh swee vay-zhay-tah-ryen...',
        englishMeaning: 'I am vegetarian. No meat, poultry, fish, or beef/chicken stock.',
        warningNote: 'French cuisine frequently uses duck fat or veal stock in potato and vegetable gratins.',
      },
      {
        title: 'Taxi to Hotel Address',
        icon: '🚕',
        nativeText: "Bonjour, s'il vous plaît déposez-moi à cette adresse. Merci beaucoup !",
        phonetic: 'Bohn-zhoor, seel voo play day-poh-zay mwah ah set ah-dress...',
        englishMeaning: 'Please drop me off at this address. Thank you!',
        warningNote: 'Show this card directly to your taxi or VTC driver.',
      },
      {
        title: 'Medical Emergency',
        icon: '🚨',
        nativeText: 'Ceci est une urgence médicale ! Appelez immédiatement le SAMU (15) ou le 112 !',
        phonetic: 'Suh-see ay tewn oor-zhahns may-dee-kahl! Ah-puh-lay luh sah-mew!',
        englishMeaning: 'Medical emergency! Please call the paramedics (15 or 112) immediately!',
        warningNote: 'Dial 112 for all EU universal emergency services.',
      },
    ],
  },
  italian: {
    name: 'Italian',
    code: 'it',
    speechLang: 'it-IT',
    emergencyNumber: '112 (Universal) / 118 (Medical Emergency)',
    phrases: [
      { english: 'Hello / Good day', native: 'Buongiorno / Ciao', phonetic: 'Bwon-zhor-no / Chow', category: 'essentials' },
      { english: 'Thank you very much', native: 'Grazie mille', phonetic: 'Graht-zyeh meel-leh', category: 'essentials' },
      { english: 'Please', native: 'Per favore', phonetic: 'Pair fah-voh-reh', category: 'essentials' },
      { english: 'The bill, please', native: 'Il conto, per favore', phonetic: 'Eel kon-toh pair fah-voh-reh', category: 'dining' },
      { english: 'Where is the restroom?', native: "Dov'è il bagno?", phonetic: 'Doh-veh eel bahn-yoh?', category: 'transit' },
      { english: 'Delicious!', native: 'Delizioso / Buonissimo!', phonetic: 'Bwoh-nees-see-moh!', category: 'dining' },
      { english: 'How much is this?', native: 'Quanto costa?', phonetic: 'Kwan-toh koh-stah?', category: 'essentials' },
      { english: 'Do you speak English?', native: 'Parla inglese?', phonetic: 'Par-lah een-gleh-zeh?', category: 'essentials' },
      { english: 'Where is the station?', native: "Dov'è la stazione?", phonetic: 'Doh-veh lah stah-tsyo-neh?', category: 'transit' },
      { english: 'Help me!', native: 'Aiuto!', phonetic: 'Ah-yoo-toh!', category: 'emergency' },
    ],
    dietaryCards: [
      {
        title: 'Nut & Peanut Allergy',
        icon: '🥜',
        nativeText: 'Ho una grave allergia alle arachidi e alla frutta a guscio (noci, nocciole, pinoli). Posso avere uno shock anafilattico. Vi prego di controllare in cucina.',
        phonetic: 'Oh oo-nah grah-veh ahl-lair-jee-ah ahl-leh ah-rah-kee-dee...',
        englishMeaning: 'I have a life-threatening nut allergy. Check pesto for pine nuts/walnuts.',
        warningNote: 'Italian pesto virtually always contains pine nuts and walnuts.',
      },
      {
        title: 'Celiac / Gluten-Free',
        icon: '🌾',
        nativeText: 'Sono celiaco/a (intollerante al glutine). Non posso mangiare grano, farina o pasta normale. Avete opzioni senza glutine garantite?',
        phonetic: 'Soh-noh cheh-lee-ah-koh...',
        englishMeaning: 'I have celiac disease. Do you have certified gluten-free (senza glutine) pasta/crust?',
        warningNote: 'Italy has the highest standard of AIC-certified gluten-free dining in Europe.',
      },
      {
        title: 'Vegetarian / No Meat or Rennet',
        icon: '🥬',
        nativeText: 'Sono vegetariano/a. Non mangio carne, pesce, frutti di mare o formaggi con caglio animale.',
        phonetic: 'Soh-noh veh-zheh-tah-ryah-noh...',
        englishMeaning: 'I am vegetarian. No meat, poultry, seafood, or animal rennet.',
        warningNote: 'Traditional Parmigiano Reggiano uses animal rennet; ask for vegetarian cheeses.',
      },
      {
        title: 'Take Me to This Address',
        icon: '🚕',
        nativeText: 'Buongiorno, per favore mi porti a questo indirizzo. Grazie!',
        phonetic: 'Bwon-zhor-no, pair fah-voh-reh mee por-tee ah kwehs-toh een-dee-reet-tsoh...',
        englishMeaning: 'Good day, please take me to this address. Thank you!',
        warningNote: 'Show address directly to official white city taxi drivers.',
      },
      {
        title: 'Medical Emergency',
        icon: '🚨',
        nativeText: 'Questa è un’emergenza medica! Chiamate un’ambulanza (118) subito!',
        phonetic: 'Kwehs-tah eh oon eh-mair-zhent-sah meh-dee-kah! Kyah-mah-teh oon ahm-boo-lahn-tsah...',
        englishMeaning: 'Medical emergency! Call an ambulance (dial 118) right away!',
        warningNote: 'Dial 118 for medical or 112 for universal European emergency.',
      },
    ],
  },
  spanish: {
    name: 'Spanish',
    code: 'es',
    speechLang: 'es-ES',
    emergencyNumber: '112 (Spain) / 911 (Americas)',
    phrases: [
      { english: 'Hello / Good morning', native: 'Hola / Buenos días', phonetic: 'Oh-lah / Bway-nos dee-as', category: 'essentials' },
      { english: 'Thank you very much', native: 'Muchas gracias', phonetic: 'Moo-chas grah-syas', category: 'essentials' },
      { english: 'Please', native: 'Por favor', phonetic: 'Por fah-vor', category: 'essentials' },
      { english: 'The bill, please', native: 'La cuenta, por favor', phonetic: 'Lah kwen-tah por fah-vor', category: 'dining' },
      { english: 'Where is the restroom?', native: '¿Dónde está el baño?', phonetic: 'Dohn-deh es-tah el bahn-yo?', category: 'transit' },
      { english: 'Delicious!', native: '¡Está delicioso / muy rico!', phonetic: 'Es-tah deh-lee-syoh-soh!', category: 'dining' },
      { english: 'How much does it cost?', native: '¿Cuánto cuesta?', phonetic: 'Kwan-toh kwes-tah?', category: 'essentials' },
      { english: 'Do you speak English?', native: '¿Habla inglés?', phonetic: 'Ah-blah een-gles?', category: 'essentials' },
      { english: 'Excuse me', native: 'Disculpe / Perdón', phonetic: 'Dees-kool-peh / Pair-dohn', category: 'essentials' },
      { english: 'Help me!', native: '¡Ayuda, por favor!', phonetic: 'Ah-yoo-dah por fah-vor!', category: 'emergency' },
    ],
    dietaryCards: [
      {
        title: 'Peanut & Nut Allergy',
        icon: '🥜',
        nativeText: 'Tengo una alergia mortal a los cacahuates / maní y a los frutos secos. Si los como puedo sufrir un shock anafiláctico. Por favor verifique con el cocinero.',
        phonetic: 'Ten-goh oo-nah ah-lair-hee-ah mor-tahl ah los kah-kah-wah-tes...',
        englishMeaning: 'I have a severe nut/peanut allergy. Please confirm ingredients with the kitchen.',
        warningNote: 'Check mole, salsas, and bakery items which frequently incorporate blended nuts.',
      },
      {
        title: 'Celiac / Sin Gluten',
        icon: '🌾',
        nativeText: 'Tengo celiaquía (intolerancia estricta al gluten). No puedo comer trigo, cebada, centeno, pan ni salsas espesadas con harina.',
        phonetic: 'Ten-goh seh-lee-ah-kee-ah...',
        englishMeaning: 'I have celiac disease. No wheat, bread, flour, or cross-contaminated fryers.',
        warningNote: 'Check if corn tortillas or patatas are fried in shared oil with battered tapas.',
      },
      {
        title: 'Vegetarian / Sin Carne',
        icon: '🥬',
        nativeText: 'Soy vegetariano/a estricto/a. No como carne, pollo, jamón, mariscos ni caldos de carne o ave.',
        phonetic: 'Soy veh-heh-tah-ryah-noh...',
        englishMeaning: 'I am vegetarian. No meat, chicken, ham, bacon, or meat stock.',
        warningNote: 'In Spain, dishes labeled "sin carne" sometimes still contain jamón or tuna unless specified.',
      },
      {
        title: 'Take Me to This Address',
        icon: '🚕',
        nativeText: 'Hola, por favor lléveme a esta dirección. ¡Muchas gracias!',
        phonetic: 'Oh-lah, por fah-vor yeh-veh-meh ah es-tah dee-rek-syohn...',
        englishMeaning: 'Hello, please take me to this address. Thank you very much!',
        warningNote: 'Show this screen to your driver.',
      },
      {
        title: 'Medical Emergency',
        icon: '🚨',
        nativeText: '¡Es una emergencia médica! ¡Por favor llame a una ambulancia de inmediato!',
        phonetic: 'Es oo-nah eh-mair-hen-syah meh-dee-kah!',
        englishMeaning: 'Medical emergency! Call an ambulance immediately!',
        warningNote: 'Call 112 in Spain or 911 in Mexico/Americas.',
      },
    ],
  },
};

export default function LiveTranslator({ destination, country }: LiveTranslatorProps) {
  // Detect language based on country/destination
  const getInitialLangKey = (): string => {
    const c = country.toLowerCase();
    const d = destination.toLowerCase();
    if (c.includes('japan') || d.includes('tokyo') || d.includes('kyoto') || d.includes('osaka')) return 'japanese';
    if (c.includes('france') || d.includes('paris') || d.includes('nice') || d.includes('lyon')) return 'french';
    if (c.includes('ital') || d.includes('rome') || d.includes('florence') || d.includes('milan') || d.includes('venice')) return 'italian';
    if (c.includes('spain') || c.includes('mexic') || d.includes('barcelona') || d.includes('madrid') || d.includes('cancun')) return 'spanish';
    return 'japanese';
  };

  const [activeLangKey, setActiveLangKey] = useState<string>(getInitialLangKey());
  const [activeCategory, setActiveCategory] = useState<'all' | 'essentials' | 'dining' | 'transit' | 'emergency'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.85); // slower speech by default for travelers
  const [activeFlashcard, setActiveFlashcard] = useState<LanguageDataset['dietaryCards'][0] | null>(null);

  // Custom Hotel address input for the taxi card
  const [customHotelAddress, setCustomHotelAddress] = useState('');

  const currentDataset = GLOBAL_LANGUAGES[activeLangKey] || GLOBAL_LANGUAGES.japanese;

  const handleSpeak = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => setSpeakingText(text);
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const filteredPhrases = currentDataset.phrases.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      !searchFilter.trim() ||
      p.english.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.phonetic.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.native.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Two-Way Audio Speech & Dietary Shield
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {currentDataset.name} ({currentDataset.speechLang})
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Pocket Native Voice & Emergency Cards
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Hear native pronunciations aloud, copy phrases, and display high-contrast dietary allergy flashcards to waitstaff in {destination}.
          </p>
        </div>

        {/* Language & Voice Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            {Object.keys(GLOBAL_LANGUAGES).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveLangKey(key)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  activeLangKey === key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {GLOBAL_LANGUAGES[key].name}
              </button>
            ))}
          </div>

          {/* Voice Speed Toggle */}
          <button
            type="button"
            onClick={() => setSpeechRate(speechRate === 0.85 ? 0.65 : 0.85)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 transition-colors"
            title="Toggle speech pace"
          >
            Voice Pace: {speechRate === 0.85 ? 'Normal (0.85x)' : 'Slow Learner (0.65x)'}
          </button>
        </div>
      </div>

      {/* SECTION 1: Emergency & Dietary Allergy Flashcards Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <h4 className="font-extrabold text-base text-slate-900">
              Dietary Allergy & Taxi Flashcards
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Tap any card to show fullscreen to waiters or taxi drivers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentDataset.dietaryCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => setActiveFlashcard(card)}
              className="bg-slate-50 hover:bg-indigo-50/50 p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{card.icon}</span>
                    <span className="font-bold text-sm text-slate-900">{card.title}</span>
                  </div>
                  <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 italic">
                  &ldquo;{card.nativeText}&rdquo;
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-indigo-600 font-bold">
                <span>View Fullscreen Card</span>
                <span className="text-slate-400 font-normal">Tap to expand →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Interactive Voice Phrasebook */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h4 className="font-extrabold text-base text-slate-900">
              Essential Local Phrasebook
            </h4>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {(['all', 'essentials', 'dining', 'transit', 'emergency'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search phrase in English or phonetic (e.g. bathroom, bill, water)..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Phrases List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPhrases.map((phrase, idx) => {
            const isSpeaking = speakingText === phrase.native;
            const isCopied = copiedText === phrase.native;

            return (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      {phrase.category}
                    </span>
                    <h5 className="font-bold text-sm text-slate-900">{phrase.english}</h5>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSpeak(phrase.native, currentDataset.speechLang)}
                      className={`p-2 rounded-xl border transition-all ${
                        isSpeaking
                          ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                      }`}
                      title="Speak phrase aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(phrase.native)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                      title="Copy native script"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <div className="text-base font-extrabold text-indigo-950 font-sans tracking-wide">
                    {phrase.native}
                  </div>
                  <div className="text-xs text-slate-500 font-medium italic">
                    Pronounced: {phrase.phonetic}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULLSCREEN FLASHCARD MODAL */}
      {activeFlashcard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-4 border-indigo-600 relative space-y-6 text-center">
            <button
              onClick={() => setActiveFlashcard(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Flashcard Header */}
            <div className="space-y-1">
              <span className="text-4xl">{activeFlashcard.icon}</span>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                {activeFlashcard.title}
              </h3>
              <p className="text-xs text-slate-400">
                Show this high-contrast screen directly to restaurant staff or drivers
              </p>
            </div>

            {/* If Taxi Card, provide optional hotel address input */}
            {activeFlashcard.title.includes('Address') && (
              <div className="text-left space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Optional: Type Your Destination Hotel or Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Park Hyatt Shinjuku or Central Plaza Hotel"
                  value={customHotelAddress}
                  onChange={(e) => setCustomHotelAddress(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none"
                />
              </div>
            )}

            {/* High Contrast Translation Box */}
            <div className="bg-slate-950 text-white p-6 rounded-2xl space-y-3 shadow-inner">
              <p className="text-2xl sm:text-3xl font-black leading-snug tracking-wide text-amber-300">
                {activeFlashcard.nativeText}
              </p>
              {customHotelAddress && (
                <div className="mt-2 pt-2 border-t border-white/20 text-lg font-bold text-sky-300">
                  📍 {customHotelAddress}
                </div>
              )}
            </div>

            {/* Phonetic & English Reference */}
            <div className="space-y-1 text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="font-semibold text-slate-700">
                <span className="font-bold text-indigo-600">Phonetic: </span>
                {activeFlashcard.phonetic}
              </div>
              <div className="text-slate-500">
                <span className="font-bold text-slate-700">Meaning: </span>
                {activeFlashcard.englishMeaning}
              </div>
              <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                ⚠️ {activeFlashcard.warningNote}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  handleSpeak(
                    activeFlashcard.nativeText + (customHotelAddress ? ` ${customHotelAddress}` : ''),
                    currentDataset.speechLang
                  )
                }
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>Speak Aloud</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFlashcard(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close Flashcard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
