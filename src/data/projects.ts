export interface Project {
  id: string;
  title: string;
  location: string;
  area: number;
  type: 'office' | 'warehouse' | 'industrial' | 'mall';
  services: string[]; // IDs из SERVICES_DB
  duration: string;
  budget?: number;
  image: string;
  description: string;
  year: number;
  features: string[];
}

export const PROJECTS_DB: Project[] = [
  {
    id: 'vegas-business-center',
    title: 'БИЗНЕС-ЦЕНТР "ВЕГАС"',
    location: 'Москва, Кутузовский проспект',
    area: 45000,
    type: 'office',
    services: ['sot', 'skud', 'aps', 'soue', 'sks'],
    duration: '4 месяца',
    budget: 12500000,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop',
    description: 'ИНТЕГРИРОВАННАЯ СИСТЕМА БЕЗОПАСНОСТИ [КЛАСС А].',
    year: 2025,
    features: [
      '1200 IP-камер с аналитикой распознавания лиц',
      'Бесшовный СКУД [Encrypted Access]',
      'Интеграция с ERP-системой предприятия',
      'Автоматизированная отчетность в 1С:ЗУП',
      'Сертификация по высшему разряду МЧС',
    ],
  },
  {
    id: 'fm-pharma-warehouse',
    title: 'ФАРМАЦЕВТИЧЕСКИЙ ХАБ FM LOGISTIC',
    location: 'Московская область, г. Химки',
    area: 28000,
    type: 'warehouse',
    services: ['sot', 'skud', 'aps', 'soue', 'os'],
    duration: '3 месяца',
    budget: 8900000,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop',
    description: 'БЕЗОПАСНОСТЬ ХРАНЕНИЯ [ GDP/GMP STANDARDS ].',
    year: 2025,
    features: [
      'Высокоточные термокамеры [Cold Chain]',
      'Многофакторный контроль доступа [MFA]',
      'Видеоаналитика складских потоков',
      'Интеграция с WMS [API Level 03]',
      'Дублирование критических узлов системы',
    ],
  },
  {
    id: 'techno-industrial',
    title: 'ПРОИЗВОДСТВЕННЫЙ КЛАСТЕР "ТЕХНО"',
    location: 'г. Подольск, Московская область',
    area: 62000,
    type: 'industrial',
    services: ['eom', 'eo', 'sks', 'sot', 'aps'],
    duration: '8 месяцев',
    budget: 24000000,
    image: 'https://images.unsplash.com/photo-1565008447742-9c814f5f6a33?w=1200&auto=format&fit=crop',
    description: 'ИНЖЕНЕРНАЯ МОДЕРНИЗАЦИЯ МАШИНОСТРОИТЕЛЬНОГО ЗАВОДА.',
    year: 2024,
    features: [
      'Силовое оборудование [2.0 МВт Protocol]',
      'Промышленное освещение [DALI Management]',
      'ИТ-инфраструктура на 800 рабочих мест',
      'Интеллектуальный мониторинг периметра',
      'Пожарная безопасность [Адресно-аналоговая]',
    ],
  },
  {
    id: 'galaxy-mall',
    title: 'Торговый центр "Галактика"',
    location: 'Москва, Пресненская набережная',
    area: 85000,
    type: 'mall',
    services: ['soue', 'aps', 'sot', 'skud', 'eo'],
    duration: '6 месяцев',
    budget: 18500000,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&auto=format&fit=crop',
    description: 'Интегрированная система безопасности и оповещения для крупного торгового центра.',
    year: 2024,
    features: [
      'СОУЭ 5 типа с речевым оповещением',
      '3000 дымовых извещателей',
      'Видеонаблюдение с детекцией лиц',
      'СКУД турникеты + биометрия',
      'Умное освещение с датчиками присутствия',
    ],
  },
  {
    id: 'north-office',
    title: 'Офисный центр "Северная башня"',
    location: 'Москва, Ленинградский проспект',
    area: 18000,
    type: 'office',
    services: ['sks', 'eo', 'sot', 'skud'],
    duration: '3 месяца',
    budget: 6200000,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop',
    description: 'Модернизация ИТ-инфраструктуры и систем безопасности бизнес-центра класса B+.',
    year: 2024,
    features: [
      'СКС Cat.6A на 1200 портов',
      'Бесшовный Wi-Fi 6',
      'Видеонаблюдение 4K',
      'СКУД с Face ID',
      'LED освещение с управлением по DALI-2',
    ],
  },
  {
    id: 'auto-logistic',
    title: 'Логистический центр "Автозапчасти"',
    location: 'г. Домодедово, Московская область',
    area: 35000,
    type: 'warehouse',
    services: ['sot', 'skud', 'aps', 'eom'],
    duration: '5 месяцев',
    budget: 11200000,
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&auto=format&fit=crop',
    description: 'Системы безопасности и электроснабжения для распределительного центра автозапчастей.',
    year: 2023,
    features: [
      'Видеоаналитика погрузочных зон',
      'Контроль доступа водителей',
      'Пожарная сигнализация раннего обнаружения',
      'Силовое оборудование 1.5 МВт',
      'Резервное питание от ДГУ',
    ],
  },
];

export const PROJECT_TYPES = [
  { id: 'all', label: 'ВСЕ ОБЪЕКТЫ', icon: 'apps' },
  { id: 'office', label: 'ОФИСНЫЕ ЦЕНТРЫ', icon: 'business' },
  { id: 'warehouse', label: 'СКЛАДСКИЕ ХАБЫ', icon: 'warehouse' },
  { id: 'industrial', label: 'ПРОМ. ОБЪЕКТЫ', icon: 'factory' },
  { id: 'mall', label: 'ТОРГОВЫЕ ЦЕНТРЫ', icon: 'storefront' },
] as const;

export function getProjectsByType(type: string) {
  if (type === 'all') return PROJECTS_DB;
  return PROJECTS_DB.filter(p => p.type === type);
}
