import { UserProfile, DayHabitLog, Recipe, ExploreArticle, InjuryRecord, NutritionPlanNote, AthleteData } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '',
  sport: 'taekwondo',
  ageGroup: '18 - 29 a',
  gender: 'Masculino',
  role: 'Deportista',
  beltColor: 'celeste',
  weeklyFrequency: 5,
  sessionDuration: '1 a 2 horas',
  habitualIntensity: 'Moderada',
  habitualSchedule: 'Tarde',
  completedOnboarding: true,
};

export const NUTRI_TIPS = [
  'Comer adecuadamente durante el día ayuda a disponer de energía para entrenar y recuperarse.',
  'La hidratación previa al entrenamiento previene calambres y mejora la concentración hasta en un 25%.',
  'Incluir proteína de calidad en cada tiempo de comida favorece la síntesis y reparación muscular.',
  'Consumir carbohidratos complejos 2 horas antes de entrenar llena tus depósitos de glucógeno.',
  'Dormir al menos 7-8 horas es indispensable para la secreción natural de la hormona de crecimiento.'
];

export const INITIAL_DAY_LOG: DayHabitLog = {
  date: '2026-09-19',
  mood: 'feliz',
  moodNote: 'Me sentí con mucha energía en el combate y buena concentración.',
  meals: {
    desayuno: true,
    merienda_am: false,
    almuerzo: false,
    merienda_pm: false,
    cena: false,
  },
  customMeals: [
    {
      id: 'meal-init-1',
      title: 'Desayuno',
      time: '08:30 am',
      description: 'Huevos revueltos con espinacas frescas, 2 rebanadas de pan tostado integral y café.',
      photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
      createdAt: '2026-09-19T08:30:00.000Z',
    },
  ],
  waterGlasses: 2,
  sleepHours: 7,
  sleepCompleted: true,
  trainingHours: 3,
  trainingCompleted: true,
  restQuality: 'Bueno',
};

// Past logs to support the 5-day streak (15 to 19 Septiembre 2026) as displayed in pages 8 & 9
export const INITIAL_LOGS_HISTORY: Record<string, DayHabitLog> = {
  '2026-09-15': {
    date: '2026-09-15',
    mood: 'feliz',
    moodNote: 'Inicio de semana con gran ritmo y comidas a tiempo.',
    meals: { desayuno: true, merienda_am: true, almuerzo: true, merienda_pm: true, cena: true },
    waterGlasses: 8,
    sleepHours: 8,
    sleepCompleted: true,
    trainingHours: 2,
    trainingCompleted: true,
    restQuality: 'Excelente',
  },
  '2026-09-16': {
    date: '2026-09-16',
    mood: 'estresado',
    moodNote: 'Día largo de estudio pero cumplí con todas mis comidas y el dojo.',
    meals: { desayuno: true, merienda_am: true, almuerzo: true, merienda_pm: true, cena: true },
    waterGlasses: 7,
    sleepHours: 7,
    sleepCompleted: true,
    trainingHours: 2.5,
    trainingCompleted: true,
    restQuality: 'Bueno',
  },
  '2026-09-17': {
    date: '2026-09-17',
    mood: 'pensativo',
    moodNote: 'Probando nueva combinación de carbohidratos antes del entreno técnico.',
    meals: { desayuno: true, merienda_am: true, almuerzo: true, merienda_pm: true, cena: true },
    waterGlasses: 8,
    sleepHours: 7.5,
    sleepCompleted: true,
    trainingHours: 2,
    trainingCompleted: true,
    restQuality: 'Excelente',
  },
  '2026-09-18': {
    date: '2026-09-18',
    mood: 'feliz',
    moodNote: 'Excelente sesión de patadas y buena recuperación post entreno.',
    meals: { desayuno: true, merienda_am: true, almuerzo: true, merienda_pm: true, cena: true },
    waterGlasses: 8,
    sleepHours: 8,
    sleepCompleted: true,
    trainingHours: 3,
    trainingCompleted: true,
    restQuality: 'Excelente',
  },
  '2026-09-19': {
    date: '2026-09-19',
    mood: 'feliz',
    moodNote: 'Quinto día de entrenamiento y registro de hábitos.',
    meals: { desayuno: true, merienda_am: false, almuerzo: false, merienda_pm: false, cena: false },
    customMeals: [
      {
        id: 'meal-init-1',
        title: 'Desayuno',
        time: '08:30 am',
        description: 'Huevos revueltos con espinacas frescas, 2 rebanadas de pan tostado integral y café.',
        photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
        createdAt: '2026-09-19T08:30:00.000Z',
      },
    ],
    waterGlasses: 2,
    sleepHours: 7,
    sleepCompleted: true,
    trainingHours: 3,
    trainingCompleted: true,
    restQuality: 'Bueno',
  },
};

