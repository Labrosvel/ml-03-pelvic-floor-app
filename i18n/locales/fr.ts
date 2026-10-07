const fr = {
  brand: {
    appName: 'PelviPilot',
    clinicName: 'Physiospecialists',
    tagline: 'Pratique du plancher pelvien, guidée en douceur',
    defaultClinicName: 'Physiospecialists',
  },
  common: {
    cancel: 'Annuler',
    reset: 'Réinitialiser',
    done: 'Terminé',
    close: 'Fermer',
    pause: 'Pause',
    resume: 'Reprendre',
    save: 'Enregistrer',
    min: 'min',
    sec: 's',
    reps: 'rép.',
  },
  tabs: {
    home: 'Accueil',
    progress: 'Progrès',
    learn: 'Apprendre',
    settings: 'Réglages',
  },
  navigation: {
    session: 'Séance',
    exercisePlan: 'Programme d’exercices',
    learn: 'Apprendre',
  },
  home: {
    loading: 'Chargement de {{appName}}…',
    welcomeBack: 'Bon retour, {{name}}. Prêt(e) pour la pratique d’aujourd’hui ?',
    today: 'Aujourd’hui',
    sessionsComplete: '{{done}}/{{total}} séances terminées',
    sessionMeta: 'Environ {{minutes}} min · {{squeezes}} contractions · {{plan}}',
    startSession: 'Commencer la séance',
    adjustPlan: 'Ajuster le programme',
    beforeTitle: 'Avant de commencer',
    beforeBody:
      'Videz d’abord votre vessie, puis installez-vous confortablement et détendez-vous. Relâchez la mâchoire et les épaules. Respirez normalement. Contractez vers le haut et vers l’intérieur, puis relâchez complètement pendant le repos. En cas de douleur, arrêtez immédiatement et contactez votre kinésithérapeute.',
  },
  onboarding: {
    eyebrow: 'Bienvenue',
    body:
      'Un compagnon calme pour la pratique du plancher pelvien. Conçu pour suivre à domicile un programme guidé par le kinésithérapeute.',
    clinicLabel: 'Nom du cabinet / kinésithérapeute',
    clinicPlaceholder: 'Physiospecialists',
    nameLabel: 'Nom du patient',
    namePlaceholder: 'ex. Marie Dupont',
    nameHint: 'Le kinésithérapeute le renseigne pour savoir qui a terminé le programme.',
    physioNotifyEmail: 'E-mail d’alerte du kinésithérapeute',
    physioNotifyEmailPlaceholder: 'ex. clinic@example.com',
    physioNotifyEmailHint:
      'Saisissez l’e-mail du cabinet qui doit recevoir les alertes de fin de journée.',
    continue: 'Continuer',
  },
  progress: {
    eyebrow: 'Historique',
    title: 'Progrès',
    subtitle: 'Un relevé simple à partager avec votre kinésithérapeute.',
    today: 'Aujourd’hui',
    last7Days: '7 derniers jours',
    allTime: 'Total',
    recentSessions: 'Séances récentes',
    empty: 'Aucune séance pour l’instant. Terminez votre première séance {{plan}} depuis l’Accueil.',
    sessionMeta: '{{completed}}/{{target}} rép. · {{minutes}} min',
  },
  learn: {
    eyebrow: 'Éducation',
    title: 'Apprendre',
    subtitle:
      'Courts guides pour la pratique à la maison, regroupés comme la clinique les explique. Votre kinésithérapeute décide de ce qui vous concerne.',
    minutes: '{{count}} min',
    minutesRead: '{{count}} min de lecture',
    missing: 'Article introuvable.',
    clinicBasis:
      'Version courte des conseils sur le plancher pelvien publiés sur physiospecialists.gr. Votre kinésithérapeute décide de ce qui vous concerne.',
    sections: {
      practice: 'Pratique',
      bladder: 'Vessie',
      bowel: 'Intestin',
      support: 'Soutien',
      pain: 'Douleur',
      'life-stages': 'Étapes de la vie',
    },
  },
  settings: {
    title: 'Réglages',
    subtitle:
      'Configurez l’appareil de chaque patient. Saisissez l’e-mail du cabinet qui doit recevoir les alertes de fin de journée.',
    clinicName: 'Nom du cabinet',
    clinicPlaceholder: 'Physiospecialists',
    yourName: 'Nom du patient',
    yourNamePlaceholder: 'ex. Marie Dupont',
    yourNameHint: 'Nécessaire pour que les alertes quotidiennes identifient le patient.',
    physioNotifyEmail: 'E-mail d’alerte du kinésithérapeute',
    physioNotifyEmailPlaceholder: 'ex. clinic@example.com',
    physioNotifyEmailHint:
      'Saisissez l’e-mail du kinésithérapeute pour ce cabinet. Laissez vide jusqu’à la configuration — aucune valeur par défaut n’est renseignée.',
    emailNotConfigured:
      'L’envoi d’e-mails n’est pas encore configuré dans cette version. Ajoutez les IDs EmailJS dans constants/notifications.ts et recompilez.',
    testAlert: 'Envoyer un e-mail de test',
    testAlertSentTitle: 'Test envoyé',
    testAlertSentBody: 'Vérifiez la boîte de réception de l’e-mail d’alerte du kinésithérapeute ci-dessus.',
    testAlertFailedTitle: 'Envoi impossible',
    testAlertFailedBody:
      'Vérifiez EmailJS → Email History pour les erreurs. Dans Account → Security, autorisez l’accès API navigateur. Vérifiez aussi les indésirables.',
    testAlertFailedDetail: 'EmailJS a répondu : {{detail}}',
    testAlertMissingEmail: 'Saisissez d’abord un e-mail d’alerte du kinésithérapeute.',
    testAlertSamplePatient: 'Patient de test',
    reminders: 'Rappels',
    remindersExpoGo: 'Disponible dans une installation complète (pas Expo Go)',
    remindersHint: '{{count}} horaires de rappel · un par séance quotidienne',
    remindersSyncHint:
      'Le nombre d’horaires de rappel correspond aux séances par jour de votre programme. Modifiez le programme pour ajouter ou retirer des créneaux.',
    reminderTime: 'Rappel {{n}}',
    reminderPickHint: 'Choisir',
    reminderHour: 'Heure',
    reminderMinute: 'Minute',
    haptics: 'Vibrations',
    sound: 'Signaux sonores',
    soundHint: 'Préparation, contraction/repos lent, tics rapides et fin de séance',
    soundPack: 'Style sonore',
    soundPackHint: 'Touchez un style pour l’aperçu',
    soundPackGentle: 'Doux',
    soundPackChime: 'Carillon',
    soundPackClick: 'Clic',
    language: 'Langue',
    languageSystem: 'Langue de l’appareil',
    languageEn: 'Anglais',
    languageEl: 'Grec',
    languageIt: 'Italien',
    languageEs: 'Espagnol',
    languageFr: 'Français',
    editPlan: 'Modifier le programme d’exercices',
    replayWelcome: 'Revoir l’accueil',
    resetData: 'Réinitialiser les données locales',
    resetTitle: 'Réinitialiser toutes les données ?',
    resetBody:
      'Cela efface les personnalisations du programme, les réglages et l’historique des séances sur cet appareil.',
    disclaimer:
      'PelviPilot accompagne la pratique à domicile entre les rendez-vous de kinésithérapie sous la guidance de votre kinésithérapeute. Tout le monde n’a pas besoin de contractions du plancher pelvien (Kegel) — ne pratiquez que le programme conseillé pour vous. Ce n’est pas un substitut à l’évaluation clinique et il n’est pas affilié à Squeezy ni à aucune autre application commerciale de santé pelvienne. Utilisez-le uniquement selon les indications d’un professionnel qualifié ; l’éditeur décline toute responsabilité en cas de blessure liée à une utilisation sans cette guidance. En cas de douleur, arrêtez immédiatement.',
    privacyPolicy: 'Politique de confidentialité',
    appVersion: 'Version {{version}}',
    webBuild: 'Version web {{id}}',
  },
  privacy: {
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : 30 septembre 2026',
    introTitle: 'Vue d’ensemble',
    introBody:
      'PelviPilot (« l’application ») est un compagnon d’exercices du plancher pelvien. Cette politique explique quelles informations l’application traite sur votre appareil et ce qui peut être envoyé à votre kinésithérapeute lorsque vous terminez votre programme quotidien.',
    dataTitle: 'Informations stockées sur votre appareil',
    dataBody:
      'Selon ce que vous saisissez, l’application peut stocker localement : libellé du nom du cabinet, nom d’affichage facultatif, préférence de langue, préférences son/vibrations, préférences de rappels, horaires personnalisés du programme et historique des séances terminées. Ces informations restent dans le stockage de l’appareil, sauf si vous utilisez des sauvegardes système qui copient les données des applications.',
    permissionsTitle: 'Autorisations',
    permissionsBody:
      'Des notifications peuvent être demandées si vous activez les rappels, afin que l’application affiche des alertes locales. L’application diffuse des signaux sonores pour le timing des exercices ; elle n’enregistre pas le microphone. Les vibrations peuvent s’activer lorsqu’elles sont activées.',
    sharingTitle: 'Partage',
    sharingBody:
      'Lorsque vous terminez toutes les séances requises de la journée, l’application peut envoyer un seul e-mail à l’adresse du kinésithérapeute configurée sur cet appareil. Cet e-mail comprend le nom du patient, le nom du cabinet, le nom du programme, le nombre de séances et la date — pour que votre kinésithérapeute sache qui a terminé son programme quotidien. Nous ne vendons pas d’informations personnelles. L’historique des exercices au-delà de cette alerte quotidienne n’est pas téléversé vers les serveurs de PelviPilot.',
    retentionTitle: 'Conservation et suppression',
    retentionBody:
      'Les données restent sur l’appareil jusqu’à ce que vous les effaciez. Utilisez Réglages → Réinitialiser les données locales pour supprimer les réglages, les personnalisations du programme et l’historique. Désinstaller l’application supprime aussi son stockage local.',
    childrenTitle: 'Enfants',
    childrenBody:
      'PelviPilot est destiné aux adultes suivant un programme convenu avec un kinésithérapeute. Il ne s’adresse pas aux enfants.',
    healthTitle: 'Informations de santé',
    healthBody:
      'PelviPilot accompagne la pratique à domicile entre les rendez-vous sous la guidance de votre kinésithérapeute. Ce n’est pas un dispositif médical, il ne diagnostique pas de pathologies et ne remplace pas l’évaluation clinique. L’éditeur décline toute responsabilité en cas de blessure liée à une utilisation sans guidance professionnelle. En cas de douleur, arrêtez immédiatement et demandez conseil à votre kinésithérapeute ou médecin. Ne l’utilisez pas pour des soins d’urgence.',
    contactTitle: 'Contact',
    contactBody:
      'Pour les questions de confidentialité concernant cette application, contactez l’éditeur via les coordonnées de la fiche Google Play de PelviPilot (ou l’e-mail qui y figure une fois la fiche publiée).',
    changesTitle: 'Modifications',
    changesBody:
      'Nous pouvons mettre à jour cette politique à mesure que le produit évolue. La date « Dernière mise à jour » en haut changera lorsque nous le ferons.',
  },
  plan: {
    intro:
      'Mode kinésithérapeute : adaptez les temps de contraction et les répétitions pour chaque patient.',
    planName: 'Nom du programme',
    sessionsPerDay: 'Séances par jour',
    slowSqueezes: 'Contractions lentes',
    quickSqueezes: 'Contractions rapides',
    squeezeSec: 'Contraction (s)',
    restSec: 'Repos (s)',
    repetitions: 'Répétitions',
    savePlan: 'Enregistrer le programme',
    restoreStarter: 'Restaurer le programme de départ',
    savedTitle: 'Enregistré',
    savedBody: 'Programme d’exercices mis à jour sur cet appareil.',
    missingTitle: 'Valeur manquante',
    missingBody: 'Veuillez saisir un nombre pour {{label}}.',
    invalidTitle: 'Valeur non valide',
    invalidBody: '{{label}} doit être un nombre entier supérieur à 0.',
    defaultName: 'Programme de départ',
    defaultNotes:
      'Une routine de départ douce. Votre kinésithérapeute peut ajuster le temps de contraction, le repos et les répétitions.',
    fieldSessionsPerDay: 'Séances par jour',
    fieldSlowSqueeze: 'Contraction lente (s)',
    fieldSlowRest: 'Repos lent (s)',
    fieldSlowReps: 'Répétitions lentes',
    fieldQuickSqueeze: 'Contraction rapide (s)',
    fieldQuickRest: 'Repos rapide (s)',
    fieldQuickReps: 'Répétitions rapides',
  },
  exercise: {
    niceWork: 'Bravo',
    sessionComplete: 'Séance terminée',
    finishBody:
      'Votre pratique est enregistrée sur cet appareil. La régularité compte plus que l’intensité.',
    prepare: 'Préparation',
    cuePrepare:
      'Videz votre vessie avant. Trouvez une position confortable, détendez-vous, relâchez les épaules et respirez normalement.',
    cueSlowSqueeze: 'Soulevez et fermez doucement vers le haut. Continuez à respirer.',
    cueQuickSqueeze: 'Soulever et fermer rapidement — puis relâchez complètement.',
    cueRest: 'Relâchez complètement. Assouplissez le plancher pelvien et attendez le prochain signal.',
    repOf: '{{current}} sur {{total}}',
  },
  phase: {
    squeeze: 'Contraction',
    rest: 'Repos',
    prepare: 'Préparez-vous',
    done: 'Terminé',
  },
  reminders: {
    title: 'Rappel PelviPilot',
    body: 'C’est l’heure de votre séance de plancher pelvien.',
  },
  notFound: {
    title: 'Oups !',
    body: 'Cet écran n’existe pas.',
    goHome: 'Aller à l’accueil',
  },
  articles: {
    'what-is-pelvic-floor': {
      title: 'Qu’est-ce que le plancher pelvien ?',
      summary: 'Les muscles qui soutiennent la vessie, l’intestin et les organes reproducteurs.',
      imageLabel: 'Schéma des muscles du plancher pelvien',
      imageCredit: 'Illustration : OpenStax Anatomy & Physiology (CC BY 4.0).',
      body: [
        'Le plancher pelvien est un groupe de muscles et de tissu conjonctif qui forme comme un hamac à la base du bassin.',
        'Ces muscles aident à contrôler la vessie et l’intestin, soutiennent les organes pelviens et contribuent à la fonction sexuelle et à la stabilité du tronc.',
        'Comme tout groupe musculaire, ils peuvent s’affaiblir, se tendre ou se coordonner mal. La pratique guidée aide à retrouver conscience et force.',
        'Tout le monde n’a pas besoin de contractions du plancher pelvien (Kegel). Ne pratiquez que le programme conseillé par votre kinésithérapeute.',
      ],
    },
    'how-to-squeeze': {
      title: 'Comment faire une contraction du plancher pelvien',
      summary: 'Un signal clair pour contracter et relâcher sans retenir sa respiration.',
      imageLabel:
        'Schéma montrant les organes pelviens et le soulèvement du plancher pelvien en respirant normalement',
      imageCredit:
        'Illustration : Département des Anciens Combattants / Département de la Défense des États-Unis (domaine public).',
      body: [
        'Imaginez d’arrêter doucement le flux d’urine, ou de retenir un gaz. Soulevez et fermez le plancher pelvien vers le haut et vers l’intérieur.',
        'Gardez les fesses, les cuisses et le ventre aussi détendus que possible. Respirez normalement — ne retenez pas votre souffle.',
        'Contractez selon le compte affiché dans l’application, puis relâchez complètement et reposez-vous. La phase de repos est aussi importante que la contraction.',
        'Si vous n’êtes pas sûr(e) de le faire correctement, demandez à votre kinésithérapeute de vérifier votre technique.',
      ],
    },
    'when-to-practice': {
      title: 'Quand et à quelle fréquence pratiquer',
      summary: 'La régularité compte plus que les longues séances.',
      body: [
        'Des séances courtes et régulières fonctionnent généralement mieux que de longues séances occasionnelles. De nombreux programmes suggèrent plusieurs séances par jour.',
        'Avant chaque séance, videz votre vessie et installez-vous dans une position détendue et confortable.',
        'Pratiquez d’abord dans une position confortable — allongé(e) ou assis(e) — puis passez à la position debout quand vous êtes prêt(e).',
        'Utilisez les rappels pour ancrer l’habitude. Enregistrez les séances pour que vous et votre kinésithérapeute puissiez voir les progrès dans le temps.',
      ],
    },
    'when-to-seek-help': {
      title: 'Quand demander de l’aide',
      summary: 'Cette application soutient la pratique — elle ne remplace pas les soins cliniques.',
      body: [
        'Contactez votre kinésithérapeute ou médecin si les symptômes s’aggravent, si vous avez mal pendant les exercices, ou si vous n’êtes pas sûr(e) de la technique.',
        'Demandez un avis médical urgent en cas de douleur soudaine inexpliquée, de saignement, de fièvre ou de nouveaux symptômes neurologiques.',
        'PelviPilot est un compagnon d’exercices pour votre plan de soins. Ce n’est pas un outil de diagnostic de dispositif médical.',
      ],
    },
    'leakage-is-a-symptom': {
      title: 'Les fuites sont fréquentes, et on peut les aider',
      summary: 'Une petite fuite reste un symptôme, y compris après un accouchement ou avec l’âge.',
      body: [
        'Beaucoup de femmes ont des fuites d’urine à un moment de leur vie, y compris après un accouchement ou en vieillissant. C’est fréquent, et cela reste un symptôme à prendre au sérieux.',
        'Même une petite fuite est un signe que le corps a besoin du bon soutien. Beaucoup de personnes attendent, parce que c’est gênant d’en parler ou parce qu’on leur a dit que c’était normal.',
        'La kinésithérapie du plancher pelvien peut renforcer les muscles, améliorer le contrôle de la vessie et changer des habitudes qui ajoutent de la pression. Ce qui aide dépend d’une évaluation et de la façon dont la fuite se produit.',
        'Suivez seulement le programme défini pour vous dans cette application. Si les fuites sont nouvelles ou s’aggravent, dites-le à votre kinésithérapeute plutôt que d’ajouter des exercices par vous-même.',
      ],
    },
    'kinds-of-leakage': {
      title: 'Les façons dont l’urine peut fuir',
      summary: 'Une toux, une envie soudaine, ou les deux, sont des schémas différents.',
      body: [
        'La fuite à l’effort arrive quand la pression sur la vessie augmente — toux, éternuement, rire ou port de charge — et qu’un peu d’urine s’échappe. Le plancher pelvien ne soutient souvent pas assez la vessie à ce moment-là.',
        'La fuite par urgenturie est un besoin soudain et fort, difficile à retenir jusqu’aux toilettes. Certaines personnes ont les deux. On parle alors de fuites mixtes.',
        'D’autres schémas existent, dont une vessie qui ne se vide pas complètement, ou la difficulté d’atteindre les toilettes pour d’autres raisons physiques. Des muscles faibles ne sont pas la seule cause. Une infection, des médicaments et d’autres maladies peuvent jouer un rôle.',
        'La façon dont la fuite se produit compte, parce que le programme est différent. Votre kinésithérapeute décide si les contractions de cette application vous conviennent.',
      ],
    },
    'urgency-and-frequency': {
      title: 'Y aller souvent, ou devoir y aller tout de suite',
      summary: 'La fréquence et l’urgenturie vont souvent ensemble. Ce n’est pas la même chose.',
      body: [
        'La fréquence signifie que vous urinez plus souvent que d’habitude, le jour ou la nuit. La caféine et d’autres boissons, le fonctionnement de la vessie et d’autres facteurs de santé peuvent changer le rythme. Une fréquence qui dure mérite une évaluation, surtout avec d’autres symptômes.',
        'L’urgenturie est un besoin soudain et fort, difficile à reporter. Certaines personnes décrivent la peur de ne pas arriver aux toilettes. Cette envie peut mener à une fuite avant d’y arriver.',
        'On peut avoir l’un sans l’autre, ou les deux. Une fuite à la toux est encore un autre schéma. Remarquer lequel est le vôtre aide votre kinésithérapeute à choisir l’approche.',
        'L’entraînement de la vessie, des changements de boissons et d’habitudes, et la kinésithérapie du plancher pelvien peuvent aider quand ils correspondent à la cause. Utilisez le programme de cette application seulement s’il a été défini pour vous.',
      ],
    },
    'constipation-and-pelvic-floor': {
      title: 'Constipation et plancher pelvien',
      summary: 'Pousser charge le plancher pelvien. Relâcher compte autant que contracter.',
      body: [
        'La constipation n’est pas seulement un problème d’intestin. Des poussées fortes et répétées augmentent la pression sur le plancher pelvien et sur les tissus qui soutiennent les organes. Avec le temps, cela peut ajouter une sensation de lourdeur en bas du bassin.',
        'Ces muscles doivent se relâcher au bon moment, pas seulement se contracter. Pendant une selle, le plancher pelvien doit lâcher et travailler avec la respiration et les muscles abdominaux. S’il reste tendu, l’évacuation devient plus difficile, l’envie de pousser augmente, et le cycle continue.',
        'Un petit marchepied sous les pieds, pour que les genoux soient un peu plus hauts que les hanches, et une légère inclinaison du tronc vers l’avant peuvent faciliter l’évacuation. Respirez. Évitez de bloquer la respiration et les longues poussées fortes. Allez quand l’envie est là, et ne restez pas longtemps s’il n’y a pas d’envie. Les fibres dans l’alimentation, et la marche régulière, soutiennent l’intestin.',
        'La kinésithérapie du plancher pelvien n’est pas toujours du renforcement. Si les muscles sont tendus ou ne lâchent pas, les contractions seules peuvent être le mauvais choix. Demandez à votre kinésithérapeute avant d’en ajouter. Cette application suit le programme déjà choisi pour vous.',
      ],
    },
    prolapse: {
      title: 'Quand les organes pelviens se sentent moins soutenus',
      summary: 'Une lourdeur, ou la sensation que quelque chose descend.',
      body: [
        'Un prolapsus des organes pelviens, c’est quand les muscles et les ligaments ne soutiennent plus assez la vessie, l’utérus ou l’intestin, et que ces organes descendent. On décrit souvent une lourdeur ou une pression dans le vagin, la sensation que quelque chose descend, une difficulté à vider la vessie ou l’intestin, une douleur lombaire ou pelvienne, ou une gêne pendant les rapports.',
        'Pour beaucoup de femmes avec un prolapsus léger à modéré, la kinésithérapie du plancher pelvien est le point de départ : un programme personnel, apprendre comment les muscles doivent travailler, et des conseils pour la vie quotidienne. Le but est d’alléger les symptômes, d’améliorer le soutien et de ralentir l’aggravation.',
        'Cette application n’évalue pas un prolapsus. Pratiquez seulement le programme donné par votre kinésithérapeute, et dites-le si la lourdeur augmente.',
      ],
    },
    'abdominal-separation': {
      title: 'Un écart entre les muscles abdominaux',
      summary: 'Un écart sur la ligne médiane peut toucher le tronc et le plancher pelvien.',
      body: [
        'La séparation des abdominaux, parfois appelée diastasis, est un élargissement entre les deux muscles droits de l’abdomen le long de la ligne médiane. Elle est fréquente pendant la grossesse et après l’accouchement. Elle peut aussi apparaître quand la pression dans l’abdomen reste élevée, y compris chez les hommes, par exemple après un grand changement de poids ou des efforts répétés.',
        'Ce n’est pas une hernie. Cela peut changer la stabilité ressentie du tronc, le travail du plancher pelvien et les mouvements du quotidien. Certaines personnes remarquent une bosse ou un bombement au milieu de l’abdomen, une sensation de faiblesse, un mal de dos, ou des fuites ou un prolapsus en même temps.',
        'La largeur de l’écart n’est qu’une partie du tableau. La façon dont les muscles se rapprochent, et comment le tronc travaille, compte aussi. Un programme peut inclure l’activation des abdominaux profonds, le plancher pelvien, le contrôle du tronc, la respiration et la gestion de la pression dans l’abdomen.',
        'Reprenez l’exercice comme votre kinésithérapeute le définit. Si vous voyez un bombement, ou si vous avez des symptômes du plancher pelvien, demandez avant d’ajouter un travail abdominal intense par vous-même.',
      ],
    },
    'pelvic-pain': {
      title: 'Douleur pelvienne, et muscles qui ne lâchent pas',
      summary: 'La douleur peut venir de muscles tendus, pas seulement de muscles faibles.',
      body: [
        'La douleur pelvienne peut siéger dans le bassin, le périnée, les organes génitaux ou le bas de l’abdomen. Elle peut être là tout le temps ou aller et venir, et toucher la position assise, les rapports, la vessie ou l’intestin.',
        'Les muscles peuvent travailler trop fort et avoir du mal à se relâcher. La douleur peut aussi suivre une blessure, une opération, des cicatrices ou un accouchement, ou accompagner d’autres maladies. Chez les hommes, elle peut faire partie d’une douleur pelvienne chronique. La cause n’est souvent pas évidente et demande une évaluation.',
        'Les soins pour cette douleur commencent souvent par le relâchement, la respiration et l’apprentissage du fonctionnement du plancher pelvien. Le renforcement s’ajoute seulement quand il est nécessaire. Les contractions ne sont pas le bon premier pas pour tout le monde.',
        'Si vous avez mal pendant les exercices de cette application, arrêtez et contactez votre kinésithérapeute. Une douleur qui dure des mois, ou une douleur avec des symptômes de vessie, d’intestin ou sexuels, demande une évaluation plutôt qu’un programme plus dur.',
      ],
    },
    'pregnancy-and-after-birth': {
      title: 'Grossesse et après l’accouchement',
      summary: 'Le plancher pelvien porte une charge en plus. Les fuites ensuite peuvent s’améliorer.',
      body: [
        'Pendant la grossesse, le plancher pelvien porte une charge supplémentaire. La kinésithérapie à ce moment peut aider pour des problèmes comme le mal de dos et pour la préparation à l’accouchement. Après la naissance, elle fait partie de la récupération.',
        'Les fuites après l’accouchement sont fréquentes. Ce n’est pas quelque chose à accepter comme la nouvelle normalité. Une évaluation et un programme adapté peuvent améliorer le contrôle de la vessie et le soutien.',
        'Un écart des abdominaux, ou une sensation de lourdeur, peut apparaître à la même période. Mentionnez-les pour que le programme couvre le tronc autant que le plancher pelvien.',
        'Utilisez cette application pour le programme à la maison déjà choisi par votre kinésithérapeute. Si vous êtes enceinte ou venez d’accoucher et que ce programme a été défini pour une autre étape, demandez avant de le suivre.',
      ],
    },
    'women-and-men': {
      title: 'Femmes et hommes',
      summary: 'On en parle plus souvent pour les femmes. Les hommes ont aussi besoin de ces soins.',
      body: [
        'Les problèmes de plancher pelvien sont plus souvent associés aux femmes : fuites, prolapsus, douleur pendant les rapports, grossesse, et récupération après une chirurgie gynécologique.',
        'Les hommes ont aussi besoin de ces soins, y compris pour une douleur pelvienne chronique et pour la récupération avant ou après une chirurgie de la prostate. Le but est un programme adapté à cette personne, pour soutenir la guérison et le contrôle de la vessie.',
        'Le travail n’est pas le même pour tout le monde. Certaines personnes doivent renforcer. D’autres doivent relâcher et coordonner. Votre kinésithérapeute définit ce que cette application fait pour vous.',
      ],
    },
    'teenage-leakage': {
      title: 'Fuites à l’adolescence',
      summary: 'Pour les familles. Un adolescent a besoin d’une évaluation médicale avant tout programme d’exercices.',
      body: [
        'Les fuites urinaires peuvent toucher les adolescentes et les adolescents. Elles peuvent être là depuis l’enfance, et affecter l’école, le sport et la confiance. Ce n’est pas un choix, de la paresse, ou un manque d’effort.',
        'Des habitudes qui se construisent parfois autour — retarder les toilettes pendant des heures, boire très peu, ou contracter toute la journée pour éviter une fuite — peuvent rendre plus difficile le travail de la vessie et du plancher pelvien. La constipation compte aussi : un intestin plein peut appuyer sur la vessie.',
        'Un médecin doit évaluer cela avant tout programme de rééducation, surtout si les fuites commencent soudainement après une période sans fuite. La kinésithérapie du plancher pelvien, quand elle est indiquée, vient ensuite et s’adapte à l’âge. Tous les adolescents n’ont pas besoin de renforcement. Certains doivent apprendre à relâcher.',
        'PelviPilot est un compagnon pour un programme d’adulte déjà défini par un kinésithérapeute. Ce n’est pas un programme qu’un adolescent démarre seul. Ne commencez pas des contractions du plancher pelvien pour un jeune sans cette évaluation.',
      ],
    },
  },
} as const;

export default fr;
