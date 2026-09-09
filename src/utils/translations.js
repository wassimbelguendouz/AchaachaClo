export const translations = {
  fr: {
    appName: "AchaachaClo",
    tagline: "Transport DiniM3ak & Service Clondista",
    clientRole: "Client (Passager)",
    driverRole: "Transporteur (Chauffeur)",
    switchRole: "Changer de mode",
    backBtn: "Retour",

    // Phone Validation Error
    invalidPhoneError: "Le numéro de téléphone doit comporter exactement 10 chiffres et commencer par 05, 06 ou 07 (ex: 0661234567).",
    
    // Departure Time Feature (Client & Driver)
    departureTimeLabel: "Heure de démarrage (Départ)",
    departureTimePlaceholder: "HH:MM (ex: 08:30)",
    departureTimeBadge: "Heure client :",
    driverTimeBadge: "Heure chauffeur :",
    driverTimeInputLabel: "Heure de départ proposée par vous (Chauffeur)",
    finalAgreedTimeLabel: "Heure finale réglée :",
    setFinalTimeBtn: "Régler l'heure finale ⏰",
    enterFinalTimeTitle: "Règlement de l'heure finale de départ",
    confirmFinalTime: "Confirmer l'heure finale",

    // Chat Time Notice
    chatTimeNotice: "Proposition d'heures (Client vs Chauffeur) :",
    quickTimeCheck: "Est-ce que l'heure de départ vous convient ?",
    quickTime15Min: "Je peux partir dans 15 min !",
    quickTimeShift: "Est-ce qu'on peut décaler de 30 min ?",
    quickTimeConfirmed: "Heure de départ réglée et confirmée ! ⏰",

    // Account Manager
    selectAccountTitle: "Sélectionnez votre compte",
    selectAccountSubtitle: "Choisissez un compte existant ou créez-en un nouveau",
    createNewAccount: "Créer un nouveau compte ➕",
    switchAccountBtn: "Changer / Gérer les comptes",
    emptyDbBtn: "Vider la base de données 🗑️",
    emptyDbConfirm: "Êtes-vous sûr de vouloir vider toute la base de données (comptes, transporteurs et courses) ?",
    noAccountsYet: "Aucun compte créé pour le moment. Veuillez créer votre premier compte !",

    // Onboarding
    welcomeTitle: "Bienvenue sur AchaachaClo",
    welcomeSubtitle: "Créez votre compte pour commencer les trajets",
    lastName: "Nom",
    firstName: "Prénom",
    phone: "Numéro de téléphone (10 chiffres: 05, 06, 07)",
    carModel: "Marque et modèle de voiture",
    totalSeats: "Nombre total de places",
    initialSeats: "Places disponibles actuellement",
    createAccount: "Créer mon compte",
    chooseRole: "Sélectionnez votre rôle",

    // Navigation & Header
    availableSeats: "Places disponibles",
    editSeats: "Modifier mes places",
    myRides: "Mes Trajets",
    messages: "Messagerie",
    activeRide: "Course en cours",

    // Client Search
    searchTitle: "Où souhaitez-vous aller ?",
    sourceLabel: "Lieu de départ (Source)",
    sourcePlaceholder: "Entrez votre point de départ",
    destLabel: "Destination",
    destPlaceholder: "Entrez votre destination",
    searchBtn: "Chercher un transporteur",
    searching: "Recherche des chauffeurs disponibles...",
    noDriversFound: "Aucun transporteur disponible. (La base est vide ou tous les chauffeurs ont 0 place disponible).",
    pleaseRegisterDriverNotice: "Pour tester, créez d'abord un compte Transporteur avec au moins 1 place libre !",
    
    // Drivers List
    availableDrivers: "Liste des transporteurs disponibles",
    driverName: "Transporteur",
    car: "Véhicule",
    phoneNum: "N° Tél",
    seatsLeft: "places libres",
    diniM3akBtn: "diniM3ak 🚗",

    // Driver Decision status per line
    driverDecisionLabel: "Décision du chauffeur :",
    decisionPending: "En attente de décision du chauffeur...",
    decisionAccepted: "Décision : Acceptée avec okRakM3aya ✅",
    decisionCancelled: "Décision : Course annulée / Non validée ❌",
    
    // Seat Selector Modal
    selectSeatsTitle: "Nombre de places souhaité",
    selectSeatsSubtitle: "Choisissez le nombre de places selon la disponibilité",
    confirmBooking: "Confirmer la demande",
    cancel: "Annuler",
    maxAvailableNotice: "Places disponibles maximum :",

    // Client Ride Tracker
    pendingStatus: "Demande envoyée - En attente de confirmation...",
    acceptedStatus: "Réservation acceptée par le transporteur !",
    unitPriceLabel: "Prix unitaire proposé :",
    totalPriceLabel: "Prix total :",
    okRakM3ayaMessage: "Le transporteur a validé avec : okRakM3aya",
    cancelRideBtn: "Annuler ma réservation",
    cancelConfirm: "Êtes-vous sûr de vouloir annuler la course ? Les places seront réattribuées au chauffeur.",

    // Driver Dashboard
    driverDashboardTitle: "Tableau de Bord Transporteur",
    incomingRequests: "Demandes de réservation reçues",
    noRequests: "Aucune nouvelle demande pour le moment.",
    acceptBtn: "okRakM3aya ✅",
    enterUnitPriceTitle: "Validation okRakM3aya",
    enterUnitPriceSubtitle: "Veuillez transmettre le prix unitaire par place et votre heure de départ proposée",
    unitPriceInputLabel: "Prix unitaire par place (DZD / MAD)",
    confirmAccept: "Valider & transmettre le prix",
    
    // Manual seat edit
    manualSeatsTitle: "Réglage par téléphone (Places disponibles)",
    manualSeatsSubtitle: "Modifiez directement vos places libres en cas d'appel téléphonique",
    saveSeats: "Enregistrer les places",

    // Driver Client List & Map
    acceptedClientsList: "Liste des passagers confirmés",
    noAcceptedClients: "Aucun passager confirmé pour l'instant.",
    requestedSeatsCount: "places réservées",
    seeSchemaOnMap: "Voir schéma sur la carte 🗺️",
    schemaTitle: "Itinéraire & Schéma du Trajet",
    passengerInfo: "Informations Passager",
    routeDetails: "Détails du chemin",
    driverPos: "Votre position (Chauffeur)",
    pickupPos: "Point de ramassage (Client)",
    destPos: "Destination finale",
    closeMap: "Fermer la carte",

    // Chat Service
    chatTitle: "Discussion en direct",
    typeMessage: "Tapez votre message...",
    send: "Envoyer",
    quickReplies: "Réponses rapides",
    quickOnWay: "Je suis en route !",
    quickWhereAreYou: "Où êtes-vous exactement ?",
    quickArrived: "Je suis arrivé au point de rendez-vous.",
    quickOk: "D'accord, parfait !",

    // PWA Install
    installApp: "Installer l'application AchaachaClo",
    installBtn: "Installer maintenant",
    
    // Status badges
    statusPending: "En attente",
    statusAccepted: "Acceptée",
    statusCancelled: "Annulée",
    statusCompleted: "Terminée",
  },
  ar: {
    appName: "عشاشقلو",
    tagline: "خدمة النقل ديني معاك والكخونديستا",
    clientRole: "الزبون (الراكب)",
    driverRole: "الناقل (السيارة / الكخونديستا)",
    switchRole: "تغيير الوضعية",
    backBtn: "العودة",

    // Phone Validation Error
    invalidPhoneError: "يجب أن يتكون رقم الهاتف من 10 أرقام ويبدأ بـ 05 أو 06 أو 07 (مثال: 0661234567).",

    // Departure Time Feature (Client & Driver)
    departureTimeLabel: "وقت الانطلاق (ساعة المغادرة)",
    departureTimePlaceholder: "مثال: 08:30",
    departureTimeBadge: "وقت الزبون:",
    driverTimeBadge: "وقت السائق:",
    driverTimeInputLabel: "وقت المغادرة المقترح من طرفك (السائق)",
    finalAgreedTimeLabel: "الوقت النهائي المتفق عليه:",
    setFinalTimeBtn: "تحديد الوقت النهائي ⏰",
    enterFinalTimeTitle: "ضبط الوقت النهائي للانطلاق",
    confirmFinalTime: "تأكيد الوقت النهائي",

    // Chat Time Notice
    chatTimeNotice: "مقارنة الأوقات المقترحة (الزبون vs السائق):",
    quickTimeCheck: "هل يناسبك وقت الانطلاق المحدد؟",
    quickTime15Min: "يمكنني الانطلاق بعد 15 دقيقة!",
    quickTimeShift: "هل يمكن تأخير الوقت بـ 30 دقيقة؟",
    quickTimeConfirmed: "تم ضبط وقت المغادرة النهائي بنجاح! ⏰",

    // Account Manager
    selectAccountTitle: "اختر حسابك للبدء",
    selectAccountSubtitle: "اختر حساباً مسجلاً سابقاً أو أنشئ حساباً جديداً",
    createNewAccount: "إنشاء حساب جديد ➕",
    switchAccountBtn: "تغيير / إدارة الحسابات",
    emptyDbBtn: "تفريغ قاعدة البيانات 🗑️",
    emptyDbConfirm: "هل أنت ألكيد من تفريغ جميع البيانات (الحسابات، السائقين والرحلات)؟",
    noAccountsYet: "لا يوجد أي حساب حالياً. يرجى إنشاء حسابك الأول!",

    // Onboarding
    welcomeTitle: "مرحباً بكم في تطبيق عشاشقلو",
    welcomeSubtitle: "أنشئ حسابك للبدء في حجز وتسهيل الرحلات",
    lastName: "اللقب",
    firstName: "الاسم",
    phone: "رقم الهاتف (10 أرقام تبدأ بـ 05, 06, 07)",
    carModel: "نوع وموديل السيارة",
    totalSeats: "العدد الإجمالي للمقاعد",
    initialSeats: "عدد المقاعد المتوفرة حالياً",
    createAccount: "إنشاء الحساب",
    chooseRole: "اختر نوع الحساب",

    // Navigation & Header
    availableSeats: "المقاعد المتوفرة",
    editSeats: "تعديل المقاعد",
    myRides: "رحلاتي",
    messages: "الرسائل",
    activeRide: "الرحلة الحالية",

    // Client Search
    searchTitle: "إلى أين تريد الذهاب؟",
    sourceLabel: "مكان انطلاق الرحلة (المصدر)",
    sourcePlaceholder: "أدخل مكان الانطلاق",
    destLabel: "الوجهة (المكان المقصود)",
    destPlaceholder: "أدخل مكان الوصول",
    searchBtn: "بحث عن سائق",
    searching: "جاري البحث عن السائقين المتاحين...",
    noDriversFound: "لا يوجد سائقون متاحون حالياً (القاعدة فارغة أو جميع السائقين لديهم 0 مقعد).",
    pleaseRegisterDriverNotice: "للتجربة، قم أولاً بإنشاء حساب ناقل بـ 1 مقعد شاغر على الأقل!",
    
    // Drivers List
    availableDrivers: "قائمة الناقلين المتاحين",
    driverName: "الناقل",
    car: "السيارة",
    phoneNum: "رقم الهاتف",
    seatsLeft: "أماكن شاغرة",
    diniM3akBtn: "ديني معاك 🚗",

    // Driver Decision status per line
    driverDecisionLabel: "قرار السائق :",
    decisionPending: "في انتظار قرار السائق...",
    decisionAccepted: "القرار: تم القبول بنجاح (أوكراك معايا) ✅",
    decisionCancelled: "القرار: رحلة ملغاة / غير مقبولة ❌",

    // Seat Selector Modal
    selectSeatsTitle: "اختر عدد المقاعد المطلوبة",
    selectSeatsSubtitle: "حدد عدد الأماكن حسب الشغور المتاح",
    confirmBooking: "تأكيد الطلب",
    cancel: "إلغاء",
    maxAvailableNotice: "الحد الأقصى للمقاعد المتاحة:",

    // Client Ride Tracker
    pendingStatus: "تم إرسال الطلب - في انتظار قبول السائق...",
    acceptedStatus: "تم قبول الحجز من طرف الناقل!",
    unitPriceLabel: "السعر الفردي المقترح للمقعد:",
    totalPriceLabel: "السعر الإجمالي:",
    okRakM3ayaMessage: "أكد السائق باستعمال: أوكراك معايا (okRakM3aya)",
    cancelRideBtn: "إلغاء الحجز",
    cancelConfirm: "هل أنت ألكيد من إلغاء الرحلة؟ سيتم إعادة المقاعد إلى السائق تلقائياً.",

    // Driver Dashboard
    driverDashboardTitle: "لوحة تحكم الناقل (الكخونديستا)",
    incomingRequests: "طلبات الحجز الواردة",
    noRequests: "لا توجد طلبات جديدة حالياً.",
    acceptBtn: "أوكراك معايا (okRakM3aya) ✅",
    enterUnitPriceTitle: "تأكيد الحجز والإركاب",
    enterUnitPriceSubtitle: "يرجى تحديد السعر الفردي للمقعد ووقت المغادرة المقترح من طرفك",
    unitPriceInputLabel: "السعر الفردي لكل مقعد (د.ج / درهم)",
    confirmAccept: "تأكيد وإرسال السعر",
    
    // Manual seat edit
    manualSeatsTitle: "تعديل المقاعد عبر الهاتف",
    manualSeatsSubtitle: "عدّل عدد المقاعد الشاغرة مباشرة في حالة الحجز الهاتفي",
    saveSeats: "حفظ عدد المقاعد",

    // Driver Client List & Map
    acceptedClientsList: "قائمة الركاب المقبولين",
    noAcceptedClients: "لا يوجد ركاب مقبولون حالياً.",
    requestedSeatsCount: "مقاعد محجوزة",
    seeSchemaOnMap: "عرض الخريطة والمسار 🗺️",
    schemaTitle: "مخطط المسار والطريق على الخريطة",
    passengerInfo: "معلومات الراكب",
    routeDetails: "تفاصيل المسار",
    driverPos: "موقعك (السائق)",
    pickupPos: "مكان انطلاق الراكب",
    destPos: "وجهة الراكب الأخيرة",
    closeMap: "إغلاق الخريطة",

    // Chat Service
    chatTitle: "محادثة مباشرة",
    typeMessage: "اكتب رسالتك هنا...",
    send: "إرسال",
    quickReplies: "ردود سريعة",
    quickOnWay: "راني ف الطريق!",
    quickWhereAreYou: "أين أنت بالضبط؟",
    quickArrived: "وصلت لمكان اللقاء.",
    quickOk: "تمام، حسناً!",

    // PWA Install
    installApp: "تثبيت تطبيق عشاشقلو",
    installBtn: "تثبيت الآن",
    
    // Status badges
    statusPending: "قيد الانتظار",
    statusAccepted: "مقبولة",
    statusCancelled: "ملغاة",
    statusCompleted: "مكتملة",
  }
};
