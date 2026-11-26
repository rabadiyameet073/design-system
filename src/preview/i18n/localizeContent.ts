import { CategoryId } from '../../tokens/types';
import { ResolvedGenreContent } from '../genres/genreContent';

export interface ScriptMeta {
  id: string;
  label: string;
  nativeLabel: string;
  lang: string;
  dir: 'ltr' | 'rtl';
  fonts: {
    display: string;
    heading: string;
    body: string;
  };
}

export const SCRIPT_CONFIGS: Record<string, ScriptMeta> = {
  latin: {
    id: 'latin',
    label: 'Latin',
    nativeLabel: 'English',
    lang: 'en',
    dir: 'ltr',
    fonts: {
      display: 'Fraunces',
      heading: 'Plus Jakarta Sans',
      body: 'Plus Jakarta Sans'
    }
  },
  gujarati: {
    id: 'gujarati',
    label: 'Gujarati',
    nativeLabel: 'ગુજરાતી',
    lang: 'gu',
    dir: 'ltr',
    fonts: {
      display: 'Noto Serif Gujarati',
      heading: 'Noto Sans Gujarati',
      body: 'Noto Sans Gujarati'
    }
  },
  devanagari: {
    id: 'devanagari',
    label: 'Devanagari',
    nativeLabel: 'हिंदी / मराठी',
    lang: 'hi',
    dir: 'ltr',
    fonts: {
      display: 'Noto Serif Devanagari',
      heading: 'Poppins',
      body: 'Noto Sans Devanagari'
    }
  },
  arabic: {
    id: 'arabic',
    label: 'Arabic',
    nativeLabel: 'العربية',
    lang: 'ar',
    dir: 'rtl',
    fonts: {
      display: 'Amiri',
      heading: 'Cairo',
      body: 'Cairo'
    }
  },
  cyrillic: {
    id: 'cyrillic',
    label: 'Cyrillic',
    nativeLabel: 'Русский',
    lang: 'ru',
    dir: 'ltr',
    fonts: {
      display: 'Playfair Display',
      heading: 'Inter',
      body: 'Inter'
    }
  }
};

export interface LocalizedUIStrings extends Record<string, string> {
  addToCart: string;
  inStock: string;
  outOfStock: string;
  cart: string;
  checkout: string;
  orderConfirmed: string;
  addedToCartToast: string;
  search: string;
  allProducts: string;
  reviews: string;
  faq: string;
  subscribe: string;
  emailPlaceholder: string;
  subscribedSuccess: string;
  announcement: string;
  viewCollection: string;
  learnMore: string;
  rightsReserved: string;
  specs: string;
  pricing: string;
  contactUs: string;
  home: string;
  about: string;
  features: string;
}

