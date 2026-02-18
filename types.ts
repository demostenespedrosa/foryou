
export type Role = 'Barber' | 'Manicure' | 'Hairdresser' | 'Esthetician';

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string; // UF
  zipCode: string; // CEP
  complement?: string;
}

export interface Establishment {
  name: string;
  logo?: string; // URL or emoji
  ownerName: string;
  schedule?: WeeklySchedule;
  address?: Address;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface TimeRange {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}

export interface DaySchedule {
  isOpen: boolean;
  ranges: TimeRange[]; // Multiple ranges allow for breaks (e.g. 09-12, 13-18)
}

export type WeeklySchedule = Record<DayOfWeek, DaySchedule>;

export interface Professional {
  id: string;
  name: string;
  role: Role;
  photoUrl?: string;
  schedule: WeeklySchedule; // Specific schedule overrides establishment
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  type?: 'service' | 'combo'; // Optional for backward compatibility, defaults to 'service'
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  type: 'credits' | 'unlimited';
  credits: number; // If unlimited, this might be ignored or set to 0
  validityDays: number;
}

export interface Subscription {
  id: string;
  planName: string;
  totalCredits: number;
  usedCredits: number;
  expiresAt: Date;
  active: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  birthDate?: Date; // NEW
  gender?: 'male' | 'female' | 'other'; // NEW
  activeSubscription?: Subscription;
  lastVisit?: Date;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string; // Denormalized for ease
  clientPhoto?: string;
  professionalId: string; // ID of the professional performing the service
  serviceId: string;
  serviceName: string;
  startTime: Date;
  endTime: Date; // Calculated based on duration
  status: 'scheduled' | 'completed' | 'cancelled' | 'noshow';
  isSubscription: boolean; // If paid with credits
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'service' | 'subscription_sale' | 'expense';
  date: Date;
  description: string;
  category?: string; // Optional category for expenses (e.g., 'Aluguel', 'Produtos')
}

// Navigation Types
export type UserMode = 'professional' | 'client';

export type ScreenName = 
  | 'Onboarding' 
  | 'Home' 
  | 'Clients' 
  | 'Financial' 
  | 'Profile' 
  | 'NewAppointment'
  | 'ScheduleSettings' // For establishment hours
  | 'ProfessionalList' // For managing team
  | 'ServiceCatalog' // For service management
  | 'AddressSettings' // For address management
  | 'PlanSettings' // For Plan management
  | 'ClientDetails'; // NEW: Individual client view

export type ClientScreenName = 
  | 'ClientHome'
  | 'ClientHistory'
  | 'ClientSubscription'
  | 'ClientProfile';