export const RECIPES_DATA: Recipe[] = [];

export const EXPLORE_ARTICLES: ExploreArticle[] = [
  {
    id: 'recetas',
    title: 'Recetas saludables',
    category: 'Popular',
    icon: 'pancakes',
    summary: 'Platos rápidos y nutritivos diseñados por nutricionistas deportivos para antes y después de entrenar.',
    content: [
      'Una correcta alimentación para el deportista no significa comer aburrido ni pasar hambre. La clave está en la densidad nutricional: comidas que aporten vitaminas, minerales, agua y los macronutrientes precisos.',
      'Distribuir los alimentos en 4 a 5 comidas diarias (Desayuno, Merienda AM, Almuerzo, Merienda PM, Cena) evita picos bruscos de insulina, mejora la digestión y mantiene estables los niveles de glucosa durante las prácticas.',
      'En nuestra sección interactiva encontrarás recetas divididas en Desayunos, Meriendas y Almuerzos con tiempos de preparación menores a 25 minutos.'
    ],
    tips: [
      'Planifica tus compras semanales para tener siempre a mano carbohidratos complejos y proteínas.',
      'Evita frituras y salsas comerciales ultraprocesadas antes de una sesión de alta intensidad.',
      'Prioriza comida real e ingredientes frescos.'
    ]
  },
  {
    id: 'merienda',
    title: '¿Por qué merendar?',
    category: 'Popular',
    icon: 'grapes',
    summary: 'Descubre por qué las colaciones a media mañana y media tarde marcan la diferencia en tu energía.',
    content: [
      'Muchos atletas pasan 6 u 8 horas entre el almuerzo y la cena, llegando al entrenamiento fatigados o con hambre excesiva que desemboca en atracones nocturnos.',
      'Las meriendas estratégicas (AM y PM) cumplen dos roles fundamentales: amortiguan el catabolismo muscular y aportan el combustible inmediato que tu cerebro y sistema muscular necesitan antes de iniciar la práctica deportiva.',
      'Una buena merienda pre-entrenamiento debe ser fácil de digerir, baja en grasas saturadas y rica en carbohidratos simples y complejos.'
    ],
    tips: [
      'Consume tu merienda entre 60 y 90 minutos antes de entrenar.',
      'Si tienes poco tiempo, un plátano con una cucharadita de miel o una tostada es ideal.',
      'No olvides acompañar siempre con un vaso de agua fresca.'
    ]
  },
  {
    id: 'macronutrientes',
    title: 'Macronutrientes',
    category: 'Salud',
    icon: 'avocado',
    summary: 'Aprende a balancear Carbohidratos, Proteínas y Grasas según tu deporte e intensidad.',
    content: [
      'Los macronutrientes son los pilares energéticos del cuerpo humano. Para un deportista de combate, resistencia o equipo, los requerimientos varían sustancialmente:',
      '• Carbohidratos (4 kcal/g): Son la fuente primaria de ATP en esfuerzos de media y alta intensidad. Sin ellos, el glucógeno se vacía y aparece la "pájara" o fatiga extrema.',
      '• Proteínas (4 kcal/g): Bloques constructores del tejido muscular, enzimas e inmunoglobulinas. Se recomiendan entre 1.4g y 2.0g por kg de peso corporal.',
      '• Grasas saludables (9 kcal/g): Vitales para el equilibrio hormonal (testosterona, estrógenos), absorción de vitaminas liposolubles (A, D, E, K) y protección celular.'
    ],
    tips: [
      'Regla del plato del atleta: 1/2 carbohidratos en días duros, 1/4 proteína, 1/4 vegetales.',
      'Prefiere grasas insaturadas como aguacate, aceite de oliva y frutos secos.',
      'No elimines ningún macronutriente sin supervisión profesional.'
    ]
  },
  {
    id: 'lesiones',
    title: 'Lesiones y prevención',
    category: 'Ejercicios',
    icon: 'bandage',
    summary: 'Estrategias nutricionales y de calentamiento para proteger tendones, ligamentos y articulaciones.',
    content: [
      'La prevención de lesiones no termina al salir del gimnasio o dojo; la nutrición desempeña un papel de primer orden en la integridad de los tejidos conectivos.',
      'El colágeno, la vitamina C, el zinc y los ácidos grasos Omega-3 modulan la inflamación y aceleran la síntesis de elastina y tejido tendinoso tras microroturas normales del entrenamiento.',
      'Además, la deshidratación reduce la amortiguación del cartílago articular y eleva drásticamente el riesgo de contracturas musculares.'
    ],
    tips: [
      'Realiza siempre un calentamiento articular dinámico de 10 a 15 minutos.',
      'Incorpora cítricos y kiwi junto a fuentes proteicas para potenciar la síntesis de colágeno.',
      'Respeta los días de descanso programados.'
    ]
  },
  {
    id: 'vitaminas',
    title: 'Vitaminas y minerales',
    category: 'Salud',
    icon: 'orange',
    summary: 'Micronutrientes esenciales que activan las reacciones metabólicas durante el ejercicio.',
    content: [
      'Aunque no aportan calorías directas, las vitaminas y minerales son las bujías que encienden el motor metabólico.',
      '• Hierro: Esencial para la hemoglobina y mioglobina que transportan oxígeno a los músculos.',
      '• Calcio y Vitamina D: Cruciales para la contracción muscular vigorosa y la densidad ósea ante impactos.',
      '• Magnesio: Participa en más de 300 reacciones enzimáticas y relaja el músculo post-esfuerzo.',
      '• Vitaminas del complejo B (B1, B2, B6, B12): Claves para transformar la comida ingerida en energía disponible.'
    ],
    tips: [
      'Come variedad de colores: cada pigmento vegetal (rojo, verde, morado, amarillo) representa diferentes antioxidantes.',
      'Toma de 10 a 15 minutos de sol diario para activar la síntesis de vitamina D.',
      'Si tienes sensación de fatiga continua, consulta para realizarte una analítica de ferritina.'
    ]
  },
  {
    id: 'electrolitos',
    title: '¿Necesito electrolitos?',
    category: 'Salud',
    icon: 'bottle',
    summary: 'Cuándo tomar agua pura y cuándo recurrir a sales isotónicas para evitar la hiponatremia.',
    content: [
      'Al sudar perdemos agua y sales minerales, principalmente sodio, potasio, cloro y magnesio.',
      'Para sesiones de menos de 60 minutos a intensidad moderada, el agua potable suele ser suficiente.',
      'Sin embargo, cuando entrenas en clima cálido, con uniformes pesados (como dobok de taekwondo o kimono) o durante más de 75 minutos, las bebidas isotónicas con 400-600mg de sodio por litro mantienen el volumen plasmático y evitan mareos y calambres.'
    ],
    tips: [
      'Pesate antes y después de una sesión dura: por cada kilo perdido, repone 1.2 a 1.5 litros de líquidos.',
      'Evita bebidas comerciales con exceso de azúcares y colorantes artificiales.',
      'Puedes preparar una bebida isotónica casera con agua, naranja exprimida, pizca de sal y miel.'
    ]
  },
  {
    id: 'fibra',
    title: 'Fibra dietética en deportistas',
    category: 'Autocuidado',
    icon: 'wheat',
    summary: 'Cómo aprovechar sus beneficios digestivos sin que genere pesadez antes de competir.',
    content: [
      'La fibra soluble e insoluble alimenta la microbiota intestinal y regula el tránsito, evitando inflamaciones crónicas.',
      'No obstante, el "timing" es crucial para los atletas: alimentos con demasiada fibra (legumbres enteras, salvado concentrado) consumidos muy cerca de la práctica pueden causar malestar gastrointestinal y cólicos durante saltos o patadas.',
      'Consume la mayor parte de tu fibra en comidas alejadas del entrenamiento o en la cena.'
    ],
    tips: [
      'Meta diaria recomendada: 25 a 35 gramos de fibra.',
      'En las 2 horas previas al entreno, opta por opciones bajas en fibra y de rápida digestión.',
      'Aumenta el consumo de fibra de forma gradual y siempre acompañada de abundante agua.'
    ]
  },
  {
    id: 'descanso',
    title: 'La importancia del descanso',
    category: 'Autocuidado',
    icon: 'pillow',
    summary: 'El descanso no es la ausencia de entrenamiento: es cuando el cuerpo verdaderamente mejora.',
    content: [
      'Durante el entrenamiento destruyes fibras musculares y agotas neurotransmisores; durante el sueño profundo (fases REM y no REM lenta) tu organismo reconstruye tejidos más fuertes, consolida la memoria motriz y resetea el sistema inmune.',
      'Dormir menos de 7 horas de manera sostenida aumenta la tasa de lesiones deportivas en hasta un 70% y disminuye el tiempo de reacción ante un oponente.',
      'Mantener un horario regular de acostarse y levantarse optimiza tus ritmos circadianos.'
    ],
    tips: [
      'Evita pantallas de celulares o televisores 45 minutos antes de dormir.',
      'Mantén tu habitación fresca (18-20°C) y completamente a oscuras.',
      'Una siesta corta de 20 minutos puede restaurar la agilidad mental por la tarde.'
    ]
  },
  {
    id: 'suplementos',
    title: 'Suplementos con evidencia científica',
    category: 'Popular',
    icon: 'pill',
    summary: 'Guía honesta sobre qué suplementos cuentan con respaldo real según el Instituto Australiano del Deporte (AIS Grupo A).',
    content: [
      'El 90% de tu éxito depende de la comida real, hidratación y sueño. Los suplementos representan la cúspide de la pirámide (5-10%).',
      'Suplementos con sólida evidencia tipo A:',
      '1. Monohidrato de creatina: Aumenta los depósitos de fosfocreatina para esfuerzos explosivos cortos.',
      '2. Proteína de suero (Whey): Herramienta práctica para alcanzar los requerimientos diarios.',
      '3. Cafeína: Estimula el sistema nervioso y reduce la percepción del esfuerzo.',
      '4. Beta-alanina: Ayuda a tamponar el ácido láctico en esfuerzos intensos de 1 a 4 minutos.'
    ],
    tips: [
      'Nunca pruebes un suplemento nuevo el día de un torneo o prueba importante.',
      'Verifica sellos de control antidopaje reconocidos (como Informed-Choice o NSF Certified for Sport).',
      'Consulta con tu nutricionista antes de iniciar cualquier protocolo.'
    ]
  }
];