const UI_DICTIONARY: Record<string, LocalizedUIStrings> = {
  latin: {
    addToCart: 'Add to Bag',
    inStock: 'In Stock · Ready to Ship',
    outOfStock: 'Sold Out',
    cart: 'Cart',
    checkout: 'Checkout',
    orderConfirmed: 'Order Confirmed',
    addedToCartToast: 'Added to your bag',
    search: 'Search collection...',
    allProducts: 'All Products',
    reviews: 'Customer Reviews',
    faq: 'Frequently Asked Questions',
    subscribe: 'Subscribe',
    emailPlaceholder: 'Enter your email address...',
    subscribedSuccess: 'Thank you for subscribing!',
    announcement: 'Complimentary Express Delivery on Orders Over $150 · 30-Day Risk-Free Trial',
    viewCollection: 'View Collection',
    learnMore: 'Learn More',
    rightsReserved: 'All rights reserved.',
    specs: 'Specifications',
    pricing: 'Pricing',
    contactUs: 'Contact Us',
    home: 'Home',
    about: 'About',
    features: 'Features'
  },
  gujarati: {
    addToCart: 'કાર્ટમાં ઉમેરો',
    inStock: 'સ્ટોકમાં ઉપલબ્ધ · ઝડપી ડિલિવરી',
    outOfStock: 'સ્ટોક સમાપ્ત',
    cart: 'કાર્ટ',
    checkout: 'ચેકઆઉટ કરો',
    orderConfirmed: 'ઓર્ડર કન્ફર્મ થયો',
    addedToCartToast: 'તમારા કાર્ટમાં ઉમેરવામાં આવ્યું',
    search: 'સંગ્રહમાં શોધો...',
    allProducts: 'બધી વસ્તુઓ',
    reviews: 'ગ્રાહક પ્રતિભાવો',
    faq: 'વારંવાર પૂછાતા પ્રશ્નો (FAQ)',
    subscribe: 'સબ્સ્ક્રાઇબ કરો',
    emailPlaceholder: 'તમારું ઇમેઇલ એડ્રેસ લખો...',
    subscribedSuccess: 'સબ્સ્ક્રાઇબ કરવા બદલ આભાર!',
    announcement: '₹૧,૫૦૦ થી વધુના ઓર્ડર પર મફત એક્સપ્રેસ ડિલિવરી · ૩૦ દિવસનું ટ્રાયલ',
    viewCollection: 'સંગ્રહ જુઓ',
    learnMore: 'વધુ જાણો',
    rightsReserved: 'સર્વાધિકાર સુરક્ષિત.',
    specs: 'વિશેષતાઓ અને વિગતો',
    pricing: 'કિંમત અને પ્લાન',
    contactUs: 'સંપર્ક કરો',
    home: 'હોમ',
    about: 'અમારા વિશે',
    features: 'ખાસિયતો'
  },
  devanagari: {
    addToCart: 'कार्ट में जोड़ें',
    inStock: 'स्टॉक में उपलब्ध · त्वरित डिलीवरी',
    outOfStock: 'स्टॉक समाप्त',
    cart: 'कार्ट',
    checkout: 'चेकआउट करें',
    orderConfirmed: 'ऑर्डर कन्फर्म हुआ',
    addedToCartToast: 'कार्ट में सफलतापूर्वक जोड़ा गया',
    search: 'संग्रह में खोजें...',
    allProducts: 'सभी उत्पाद',
    reviews: 'ग्राहक समीक्षाएं',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    subscribe: 'सब्सक्राइब करें',
    emailPlaceholder: 'अपना ईमेल पता दर्ज करें...',
    subscribedSuccess: 'सब्सक्राइब करने के लिए धन्यवाद!',
    announcement: '₹१,५०० से अधिक के ऑर्डर पर मुफ्त एक्सप्रेस डिलीवरी · ३० दिन का ट्रायल',
    viewCollection: 'संग्रह देखें',
    learnMore: 'और जानें',
    rightsReserved: 'सर्वाधिकार सुरक्षित।',
    specs: 'तकनीकी विवरण',
    pricing: 'मूल्य सूची',
    contactUs: 'संपर्क करें',
    home: 'होम',
    about: 'हमारे बारे में',
    features: 'विशेषताएं'
  },
  arabic: {
    addToCart: 'أضف إلى السلة',
    inStock: 'متوفر في المخزون · شحن سريع',
    outOfStock: 'نفدت الكمية',
    cart: 'السلة',
    checkout: 'إتمام الطلب',
    orderConfirmed: 'تم تأكيد الطلب بنجاح',
    addedToCartToast: 'تمت الإضافة إلى سلتك',
    search: 'البحث في المجموعة...',
    allProducts: 'جميع المنتجات',
    reviews: 'تقييمات وآراء العملاء',
    faq: 'الأسئلة الشائعة',
    subscribe: 'اشتراك',
    emailPlaceholder: 'أدخل بريدك الإلكتروني...',
    subscribedSuccess: 'شكراً لاشتراكك معنا!',
    announcement: 'شحن جوي مجاني للطلبات فوق ١٥٠ دولار · تجربة مجانية لمدة ٣٠ يوماً',
    viewCollection: 'تصفح المجموعة',
    learnMore: 'اكتشف المزيد',
    rightsReserved: 'جميع الحقوق محفوظة.',
    specs: 'المواصفات الفنية',
    pricing: 'الأسعار والخطط',
    contactUs: 'اتصل بنا',
    home: 'الرئيسية',
    about: 'من نحن',
    features: 'المميزات'
  },
  cyrillic: {
    addToCart: 'В корзину',
    inStock: 'В наличии · Быстрая доставка',
    outOfStock: 'Нет в наличии',
    cart: 'Корзина',
    checkout: 'Оформить заказ',
    orderConfirmed: 'Заказ успешно оформлен',
    addedToCartToast: 'Товар добавлен в корзину',
    search: 'Поиск по коллекции...',
    allProducts: 'Все товары',
    reviews: 'Отзывы клиентов',
    faq: 'Часто задаваемые вопросы',
    subscribe: 'Подписаться',
    emailPlaceholder: 'Введите ваш email...',
    subscribedSuccess: 'Спасибо за подписку!',
    announcement: 'Бесплатная экспресс-доставка от $150 · 30 дней на возврат',
    viewCollection: 'Смотреть каталог',
    learnMore: 'Подробнее',
    rightsReserved: 'Все права защищены.',
    specs: 'Характеристики',
    pricing: 'Тарифы и цены',
    contactUs: 'Контакты',
    home: 'Главная',
    about: 'О нас',
    features: 'Преимущества'
  }
};

export function getScriptMeta(script = 'latin'): ScriptMeta {
  const key = (script || 'latin').toLowerCase();
  return SCRIPT_CONFIGS[key] || SCRIPT_CONFIGS.latin;
}

export function getLocalizedUI(script = 'latin'): LocalizedUIStrings {
  const key = (script || 'latin').toLowerCase();
  return UI_DICTIONARY[key] || UI_DICTIONARY.latin;
}

interface ScriptTranslations {
  brandName?: string;
  headline: string;
  subtitle: string;
  badge: string;
  primaryAction: string;
  secondaryAction: string;
  sectionTitle: string;
  sectionSubtitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  items: Array<{
    title: string;
    description: string;
    badge?: string;
    specs: string[];
    price?: number;
  }>;
  highlights: Array<{
    label: string;
    title: string;
    description: string;
    stats: { label: string; value: string }[];
  }>;
  quotes: Array<{
    quote: string;
    author: string;
    role: string;
    outlet?: string;
  }>;
  faqs: Array<{ q: string; a: string }>;
}

