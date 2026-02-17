import React, { useState } from 'react';
import { ScreenName, Role, Establishment, Service, Appointment, WeeklySchedule, Professional, Address, Client, Plan } from './types';
import { MOCK_APPOINTMENTS, MOCK_CLIENTS, MOCK_SCHEDULE, MOCK_PROFESSIONALS, DEFAULT_SERVICES, MOCK_PLANS } from './constants';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Clients from './screens/Clients';
import Financial from './screens/Financial';
import Profile from './screens/Profile';
import ScheduleSettings from './screens/ScheduleSettings';
import ServiceCatalog from './screens/ServiceCatalog';
import AddressSettings from './screens/AddressSettings';
import PlanSettings from './screens/PlanSettings';
import ClientDetails from './screens/ClientDetails';
import BottomNav from './components/BottomNav';
import { ArrowLeft, Edit2, User } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // App State
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Home');
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  
  // Initialize services with Barber defaults for dev/testing, but in real app would start empty or fetch from DB
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES['Barber']);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [schedule, setSchedule] = useState<WeeklySchedule>(MOCK_SCHEDULE);
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [plans, setPlans] = useState<Plan[]>(MOCK_PLANS);
  
  // Temp state for editing/viewing
  const [editingProfId, setEditingProfId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Auth Handlers
  const handleLogin = () => {
    // Set default demo data if not already set (simulating data fetch)
    if (!establishment) {
      setEstablishment({
        name: 'Barbearia Demo',
        ownerName: 'Administrador Demo',
        schedule: MOCK_SCHEDULE
      });
    }
    setIsAuthenticated(true);
  };

  const handleRegisterComplete = (data: { role: Role; establishment: Establishment; services: Service[] }) => {
    setEstablishment({ ...data.establishment, schedule: MOCK_SCHEDULE });
    setServices(data.services);
    setIsAuthenticated(true);
    setIsRegistering(false);
  };

  const handleStatusUpdate = (id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(a => {
        if (a.id !== id) return a;
        if (newStatus === 'completed' && a.isSubscription) {
           const clientIndex = clients.findIndex(c => c.id === a.clientId);
           if (clientIndex >= 0) {
             const updatedClients = [...clients];
             const sub = updatedClients[clientIndex].activeSubscription;
             if (sub && sub.usedCredits < sub.totalCredits) {
               sub.usedCredits += 1;
               setClients(updatedClients);
             }
           }
        }
        return { ...a, status: newStatus };
    }));
  };

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment]);
  };

  const handleClientUpdate = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [...prev, newClient]);
  };

  const handleNavigate = (screen: ScreenName) => {
     setCurrentScreen(screen);
     setEditingProfId(null); // Reset when navigating
     setSelectedClientId(null);
  };

  const handleOpenClientDetails = (clientId: string) => {
     setSelectedClientId(clientId);
     setCurrentScreen('ClientDetails');
  };

  const saveEstablishmentSchedule = (newSchedule: WeeklySchedule) => {
      setSchedule(newSchedule);
      if (establishment) {
          setEstablishment({ ...establishment, schedule: newSchedule });
      }
  };

  const saveProfessionalSchedule = (newSchedule: WeeklySchedule) => {
      if (editingProfId) {
          setProfessionals(prev => prev.map(p => 
              p.id === editingProfId ? { ...p, schedule: newSchedule } : p
          ));
      }
  };

  const saveEstablishmentAddress = (newAddress: Address) => {
    if (establishment) {
      setEstablishment({ ...establishment, address: newAddress });
    }
  };

  // ------------------------------------------------------------------
  // Render Logic
  // ------------------------------------------------------------------

  // 1. Not Authenticated -> Login or Register
  if (!isAuthenticated) {
    if (isRegistering) {
      return (
        <Register 
          onComplete={handleRegisterComplete} 
          onBackToLogin={() => setIsRegistering(false)} 
        />
      );
    }
    return (
      <Login 
        onLogin={handleLogin} 
        onRegisterClick={() => setIsRegistering(true)} 
      />
    );
  }

  // 2. Authenticated -> Main App
  // Sub-screen component for Professional List
  const ProfessionalListScreen = () => (
      <div className="h-full bg-slate-50 flex flex-col">
          <div className="bg-white p-4 flex items-center gap-4 border-b border-slate-100">
            <button onClick={() => handleNavigate('Profile')} className="p-2 -ml-2 text-slate-600 active:bg-slate-100 rounded-full">
                <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-slate-800">Profissionais</h1>
          </div>
          <div className="p-4 space-y-4">
              {professionals.map(prof => (
                  <div key={prof.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <img src={prof.photoUrl} alt={prof.name} className="w-12 h-12 rounded-full bg-slate-200" />
                          <div>
                              <h3 className="font-bold text-slate-800">{prof.name}</h3>
                              <p className="text-xs text-slate-500">{prof.role}</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => {
                            setEditingProfId(prof.id);
                        }}
                        className="bg-slate-50 text-primary p-2 rounded-lg hover:bg-amber-50 transition-colors font-medium text-xs flex items-center gap-2"
                      >
                          <Edit2 size={16} /> Editar Horários
                      </button>
                  </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <User size={20} /> Adicionar Novo Profissional
              </button>
          </div>
      </div>
  );

  const renderScreen = () => {
    // Handle nested edit screen for professional
    if (editingProfId) {
        const prof = professionals.find(p => p.id === editingProfId);
        if (!prof) return null;
        return (
            <ScheduleSettings 
                initialSchedule={prof.schedule}
                onSave={saveProfessionalSchedule}
                onBack={() => setEditingProfId(null)}
                title={`Horários: ${prof.name}`}
            />
        );
    }

    switch (currentScreen) {
      case 'Home':
        return (
          <Home 
            appointments={appointments} 
            clients={clients} 
            professionals={professionals}
            services={services}
            onUpdateStatus={handleStatusUpdate}
            onNewAppointment={handleAddAppointment}
            onClientClick={handleOpenClientDetails}
          />
        );
      case 'Clients':
        return (
            <Clients 
                clients={clients} 
                plans={plans}
                onUpdateClient={handleClientUpdate} 
                onAddClient={handleAddClient} 
            />
        );
      case 'Financial':
        return <Financial />;
      case 'Profile':
        return <Profile establishment={establishment} clientsCount={clients.length} onNavigate={(s) => handleNavigate(s as ScreenName)} />;
      case 'ScheduleSettings':
        return (
            <ScheduleSettings 
                initialSchedule={schedule} 
                onSave={saveEstablishmentSchedule} 
                onBack={() => handleNavigate('Profile')}
                title="Horários do Estabelecimento"
            />
        );
      case 'ProfessionalList':
          return <ProfessionalListScreen />;
      case 'ServiceCatalog':
          return (
            <ServiceCatalog 
              services={services} 
              onUpdate={setServices} 
              onBack={() => handleNavigate('Profile')} 
            />
          );
      case 'AddressSettings':
          return (
            <AddressSettings
              initialAddress={establishment?.address}
              onSave={(addr) => { saveEstablishmentAddress(addr); handleNavigate('Profile'); }}
              onBack={() => handleNavigate('Profile')}
            />
          );
      case 'PlanSettings':
          return (
             <PlanSettings
                plans={plans}
                onUpdate={setPlans}
                onBack={() => handleNavigate('Profile')}
             />
          );
      case 'ClientDetails':
          const client = clients.find(c => c.id === selectedClientId);
          if (!client) return <Home appointments={appointments} clients={clients} professionals={professionals} services={services} onUpdateStatus={handleStatusUpdate} onNewAppointment={() => {}} />;
          return (
             <ClientDetails 
                client={client}
                appointments={appointments}
                onBack={() => handleNavigate('Home')}
             />
          );
      default:
        return <Home appointments={appointments} clients={clients} professionals={professionals} services={services} onUpdateStatus={handleStatusUpdate} onNewAppointment={() => {}} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="animate-slide-in min-h-full">
           {renderScreen()}
        </div>
      </div>

      {/* Hide BottomNav if in settings sub-screens to focus user */}
      {!['ScheduleSettings', 'ProfessionalList', 'ServiceCatalog', 'AddressSettings', 'PlanSettings', 'ClientDetails'].includes(currentScreen) && !editingProfId && (
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;