export const INITIAL_INJURIES: InjuryRecord[] = [
  {
    id: 'inj-1',
    title: 'Sobrecarga de tendón rotuliano derecho',
    date: '2026-09-12',
    status: 'En recuperación',
    severity: 'Leve',
    bodyArea: 'Rodilla derecha',
    description: 'Molestia al caer de patadas con salto (Tornado / 360). Dolor localizado en polo inferior de la rótula.',
    restrictions: [
      'Sin saltos pliométricos de impacto alto',
      'Evitar flexión máxima de rodilla bajo carga',
      'Calentamiento con banda elástica previo a la sesión'
    ],
    treatment: 'Protocolo isométrico cuadriceps 5x45 seg, hielo 15 min post-sesión, electroterapia si hay dolor.',
    recoveryProgress: 75,
    notes: 'Ha mostrado excelente respuesta al fortalecimiento excéntrico. Puede realizar combates de baja intensidad.'
  },
  {
    id: 'inj-2',
    title: 'Esguince grado 1 ligamento lateral tobillo izquierdo',
    date: '2026-08-20',
    status: 'Dada de alta',
    severity: 'Leve',
    bodyArea: 'Tobillo izquierdo',
    description: 'Inversión forzada al pisar el borde del tatami durante combate libre.',
    restrictions: [
      'Uso preventivo de vendaje funcional o tobillera durante combates oficiales'
    ],
    treatment: 'Fisioterapia completa, propiocepción en bosu y reeducación de la marcha.',
    recoveryProgress: 100,
    notes: 'Completamente recuperado. Fuerza 5/5 en eversión e inversión.'
  }
];