const CATEGORY_SCRIPT_CONTENT: Record<string, Record<string, ScriptTranslations>> = {
  gujarati: {
    commerce: {
      brandName: 'કોમોરેબી સિરામિક સ્ટુડિયો',
      headline: 'હાથે બનાવેલા માટીના કલાત્મક પાત્રો અને વિશિષ્ટ સંગ્રહ',
      subtitle: 'પરંપરાગત કળા અને આધુનિક ડિઝાઇનનો સુંદર સમન્વય. દરેક વસ્તુ શુદ્ધ કુદરતી માટીમાંથી પ્રેમ અને કાળજીપૂર્વક ઘડાયેલી છે.',
      badge: 'હસ્તકલા વિશેષ સંગ્રહ ૨૦૨૬',
      primaryAction: 'સંગ્રહ જુઓ',
      secondaryAction: 'કારીગરી વિશે જાણો',
      sectionTitle: 'વિશિષ્ટ સિરામિક બનાવટો',
      sectionSubtitle: 'કુદરતી માટી અને ખનિજ ગ્લેઝ સાથે હાથથી તૈયાર કરાયેલા ટેબલવેર અને કલાત્મક પાત્રો.',
      featuresTitle: 'શ્રેષ્ઠ ગુણવત્તા અને પ્રમાણિક કારીગરી',
      featuresSubtitle: 'અમારું દરેક પાત્ર ઉચ્ચ તાપમાને પકવેલું અને પેઢીઓ સુધી ટકી રહે તેવું છે.',
      ctaTitle: 'તમારા ઘર માટે કલાત્મક સિરામિક પસંદ કરો',
      ctaSubtitle: 'સમગ્ર ભારતમાં સુરક્ષિત અને મફત ડિલિવરી ઉપલબ્ધ છે.',
      items: [
        {
          title: 'હાથે બનાવેલ સિરામિક ટી સેટ',
          description: 'જાપાની પદ્ધતિથી તૈયાર ક્યોટો ટી સેટ. કુદરતી ગ્લેઝ સાથે ૪ કપ અને ટીપોટ.',
          badge: 'બેસ્ટ સેલર',
          specs: ['કુદરતી ક્લે', '૧૨૫૦° સેલ્સિયસ ફાયર્ડ', 'માઇક્રોવેવ સેફ', 'ફૂડ ગ્રેડ ગ્લેઝ'],
          price: 1850
        },
        {
          title: 'ક્લે કારાફે અને વોટર જગ',
          description: 'નેચરલ મિનરલ ગ્લેઝ સાથેનું માટીનું પાત્ર જે પાણીને કુદરતી રીતે ઠંડુ અને સુગંધિત રાખે છે.',
          badge: 'નવો ડ્રોપ',
          specs: ['૧.૨ લીટર ક્ષમતા', 'હાથથી ઘડેલું હેન્ડલ', 'ખનિજ પિગમેન્ટ', 'ઈકો-ફ્રેન્ડલી'],
          price: 2400
        },
        {
          title: 'ટેરાકોટા આર્કિટેક્ચરલ વાઝ',
          description: 'આધુનિક લિવિંગ સ્પેસ માટે ભવ્ય ટેરાકોટા ફ્લાવર વાઝ. અનોખી બનાવટ.',
          badge: 'લિમિટેડ એડિશન',
          specs: ['૩૫ સેમી ઊંચાઈ', 'વોટરપ્રૂફ ઇનર સીલ', 'મેટે ટેક્સચર', 'યુનિક શેપ'],
          price: 1650
        },
        {
          title: 'સ્ટોનવેર ડાઇનિંગ બાઉલ સેટ',
          description: 'રોજિંદા ઉપયોગ માટે ટકાઉ માટીના ૪ બાઉલ્સનો સેટ. ઉત્કૃષ્ટ ફિનિશિંગ.',
          badge: 'રસોઈ સ્પેશિયલ',
          specs: ['૪ પીસ સેટ', 'ડીશવોશર સેફ', 'સ્ક્રેચ રેઝિસ્ટન્ટ', 'ઓર્ગેનિક શેડ'],
          price: 2100
        }
      ],
      highlights: [
        {
          label: '૧૦૦% શુદ્ધ માટી',
          title: 'કુદરતી ખનિજ માટીનો ઉપયોગ',
          description: 'કોઈપણ કૃત્રિમ રસાયણ કે સીસા (Lead) વગર માત્ર શુદ્ધ કુદરતી નદી-માટીમાંથી બનાવેલ.',
          stats: [{ label: 'શુદ્ધતા', value: '૧૦૦%' }, { label: 'તાપમાન', value: '૧૨૫૦°C' }, { label: 'આયુષ્ય', value: 'આજીવન' }]
        },
        {
          label: 'પરંપરાગત ચાકડો',
          title: 'કુશળ કારીગરો દ્વારા નિર્માણ',
          description: 'દરેક પાત્ર અનુભવી કુંભાર દ્વારા ચાકડા પર એક-એક કરીને હાથથી ઘડવામાં આવે છે.',
          stats: [{ label: 'હાથથી નિર્મિત', value: '૧૦૦%' }, { label: 'કારીગર અનુભવ', value: '૨૫+ વર્ષ' }, { label: 'યુનિકનેસ', value: 'પ્રત્યેક પાત્ર' }]
        },
        {
          label: 'ટકાઉપણું',
          title: 'માઇક્રોવેવ અને ડીશવોશર સુરક્ષિત',
          description: 'ઉચ્ચ તાપમાને પકવેલા હોવાથી રોજિંદા ગરમ ખોરાક, ઓવન અને વોશિંગ માટે સંપૂર્ણ સલામત છે.',
          stats: [{ label: 'વોટર એબ્સોર્પશન', value: '<૦.૫%' }, { label: 'ગરમી સહનશક્તિ', value: '૩૦૦°C' }, { label: 'ફૂડ ગ્રેડ', value: 'પ્રમાણિત' }]
        },
        {
          label: 'સુરક્ષિત પેકિંગ',
          title: 'ઝીરો-બ્રેકેજ ડિલિવરી ગેરંટી',
          description: '૧૦૦% ઈકો-ફ્રેન્ડલી અને રિસાયકલ કરી શકાય તેવા પેકિંગ સાથે સુરક્ષિત તમારા દ્વાર સુધી.',
          stats: [{ label: 'ડિલિવરી સમય', value: '૩-૫ દિવસ' }, { label: 'રિપ્લેસમેન્ટ', value: 'મફત' }, { label: 'ગ્રાહક સંતોષ', value: '૯૯.૮%' }]
        }
      ],
      quotes: [
        { quote: 'આ સિરામિક વાસણોની ગુણવત્તા અને કળા અદ્ભુત છે. અમારા ઘરમાં બધાને ખૂબ ગમ્યા.', author: 'પ્રિયા શાહ', role: 'ઇન્ટિરિયર ડિઝાઇનર', outlet: 'અમદાવાદ ટાઇમ્સ' },
        { quote: 'હાથે બનાવેલા વાસણોમાં જે કુદરતી સુગંધ અને સુંદરતા છે તે બજારમાં ક્યાંય નથી મળતી.', author: 'હર્ષ પટેલ', role: 'આર્કિટેક્ટ', outlet: 'ગુજરાત ડિઝાઇન રિવ્યુ' },
        { quote: 'રોજ સવારે આ કપમાં ચા પીવાનો અનુભવ એકદમ અનોખો અને તાજગીભર્યો છે.', author: 'મેઘા દેસાઈ', role: 'સિરામિક કલેક્ટર', outlet: 'લાઇફસ્ટાઇલ ગુજરાત' }
      ],
      faqs: [
        { q: 'શું આ વાસણો રોજિંદા ઉપયોગ માટે સુરક્ષિત છે?', a: 'હા, આ બધા જ વાસણો ૧૨૫૦° સેલ્સિયસ તાપમાને પકવેલા છે અને માઇક્રોવેવ તેમજ ડીશવોશર સેફ છે.' },
        { q: 'ઓર્ડર મળવામાં કેટલો સમય લાગે છે?', a: 'સમગ્ર ગુજરાત અને ભારતમાં ૩ થી ૫ દિવસમાં સુરક્ષિત અને ઈન્શ્યોર્ડ પેકિંગ સાથે ડિલિવરી કરવામાં આવે છે.' },
        { q: 'જો ટ્રાન્સપોર્ટમાં નુકસાન થાય તો શું?', a: 'અમે ૧૦૦% સેફ ડિલિવરી ગેરંટી આપીએ છીએ. જો કોઈ નુકસાન થાય તો વિના મૂલ્યે નવો પીસ મોકલવામાં આવશે.' },
        { q: 'શું કસ્ટમ ઓર્ડર અથવા ગિફ્ટિંગ ઉપલબ્ધ છે?', a: 'હા, લગ્ન, કોર્પોરેટ ગિફ્ટિંગ અથવા કસ્ટમ ડિઝાઇન્સ માટે અમારો સંપર્ક કરી શકો છો.' }
      ]
    },
    saas: {
      brandName: 'સિનૅપ્સ ડેટા ફ્લો પ્લેટફોર્મ',
      headline: 'આધુનિક એન્જિનિયરિંગ ટીમો માટે ઓટોમેટેડ ડેટા અને એઆઈ રનટાઇમ',
      subtitle: 'ઝીરો-ડાઉનટાઇમ સાથે ડેટા ટ્રાન્સફોર્મેશન, રીઅલ-ટાઇમ ટેલિમેટ્રી અને સ્કેલેબલ ક્લાઉડ પાઇપલાઇન્સ.',
      badge: 'એન્ટરપ્રાઇઝ ક્લાઉડ પ્લેટફોર્મ',
      primaryAction: 'મફત ટ્રાયલ શરૂ કરો',
      secondaryAction: 'લાઈવ ડેમો જુઓ',
      sectionTitle: 'પ્લેટફોર્મ સુવિધાઓ',
      sectionSubtitle: 'હાઇ-સ્કેલ ડેટા પ્રોસેસિંગ અને ઓટોમેટેડ એઆઈ એજન્ટ વર્કફ્લોઝ.',
      featuresTitle: 'રીઅલ-ટાઇમ સિસ્ટમ પર્ફોર્મન્સ',
      featuresSubtitle: '૯૯.૯૯૮% એસએલએ ગેરંટી અને સબ-૧૦૦ મિલીસેકન્ડ રિસ્પોન્સ ટાઇમ.',
      ctaTitle: 'આજે જ તમારું ક્લાઉડ ઇન્ફ્રાસ્ટ્રક્ચર આધુનિક બનાવો',
      ctaSubtitle: '૧૪ દિવસનો મફત પ્રીમિયમ ટ્રાયલ · કોઈ ક્રેડિટ કાર્ડ જરૂરી નથી.',
      items: [
        { title: 'એઆઈ કોપાયલટ એન્જિન', description: 'કોડબેઝ વિશ્લેષણ અને ઓટોમેટેડ ટેસ્ટિંગ માટે સ્માર્ટ એઆઈ વર્કફ્લો.', specs: ['સબ-૧૦૦ms લેટન્સી', 'મલ્ટી-મોડલ', 'ઝીરો ડેટા લીક'], price: 49 },
        { title: 'રીઅલ-ટાઇમ ટેલિમેટ્રી', description: 'ગ્લોબલ એજ ક્લસ્ટર્સ પર ૧૪ms p99 લેટન્સી સાથે લાઈવ મોનિટરિંગ.', specs: ['૯૯.૯૯૮% SLA', 'ઓટો-સ્કેલિંગ', 'ઇન્સ્ટન્ટ એલર્ટ્સ'], price: 99 },
        { title: 'ઓટોમેટેડ API ગેટવે', description: 'REST, GraphQL અને વેબહુક્સ માટે હાઇ-પરફોર્મન્સ સુરક્ષિત ગેટવે.', specs: ['એન્ડ-ટુ-એન્ડ એન્ક્રિપ્શન', 'રેટ લિમિટિંગ', 'SDK સપોર્ટ'], price: 149 }
      ],
      highlights: [
        { label: 'સ્પીડ', title: 'અત્યંત ઝડપી પ્રોસેસિંગ', description: 'ડેટા પાઇપલાઇન્સ મિલિસેકન્ડ્સમાં પ્રક્રિયા કરે છે.', stats: [{ label: 'p99 લેટન્સી', value: '૧૪ms' }, { label: 'થ્રુપુટ', value: '૧૦M/sec' }] }
      ],
      quotes: [{ quote: 'આ પ્લેટફોર્મથી અમારી ટીમનો ડિપ્લોયમેન્ટ સમય ૭૦% ઘટી ગયો છે.', author: 'ભાવિન મહેતા', role: 'વીપી ઓફ એન્જિનિયરિંગ' }],
      faqs: [{ q: 'શું આ પ્લેટફોર્મ સુરક્ષિત છે?', a: 'હા, SOC 2 Type II અને એન્ડ-ટુ-એન્ડ AES-256 એન્ક્રિપ્શન સાથે પ્રમાણિત છે.' }]
    }
  },
  devanagari: {
    commerce: {
      brandName: 'कोमोरेबी सिरेमिक स्टूडियो',
      headline: 'हस्तनिर्मित कलात्मक कृतियां और उत्कृष्ट सिरेमिक संग्रह',
      subtitle: 'पारंपरिक शिल्प कौशल और आधुनिक डिजाइन का सुंदर संगम। हर उत्पाद शुद्ध प्राकृतिक मिट्टी से प्रेम और लगन से निर्मित।',
      badge: 'हस्तशिल्प विशेष संग्रह २०२६',
      primaryAction: 'संग्रह देखें',
      secondaryAction: 'कारीगरी के बारे में जानें',
      sectionTitle: 'विशिष्ट सिरेमिक कृतियां',
      sectionSubtitle: 'प्राकृतिक मिट्टी और खनिज ग्लेज़ के साथ हाथ से तैयार किए गए कलात्मक बर्तन।',
      featuresTitle: 'उत्कृष्ट गुणवत्ता और प्रमाणिक शिल्प',
      featuresSubtitle: 'हमारा प्रत्येक उत्पाद उच्च तापमान पर पका और पीढ़ियों तक चलने वाला है।',
      ctaTitle: 'अपने घर के लिए सुंदर सिरेमिक चुनें',
      ctaSubtitle: 'पूरे भारत में सुरक्षित और मुफ्त डिलीवरी उपलब्ध।',
      items: [
        {
          title: 'हस्तनिर्मित सिरेमिक टी सेट',
          description: 'जापानी शैली में निर्मित क्योटो टी सेट। प्राकृतिक ग्लेज़ के साथ ४ कप और टीपॉट।',
          badge: 'बेस्ट सेलर',
          specs: ['प्राकृतिक क्ले', '१२५०°C पर पकाया गया', 'माइक्रोवेव सेफ', 'फूड ग्रेड ग्लेज़'],
          price: 1850
        },
        {
          title: 'क्ले काराफे और वाटर जग',
          description: 'प्राकृतिक मिनरल ग्लेज़ से युक्त मिट्टी का पात्र जो पानी को प्राकृतिक रूप से ठंडा रखता है।',
          badge: 'नया आगमन',
          specs: ['१.२ लीटर क्षमता', 'हाथ से बना हैंडल', 'खनिज पिगमेंट', 'पर्यावरण अनुकूल'],
          price: 2400
        },
        {
          title: 'टेराकोटा आर्किटेक्चरल फूलदान',
          description: 'आधुनिक लिविंग स्पेस के लिए भव्य टेराकोटा फूलदान। अद्वितीय कलात्मक बनावट।',
          badge: 'सीमित संस्करण',
          specs: ['३५ सेमी ऊंचाई', 'वाटरप्रूफ सील', 'मैट फिनिश', 'अनोखा आकार'],
          price: 1650
        },
        {
          title: 'स्टोनवेयर डाइनिंग बाउल सेट',
          description: 'दैनिक उपयोग के लिए मजबूत मिट्टी के ४ कटोरियों का सेट। उत्कृष्ट फिनिशिंग।',
          badge: 'रसोई स्पेशल',
          specs: ['४ पीस सेट', 'डिशवॉशर सेफ', 'स्क्रैच प्रतिरोधी', 'प्राकृतिक शेड'],
          price: 2100
        }
      ],
      highlights: [
        {
          label: '१००% शुद्ध मिट्टी',
          title: 'प्राकृतिक खनिज मिट्टी का उपयोग',
          description: 'बिना किसी हानिकारक रसायन या सीसा (Lead) के विशुद्ध प्राकृतिक मिट्टी से निर्मित।',
          stats: [{ label: 'शुद्धता', value: '१००%' }, { label: 'तापमान', value: '१२५०°C' }, { label: 'आयु', value: 'आजीवन' }]
        },
        {
          label: 'पारंपरिक चाक',
          title: 'कुशल कारीगरों द्वारा निर्माण',
          description: 'प्रत्येक पात्र अनुभवी कुम्हार द्वारा चाक पर एक-एक करके हाथ से गढ़ा जाता है।',
          stats: [{ label: 'हस्तनिर्मित', value: '१००%' }, { label: 'अनुभव', value: '२५+ वर्ष' }, { label: 'विशिष्टता', value: 'प्रत्येक कृति' }]
        }
      ],
      quotes: [
        { quote: 'इन बर्तनों की बनावट और सुंदरता अद्भुत है। हमारे घर में सभी को बहुत पसंद आए।', author: 'राहुल शर्मा', role: 'इंटीरियर डिजाइनर', outlet: 'डिजाइन इंडिया' }
      ],
      faqs: [
        { q: 'क्या यह बर्तन दैनिक उपयोग के लिए सुरक्षित हैं?', a: 'हाँ, यह सभी उत्पाद १२५०°C पर पके हैं और माइक्रोवेव व डिशवॉशर सुरक्षित हैं।' }
      ]
    }
  },
  arabic: {
    commerce: {
      brandName: 'استوديو كوموريبي للخزف الفاخر',
      headline: 'تحف خزفية يدوية وتصميمات معمارية راقية تدوم لأجيال',
      subtitle: 'تناغم مثالي بين الحرف اليدوية التراثية والجماليات المعاصرة. كل قطعة مصنوعة بعناية فائقة من الطين الطبيعي النقي.',
      badge: 'مجموعة فنية حصرية ٢٠٢٦',
      primaryAction: 'تصفح المجموعة',
      secondaryAction: 'اكتشف قصة الحرفة',
      sectionTitle: 'روائع الخزف الحجري المصنوع يدوياً',
      sectionSubtitle: 'أواني وأطباق خزفية فاخرة مطلية بمعادن طبيعية بتشطيبات هادئة وراقية.',
      featuresTitle: 'براعة الصناعة وجودة تدوم طويلاً',
      featuresSubtitle: 'قطعنا الخزفية تُطهى في درجات حرارة فائقة لتتحمل الاستخدام اليومي لأجيال.',
      ctaTitle: 'أضف لمسة فنية دافئة إلى منزلك اليوم',
      ctaSubtitle: 'شحن مجاني وسريع ومؤمن بالكامل لجميع أنحاء العالم.',
      items: [
        {
          title: 'طقم شاي خزفي يدوي الصنع',
          description: 'طقم شاي كلاسيكي مستوحى من التقاليد اليابانية يضم ٤ أكواب وإبريقاً أنيقاً.',
          badge: 'الأكثر مبيعاً',
          specs: ['طين طبيعي ١٠٠٪', 'مطهو بدرجة ١٢٥٠ مئوية', 'آمن للاستخدام الغذائي', 'آمن في الميكروويف'],
          price: 85
        },
        {
          title: 'إبريق ماء من الخزف الحجري',
          description: 'إبريق ماء بطلاء معدني ناعم يحافظ على برودة وانتعاش الماء بشكل طبيعي.',
          badge: 'إصدار جديد',
          specs: ['سعة ١.٢ لتر', 'مقبض مريح يدوي', 'ألوان معدنية طبيعية', 'صديق للبيئة'],
          price: 95
        },
        {
          title: 'مزهرية تيراكوتا معمارية',
          description: 'مزهرية بتصميم نحتي مائل يضفي لمسة عصرية فخمة على المساحات الداخلية.',
          badge: 'إصدار محدود',
          specs: ['ارتفاع ٣٥ سم', 'عازلة للماء من الداخل', 'ملمس مطفي ناعم', 'شكل هندسي فريد'],
          price: 75
        },
        {
          title: 'مجموعة أطباق طعام حجرية',
          description: 'مجموعة من ٤ أوعية طعام متينة ومصقولة بعناية للاستخدام اليومي الراقي.',
          badge: 'أساسيات المائدة',
          specs: ['مجموعة من ٤ قطع', 'آمنة في غسالة الصحون', 'مقاومة للخدش', 'ألوان ترابية'],
          price: 110
        }
      ],
      highlights: [
        {
          label: 'طين طبيعي ١٠٠٪',
          title: 'معادن طينية نقية وغير معالجة',
          description: 'خالية تماماً من الرصاص والمواد الكيميائية الصناعية لسلامتك الكاملة.',
          stats: [{ label: 'النقاء', value: '١٠٠٪' }, { label: 'حرارة الحرق', value: '١٢٥٠°م' }, { label: 'الضمان', value: 'مدى الحياة' }]
        },
        {
          label: 'صناعة يدوية',
          title: 'تشكيل حرفي متقن على عجلة الفخار',
          description: 'تُشكل كل قطعة على حدة بأيدي حرفيين يمتلكون عقوداً من الخبرة الأصيلة.',
          stats: [{ label: 'يدوي الصنع', value: '١٠٠٪' }, { label: 'خبرة الحرفي', value: '+٢٥ عاماً' }, { label: 'التفرد', value: 'كل قطعة' }]
        }
      ],
      quotes: [
        { quote: 'جودة الخزف وتفاصيله الحرفية لا تضاهى، أضافت جمالاً استثنائياً لمائدتنا.', author: 'أمينة المنصوري', role: 'مهندسة تصميم داخلي', outlet: 'مجلة التصميم العربي' }
      ],
      faqs: [
        { q: 'هل المنتجات آمنة لغسالة الصحون والميكروويف؟', a: 'نعم، نظراً لطهيها في درجة حرارة ١٢٥૦ مئوية، فإن جميع منتجاتنا آمنة تماماً.' }
      ]
    }
  },
  cyrillic: {
    commerce: {
      brandName: 'Студия Керамики Комореби',
      headline: 'Авторская керамика ручной работы и коллекционные объекты',
      subtitle: 'Гармония традиционного гончарного искусства и современной минималистичной эстетики. Каждое изделие создано вручную из натуральной глины.',
      badge: 'Коллекционный выпуск 2026',
      primaryAction: 'Смотреть каталог',
      secondaryAction: 'О мастерской',
      sectionTitle: 'Избранные керамические изделия',
      sectionSubtitle: 'Посуда и интерьерные объекты из каменной керамики с минеральными глазурями.',
      featuresTitle: 'Безупречное ремесленное качество',
      featuresSubtitle: 'Обжиг при температуре 1250°C гарантирует прочность на десятилетия.',
      ctaTitle: 'Выберите уникальную керамику для вашего дома',
      ctaSubtitle: 'Бережная и застрахованная доставка в оригинальной эко-упаковке.',
      items: [
        {
          title: 'Керамический чайный сервиз ручной работы',
          description: 'Японский чайный набор: чайник и 4 пиалы с текстурной минеральной глазурью.',
          badge: 'Хит продаж',
          specs: ['100% глина', 'Обжиг 1250°C', 'Безопасно для микроволновки', 'Пищевая глазурь'],
          price: 85
        },
        {
          title: 'Графин для воды из каменной керамики',
          description: 'Сохраняет природную свежесть и прохладу напитков благодаря натуральной пористой структуре.',
          badge: 'Новинка',
          specs: ['Объем 1.2 л', 'Эргономичная ручка', 'Минеральный оттенок', 'Экологично'],
          price: 95
        },
        {
          title: 'Архитектурная терракотовая ваза',
          description: 'Скульптурная ваза ручной лепки для сухоцветов и современных интерьеров.',
          badge: 'Лимитированная серия',
          specs: ['Высота 35 см', 'Водонепроницаемое покрытие', 'Матовая текстура', 'Уникальная форма'],
          price: 75
        },
        {
          title: 'Набор столовых чаш из каменной керамики',
          description: '4 универсальные чаши для сервировки и ежедневного использования.',
          badge: 'Выбор шефа',
          specs: ['Набор из 4 шт', 'Можно мыть в посудомойке', 'Устойчиво к сколам', 'Природный тон'],
          price: 110
        }
      ],
      highlights: [
        {
          label: 'Натуральная глина',
          title: 'Чистые минеральные компоненты',
          description: 'Полное отсутствие свинца и вредных примесей. Только сертифицированные пищевые глазури.',
          stats: [{ label: 'Чистота', value: '100%' }, { label: 'Температура обжига', value: '1250°C' }, { label: 'Срок службы', value: 'Бессрочно' }]
        }
      ],
      quotes: [
        { quote: 'Потрясающая тактильность и благородные цвета. Пить утренний кофе из этих чашек — истинное удовольствие.', author: 'Елена Васильева', role: 'Дизайнер интерьеров', outlet: 'Архитектурный Вестник' }
      ],
      faqs: [
        { q: 'Можно ли использовать изделия в микроволновой печи?', a: 'Да, благодаря высокотемпературному обжигу вся посуда термостойка и безопасна для СВЧ и посудомоечных машин.' }
      ]
    }
  }
};

