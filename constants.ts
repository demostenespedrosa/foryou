
import { Service, Plan, Client, Appointment, Transaction, WeeklySchedule, Professional } from './types';

export const DEFAULT_SERVICES: Record<string, Service[]> = {
  Barber: [
    { id: 's1', name: 'Corte Degradê Recife', price: 50, durationMinutes: 45, type: 'service' },
    { id: 's2', name: 'Barba Modelada', price: 40, durationMinutes: 30, type: 'service' },
    { id: 's3', name: 'Combo (Corte + Barba + Pigmentação)', price: 90, durationMinutes: 75, type: 'combo' },
    { id: 's3b', name: 'Selagem Masculina', price: 80, durationMinutes: 60, type: 'service' },
  ],
  Manicure: [
    { id: 's4', name: 'Mão Simples', price: 35, durationMinutes: 40, type: 'service' },
    { id: 's5', name: 'Spa dos Pés + Mão', price: 85, durationMinutes: 90, type: 'combo' },
    { id: 's5b', name: 'Esmaltação em Gel', price: 70, durationMinutes: 60, type: 'service' },
    { id: 's5c', name: 'Alongamento de Fibra', price: 180, durationMinutes: 120, type: 'service' },
  ],
  Hairdresser: [
    { id: 's6', name: 'Corte Bordado + Escova', price: 120, durationMinutes: 60, type: 'combo' },
    { id: 's7', name: 'Escova Modelada', price: 60, durationMinutes: 40, type: 'service' },
    { id: 's7b', name: 'Mechas Criativas', price: 350, durationMinutes: 240, type: 'service' },
    { id: 's7c', name: 'Hidratação Wella', price: 150, durationMinutes: 50, type: 'service' },
  ],
  Esthetician: [
    { id: 's8', name: 'Limpeza de Pele Profunda', price: 140, durationMinutes: 70, type: 'service' },
    { id: 's9', name: 'Drenagem Linfática', price: 100, durationMinutes: 50, type: 'service' },
  ]
};

export const MOCK_PLANS: Plan[] = [
  { id: 'p1', name: 'Clube da Escova', price: 199.90, type: 'credits', credits: 4, validityDays: 30 },
  { id: 'p2', name: 'Mãos de Fada (4 Pés e Mãos)', price: 280.00, type: 'credits', credits: 4, validityDays: 45 },
  { id: 'p3', name: 'Sempre Bela (Ilimitado)', price: 450.00, type: 'unlimited', credits: 0, validityDays: 30 },
];

// Default 09-19 schedule with lunch break 12-13
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
    sat: { isOpen: true, ranges: [{ start: '09:00', end: '17:00' }] },
    sun: { isOpen: false, ranges: [] },
};

