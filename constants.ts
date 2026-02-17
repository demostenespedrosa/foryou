import { Service, Plan, Client, Appointment, Transaction, WeeklySchedule, Professional } from './types';

export const DEFAULT_SERVICES: Record<string, Service[]> = {
  Barber: [
    { id: 's1', name: 'Corte Degrade', price: 40, durationMinutes: 45, type: 'service' },
    { id: 's2', name: 'Barba Terapia', price: 35, durationMinutes: 30, type: 'service' },
    { id: 's3', name: 'Combo (Corte + Barba)', price: 70, durationMinutes: 75, type: 'combo' },
    { id: 's3b', name: 'Combo Pai e Filho', price: 75, durationMinutes: 90, type: 'combo' },
  ],
  Manicure: [
    { id: 's4', name: 'Mão Simples', price: 25, durationMinutes: 40, type: 'service' },
    { id: 's5', name: 'Pé e Mão', price: 45, durationMinutes: 90, type: 'combo' },
  ],
  Hairdresser: [
    { id: 's6', name: 'Corte Feminino', price: 80, durationMinutes: 60, type: 'service' },
    { id: 's7', name: 'Escova', price: 50, durationMinutes: 40, type: 'service' },
  ],
  Esthetician: [
    { id: 's8', name: 'Limpeza de Pele', price: 120, durationMinutes: 60, type: 'service' },
  ]
};

export const MOCK_PLANS: Plan[] = [
  { id: 'p1', name: 'Rei da Barba', price: 100, type: 'credits', credits: 4, validityDays: 30 },
  { id: 'p2', name: 'Vip Club', price: 150, type: 'credits', credits: 8, validityDays: 45 },
  { id: 'p3', name: 'Presidente (Ilimitado)', price: 250, type: 'unlimited', credits: 0, validityDays: 30 },
];

// Default 09-18 schedule with lunch break 12-13
const DEFAULT_DAY_RANGES = [
    { start: '09:00', end: '12:00' },
    { start: '13:00', end: '19:00' }
];

export const MOCK_SCHEDULE: WeeklySchedule = {
    mon: { isOpen: true, ranges: DEFAULT_DAY_RANGES },
    tue: { isOpen: true, ranges: DEFAULT_DAY_RANGES },
    wed: { isOpen: true, ranges: DEFAULT_DAY_RANGES },
    thu: { isOpen: true, ranges: DEFAULT_DAY_RANGES },
    fri: { isOpen: true, ranges: DEFAULT_DAY_RANGES },
    sat: { isOpen: true, ranges: [{ start: '09:00', end: '15:00' }] },
    sun: { isOpen: false, ranges: [] },
};

export const MOCK_PROFESSIONALS: Professional[] = [
    { 
        id: 'prof1', 
        name: 'José Silva', 
        role: 'Barber', 
        photoUrl: 'https://i.pravatar.cc/150?u=prof1',
        schedule: MOCK_SCHEDULE 
    },
    { 
        id: 'prof2', 
        name: 'Ana Maria', 
        role: 'Manicure', 
        photoUrl: 'https://i.pravatar.cc/150?u=prof2',
        schedule: {
            ...MOCK_SCHEDULE,
            mon: { isOpen: false, ranges: [] }, // Folga na segunda
        }
    }
];

// Helper to generate a random date today
const todayAt = (hours: number, minutes: number) => {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

// Helper for relative months/days
const dateInMonth = (monthOffset: number, day: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    d.setDate(day);
    d.setHours(10, 0, 0, 0);
    return d;
}

// Helper for relative days from today
const daysFromToday = (days: number, hours: number, minutes: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hours, minutes, 0, 0);
    return d;
}