/**
 * Localizes resolved genre content based on the selected language script.
 * If script is 'latin' or unknown, returns the base content unaltered.
 */
export function localizeGenreContent(
  baseContent: ResolvedGenreContent,
  script = 'latin',
  category: CategoryId = 'commerce',
  customBrandName?: string | null
): ResolvedGenreContent & { ui: LocalizedUIStrings; scriptMeta: ScriptMeta } {
  const scriptKey = (script || 'latin').toLowerCase();
  const scriptMeta = getScriptMeta(scriptKey);
  const ui = getLocalizedUI(scriptKey);

  if (scriptKey === 'latin' || !CATEGORY_SCRIPT_CONTENT[scriptKey]) {
    return {
      ...baseContent,
      ui,
      scriptMeta
    };
  }

  const scriptCategoryContent = CATEGORY_SCRIPT_CONTENT[scriptKey]?.[category] || CATEGORY_SCRIPT_CONTENT[scriptKey]?.commerce;

  if (!scriptCategoryContent) {
    return {
      ...baseContent,
      ui,
      scriptMeta
    };
  }

  // Preserve user custom brand name if entered, else use authentic localized brand
  const effectiveBrandName = customBrandName && customBrandName.trim().length > 0 && customBrandName !== 'Ceramics Atelier' && customBrandName !== 'Komorebi Studio & Ceramics' && customBrandName !== 'Untitled Project'
    ? customBrandName
    : (scriptCategoryContent.brandName || baseContent.brandName);

  // Map items with localized text and fallback image/id
  const localizedItems = (scriptCategoryContent.items || []).map((tItem, idx) => {
    const baseItem = baseContent.items[idx] || baseContent.items[0];
    return {
      ...baseItem,
      id: baseItem?.id || `item-${idx}`,
      title: tItem.title,
      description: tItem.description,
      badge: tItem.badge || baseItem?.badge,
      specs: tItem.specs || baseItem?.specs,
      price: tItem.price || baseItem?.price,
      image: baseItem?.image || '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg'
    };
  });

  const localizedHighlights = (scriptCategoryContent.highlights || []).map((tHl, idx) => {
    const baseHl = baseContent.highlights[idx] || baseContent.highlights[0];
    return {
      ...baseHl,
      id: baseHl?.id || `highlight-${idx}`,
      label: tHl.label,
      title: tHl.title,
      description: tHl.description,
      stats: tHl.stats || baseHl?.stats
    };
  });

  const localizedQuotes = (scriptCategoryContent.quotes || []).map((tQ, idx) => {
    const baseQ = baseContent.quotes[idx] || baseContent.quotes[0];
    return {
      ...baseQ,
      quote: tQ.quote,
      author: tQ.author,
      role: tQ.role,
      outlet: tQ.outlet || baseQ?.outlet
    };
  });

  return {
    ...baseContent,
    brandName: effectiveBrandName,
    headline: scriptCategoryContent.headline || baseContent.headline,
    subtitle: scriptCategoryContent.subtitle || baseContent.subtitle,
    badge: scriptCategoryContent.badge || baseContent.badge,
    primaryAction: scriptCategoryContent.primaryAction || baseContent.primaryAction,
    secondaryAction: scriptCategoryContent.secondaryAction || baseContent.secondaryAction,
    sectionTitle: scriptCategoryContent.sectionTitle || baseContent.sectionTitle,
    sectionSubtitle: scriptCategoryContent.sectionSubtitle || baseContent.sectionSubtitle,
    featuresTitle: scriptCategoryContent.featuresTitle || baseContent.featuresTitle,
    featuresSubtitle: scriptCategoryContent.featuresSubtitle || baseContent.featuresSubtitle,
    ctaTitle: scriptCategoryContent.ctaTitle || baseContent.ctaTitle,
    ctaSubtitle: scriptCategoryContent.ctaSubtitle || baseContent.ctaSubtitle,
    items: localizedItems.length > 0 ? localizedItems : baseContent.items,
    highlights: localizedHighlights.length > 0 ? localizedHighlights : baseContent.highlights,
    quotes: localizedQuotes.length > 0 ? localizedQuotes : baseContent.quotes,
    faqs: scriptCategoryContent.faqs && scriptCategoryContent.faqs.length > 0 ? scriptCategoryContent.faqs : baseContent.faqs,
    ui,
    scriptMeta
  };
}