export const INITIAL_NUTRITION_PLAN: NutritionPlanNote = {
  id: 'nutri-plan-1',
  author: 'Lic. Claudia Morales (Nutricionista Deportiva)',
  date: '2026-09-15',
  targetCalories: 2450,
  targetProtein: 140,
  targetWaterGlasses: 8,
  title: 'Plan de Rendimiento & Recuperación para Taekwondo',
  activeNutriTip: 'Comer adecuadamente durante el día ayuda a disponer de energía para entrenar y recuperarse.',
  recommendations: [
    'Carbohidratos complejos en almuerzo (pasta, arroz integral o papas) 2.5 a 3 hrs antes de la sesión de combate.',
    'Merienda PM ligera (plátano con 1 cucharada de miel o sándwich magro) 60 min antes del tatami.',
    'Ventana anabólica: Batido con 25g de proteína o 2 huevos duros + fruta fresca dentro de los 45 min post-entreno.',
    'Mantener ingesta de agua de mínimo 2 litros (8 vasos diarios) para preservar la elasticidad tendinosa.'
  ]
};

export const INITIAL_ATHLETES: AthleteData[] = [
  {
    id: 'ath-1',
    name: 'Mateo',
    sport: 'taekwondo',
    ageGroup: '18 - 29 a',
    gender: 'Masculino',
    beltColor: 'celeste',
    weeklyFrequency: 5,
    sessionDuration: '1 a 2 horas',
    habitualIntensity: 'Moderada',
    habitualSchedule: 'Tarde',
    todayLog: INITIAL_DAY_LOG,
    logsHistory: INITIAL_LOGS_HISTORY,
    injuries: INITIAL_INJURIES,
    activeNutriTip: 'Comer adecuadamente durante el día ayuda a disponer de energía para entrenar y recuperarse.',
  },
  {
    id: 'ath-2',
    name: 'Sofía',
    sport: 'natacion',
    ageGroup: '18 - 29 a',
    gender: 'Femenino',
    beltColor: 'blanco',
    weeklyFrequency: 4,
    sessionDuration: '1 a 2 horas',
    habitualIntensity: 'Alta',
    habitualSchedule: 'Mañana',
    todayLog: {
      date: '2026-09-19',
      mood: 'feliz',
      moodNote: 'Excelente entrenamiento de resistencia en piscina.',
      meals: {
        desayuno: true,
        merienda_am: true,
        almuerzo: false,
        merienda_pm: false,
        cena: false,
      },
      waterGlasses: 4,
      sleepHours: 8,
      sleepCompleted: true,
      trainingHours: 2,
      trainingCompleted: true,
      restQuality: 'Excelente',
    },
    logsHistory: {
      '2026-09-18': {
        date: '2026-09-18',
        mood: 'feliz',
        meals: { desayuno: true, merienda_am: true, almuerzo: true, merienda_pm: true, cena: true },
        waterGlasses: 8,
        sleepHours: 8,
        sleepCompleted: true,
        trainingHours: 2,
        trainingCompleted: true,
        restQuality: 'Excelente',
      },
      '2026-09-19': {
        date: '2026-09-19',
        mood: 'feliz',
        meals: { desayuno: true, merienda_am: true, almuerzo: false, merienda_pm: false, cena: false },
        waterGlasses: 4,
        sleepHours: 8,
        sleepCompleted: true,
        trainingHours: 2,
        trainingCompleted: true,
        restQuality: 'Excelente',
      },
    },
    injuries: [],
    activeNutriTip: 'La hidratación previa al entrenamiento de natación evita desbalances electrolíticos.',
  },
];