export const MOCK_PROFESSIONALS: Professional[] = [
    { 
        id: 'prof1', 
        name: 'Larissa Costa', 
        role: 'Hairdresser', 
        photoUrl: 'https://i.pravatar.cc/150?u=prof1_recife',
        schedule: MOCK_SCHEDULE 
    },
    { 
        id: 'prof2', 
        name: 'Fernanda Alves', 
        role: 'Manicure', 
        photoUrl: 'https://i.pravatar.cc/150?u=prof2_recife',
        schedule: {
            ...MOCK_SCHEDULE,
            mon: { isOpen: false, ranges: [] }, // Folga na segunda
        }
    },
    { 
        id: 'prof3', 
        name: 'Tiago Silva', 
        role: 'Barber', 
        photoUrl: 'https://i.pravatar.cc/150?u=prof3_recife',
        schedule: MOCK_SCHEDULE 
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
    name: 'Mariana Lima', 
    phone: '(81) 99234-5678', 
    photoUrl: 'https://i.pravatar.cc/150?u=c1_recife',
    activeSubscription: {
      id: 'sub1',
      planName: 'Clube da Escova',
      totalCredits: 4,
      usedCredits: 1,
      expiresAt: new Date(Date.now() + 86400000 * 15), // 15 days left
      active: true
    }
  },
  { 
    id: 'c2', 
    name: 'João Pedro Gomes', 
    phone: '(81) 98877-4433', 
    photoUrl: 'https://i.pravatar.cc/150?u=c2_recife',
    // No subscription
  },
  { 
    id: 'c3', 
    name: 'Camila Queiroz', 
    phone: '(81) 99665-2211', 
    photoUrl: 'https://i.pravatar.cc/150?u=c3_recife',
    activeSubscription: {
      id: 'sub2',
      planName: 'Mãos de Fada',
      totalCredits: 4,
      usedCredits: 3, // Low balance
      expiresAt: new Date(Date.now() + 86400000 * 5), 
      active: true
    }
  },
  {
    id: 'c4',
    name: 'Rafael Vasconcelos',
    phone: '(81) 99911-0022',
    photoUrl: 'https://i.pravatar.cc/150?u=c4_recife',
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  // TODAY
  {
    id: 'a1',
    clientId: 'c1',
    clientName: 'Mariana Lima',
    clientPhoto: 'https://i.pravatar.cc/150?u=c1_recife',
    professionalId: 'prof1',
    serviceId: 's7',
    serviceName: 'Escova Modelada',
    startTime: todayAt(10, 0),
    endTime: todayAt(10, 40),
    status: 'completed',
    isSubscription: true,
  },
  {
    id: 'a2',
    clientId: 'c2',
    clientName: 'João Pedro Gomes',
    clientPhoto: 'https://i.pravatar.cc/150?u=c2_recife',
    professionalId: 'prof3',
    serviceId: 's1',
    serviceName: 'Corte Degradê Recife',
    startTime: todayAt(11, 0),
    endTime: todayAt(11, 45),
    status: 'scheduled',
    isSubscription: false,
  },
  {
    id: 'a3',
    clientId: 'c3',
    clientName: 'Camila Queiroz',
    clientPhoto: 'https://i.pravatar.cc/150?u=c3_recife',
    professionalId: 'prof2',
    serviceId: 's5b',
    serviceName: 'Esmaltação em Gel',
    startTime: todayAt(14, 0),
    endTime: todayAt(15, 0),
    status: 'scheduled',
    isSubscription: true,
  },
  {
    id: 'a4',
    clientId: 'c4',
    clientName: 'Rafael Vasconcelos',
    clientPhoto: 'https://i.pravatar.cc/150?u=c4_recife',
    professionalId: 'prof3', 
    serviceId: 's2',
    serviceName: 'Barba Modelada',
    startTime: todayAt(15, 30),
    endTime: todayAt(16, 0),
    status: 'scheduled',
    isSubscription: false,
  },

  // TOMORROW
  {
    id: 'a5',
    clientId: 'c1',
    clientName: 'Mariana Lima',
    clientPhoto: 'https://i.pravatar.cc/150?u=c1_recife',
    professionalId: 'prof2',
    serviceId: 's4',
    serviceName: 'Mão Simples',
    startTime: daysFromToday(1, 9, 0),
    endTime: daysFromToday(1, 9, 40),
    status: 'scheduled',
    isSubscription: false,
  },

  // YESTERDAY
  {
    id: 'a6',
    clientId: 'c3',
    clientName: 'Camila Queiroz',
    clientPhoto: 'https://i.pravatar.cc/150?u=c3_recife',
    professionalId: 'prof1',
    serviceId: 's7c',
    serviceName: 'Hidratação Wella',
    startTime: daysFromToday(-1, 16, 0),
    endTime: daysFromToday(-1, 16, 50),
    status: 'completed',
    isSubscription: false,
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    // Current Month
    { id: 't1', amount: 60, type: 'service', date: todayAt(10, 45), description: 'Escova - Mariana Lima' },
    { id: 't3', amount: 85, type: 'service', date: dateInMonth(0, 5), description: 'Spa Pés e Mãos - Amanda' },
    { id: 't7', amount: 350, type: 'expense', date: dateInMonth(0, 2), description: 'Conta Neoenergia', category: 'Contas' },
    { id: 't8', amount: 120, type: 'expense', date: todayAt(14, 0), description: 'Produtos Vertix/Wella', category: 'Suprimentos' },
    
    // Last Month
    { id: 't2', amount: 199.90, type: 'subscription_sale', date: dateInMonth(-1, 15), description: 'Clube da Escova - Mariana' },
    { id: 't4', amount: 50, type: 'service', date: dateInMonth(-1, 20), description: 'Corte Masc - João' },
    { id: 't5', amount: 280, type: 'subscription_sale', date: dateInMonth(-1, 10), description: 'Mãos de Fada - Camila Q.' },
    
    // Next Month (Projection/Scheduled)
    { id: 't6', amount: 199.90, type: 'subscription_sale', date: dateInMonth(1, 1), description: 'Renovação - Mariana Lima' },
];