export const MOCK_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    name: 'Carlos Almeida', 
    phone: '11999998888', 
    photoUrl: 'https://picsum.photos/100/100?random=1',
    activeSubscription: {
      id: 'sub1',
      planName: 'Rei da Barba',
      totalCredits: 4,
      usedCredits: 1,
      expiresAt: new Date(Date.now() + 86400000 * 15), // 15 days left
      active: true
    }
  },
  { 
    id: 'c2', 
    name: 'Roberto Silva', 
    phone: '11988887777', 
    photoUrl: 'https://picsum.photos/100/100?random=2',
    // No subscription
  },
  { 
    id: 'c3', 
    name: 'Ana Souza', 
    phone: '11977776666', 
    photoUrl: 'https://picsum.photos/100/100?random=3',
    activeSubscription: {
      id: 'sub2',
      planName: 'Vip Club',
      totalCredits: 8,
      usedCredits: 7, // Low balance
      expiresAt: new Date(Date.now() + 86400000 * 5), 
      active: true
    }
  },
  {
    id: 'c4',
    name: 'Marcos Vinicius',
    phone: '1199991111',
    photoUrl: 'https://picsum.photos/100/100?random=4',
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  // TODAY
  {
    id: 'a1',
    clientId: 'c2',
    clientName: 'Roberto Silva',
    clientPhoto: 'https://picsum.photos/100/100?random=2',
    professionalId: 'prof1',
    serviceId: 's1',
    serviceName: 'Corte Degrade',
    startTime: todayAt(9, 30),
    endTime: todayAt(10, 15),
    status: 'completed',
    isSubscription: false,
  },
  {
    id: 'a2',
    clientId: 'c1',
    clientName: 'Carlos Almeida',
    clientPhoto: 'https://picsum.photos/100/100?random=1',
    professionalId: 'prof1',
    serviceId: 's3',
    serviceName: 'Combo (Corte + Barba)',
    startTime: todayAt(10, 30),
    endTime: todayAt(11, 45),
    status: 'scheduled',
    isSubscription: true,
  },
  {
    id: 'a3',
    clientId: 'c4',
    clientName: 'Marcos Vinicius',
    clientPhoto: 'https://picsum.photos/100/100?random=4',
    professionalId: 'prof1',
    serviceId: 's1',
    serviceName: 'Corte Degrade',
    startTime: todayAt(14, 0),
    endTime: todayAt(14, 45),
    status: 'scheduled',
    isSubscription: false,
  },
  {
    id: 'a4',
    clientId: 'c3',
    clientName: 'Ana Souza',
    clientPhoto: 'https://picsum.photos/100/100?random=3',
    professionalId: 'prof2', // Manicure
    serviceId: 's4',
    serviceName: 'Mão Simples',
    startTime: todayAt(14, 30),
    endTime: todayAt(15, 10),
    status: 'scheduled',
    isSubscription: true,
  },

  // TOMORROW
  {
    id: 'a5',
    clientId: 'c2',
    clientName: 'Roberto Silva',
    clientPhoto: 'https://picsum.photos/100/100?random=2',
    professionalId: 'prof1',
    serviceId: 's2',
    serviceName: 'Barba Terapia',
    startTime: daysFromToday(1, 10, 0),
    endTime: daysFromToday(1, 10, 30),
    status: 'scheduled',
    isSubscription: false,
  },

  // YESTERDAY
  {
    id: 'a6',
    clientId: 'c1',
    clientName: 'Carlos Almeida',
    clientPhoto: 'https://picsum.photos/100/100?random=1',
    professionalId: 'prof1',
    serviceId: 's1',
    serviceName: 'Corte Degrade',
    startTime: daysFromToday(-1, 16, 0),
    endTime: daysFromToday(-1, 16, 45),
    status: 'completed',
    isSubscription: true,
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    // Current Month
    { id: 't1', amount: 40, type: 'service', date: todayAt(9, 45), description: 'Corte - Roberto Silva' },
    { id: 't3', amount: 70, type: 'service', date: dateInMonth(0, 5), description: 'Combo - João Paulo' },
    { id: 't7', amount: 120, type: 'expense', date: dateInMonth(0, 2), description: 'Conta de Luz', category: 'Contas' },
    { id: 't8', amount: 50, type: 'expense', date: todayAt(14, 0), description: 'Produtos de Limpeza', category: 'Suprimentos' },
    
    // Last Month
    { id: 't2', amount: 150, type: 'subscription_sale', date: dateInMonth(-1, 15), description: 'Plano Vip - Ana Souza' },
    { id: 't4', amount: 40, type: 'service', date: dateInMonth(-1, 20), description: 'Corte - Pedro H.' },
    { id: 't5', amount: 100, type: 'subscription_sale', date: dateInMonth(-1, 10), description: 'Plano Rei - Carlos A.' },
    
    // Next Month (Projection/Scheduled)
    { id: 't6', amount: 150, type: 'subscription_sale', date: dateInMonth(1, 1), description: 'Renovação - Ana Souza (Previsto)' },
];