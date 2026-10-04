import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CallSimulatorModal } from './components/CallSimulatorModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ToastContainer } from './components/ToastContainer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { DemoModeModal } from './components/DemoModeModal';
import { ConfirmationModal } from './components/ConfirmationModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { CreateAgentWizard } from './pages/CreateAgentWizard';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { VoiceSelectionPage } from './pages/VoiceSelectionPage';
import { PhoneNumbersPage } from './pages/PhoneNumbersPage';
import { CallHistoryPage } from './pages/CallHistoryPage';
import { LeadsPage } from './pages/LeadsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BillingPage } from './pages/BillingPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { SuperAdminPanelPage } from './pages/SuperAdminPanelPage';
import { TeamManagementPage } from './pages/TeamManagementPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { ApiStatusPage } from './pages/ApiStatusPage';
import { AgentTestingLabPage } from './pages/AgentTestingLabPage';
import { SpatialBackground } from './components/SpatialBackground';
import { MobileAppDock } from './components/MobileAppDock';
import { AppOpeningIntro } from './components/AppOpeningIntro';
import { AdminAccessDenied } from './components/AdminAccessDenied';
import { isUserAdmin } from './utils/adminAuth';

const AppContent: React.FC = () => {
  const { currentRoute, user, openGlobalSearch, navigate } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [forceShowIntro, setForceShowIntro] = useState(false);

  // Listen to replay intro event
  useEffect(() => {
    const handleReplay = () => setForceShowIntro(true);
    window.addEventListener('voiceai_replay_intro', handleReplay);
    return () => window.removeEventListener('voiceai_replay_intro', handleReplay);
  }, []);

  // Global Keyboard Shortcut: Cmd/Ctrl + K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openGlobalSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openGlobalSearch]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentRoute]);

  // If already authenticated user visits /login or /signup, send to '/' (Landing Page)
  useEffect(() => {
    if (user && (currentRoute === '/login' || currentRoute === '/signup')) {
      navigate('/');
    }
  }, [user, currentRoute, navigate]);

  const isPublicRoute = currentRoute === '/' || currentRoute === '/landing' || currentRoute === '/login' || currentRoute === '/signup';
  const requiresAuth = !user && !isPublicRoute;

  const getPageTitle = (route: string) => {
    if (route.startsWith('/agents/') && route !== '/agents/create') {
      return 'Agent Details & Configuration';
    }
    switch (route) {
      case '/dashboard':
        return 'ড্যাশবোর্ড ওভারভিউ';
      case '/agents':
        return 'AI Voice Agents';
      case '/agent-testing':
        return 'Agent Testing Lab & Quality Evaluation';
      case '/agents/create':
        return 'নতুন AI Agent তৈরি করুন';
      case '/phones':
        return 'Phone Numbers (+880)';
      case '/knowledge':
        return 'Knowledge Base';
      case '/voices':
        return 'AI Voices';
      case '/calls':
        return 'Call History & Transcripts';
      case '/leads':
        return 'Customer Leads CRM';
      case '/team':
        return 'টিম ম্যানেজমেন্ট ও পারমিশন';
      case '/integrations':
        return 'ইন্টিগ্রেশন ও ডেভেলপার API';
      case '/analytics':
        return 'Analytics & Reports';
      case '/billing':
        return 'Billing & Usage';
      case '/settings':
        return 'Settings';
      case '/settings/integrations':
        return 'API Status & Integrations';
      case '/admin':
        return 'Customer Admin Panel';
      case '/super-admin':
        return 'Super Admin Platform Control';
      default:
        return 'VoiceAI BD';
    }
  };

  const renderCurrentView = () => {
    if (currentRoute.startsWith('/agents/') && currentRoute !== '/agents/create') {
      return <AgentDetailPage />;
    }

    switch (currentRoute) {
      case '/':
      case '/login':
      case '/signup':
      case '/dashboard':
        return <DashboardPage />;
      case '/agents':
        return <AgentsPage />;
      case '/agent-testing':
        return <AgentTestingLabPage />;
      case '/agents/create':
        return <CreateAgentWizard />;
      case '/knowledge':
        return <KnowledgeBasePage />;
      case '/voices':
        return <VoiceSelectionPage />;
      case '/phones':
        return <PhoneNumbersPage />;
      case '/calls':
        return <CallHistoryPage />;
      case '/leads':
        return <LeadsPage />;
      case '/team':
        return <TeamManagementPage />;
      case '/integrations':
        return <IntegrationsPage />;
      case '/analytics':
        return <AnalyticsPage />;
      case '/billing':
        return <BillingPage />;
      case '/settings':
        return <SettingsPage />;
      case '/settings/integrations':
        return <ApiStatusPage />;
      case '/admin':
        return isUserAdmin(user) ? <AdminPanelPage /> : <AdminAccessDenied />;
      case '/super-admin':
        return isUserAdmin(user) ? <SuperAdminPanelPage /> : <AdminAccessDenied />;
      default:
        return <DashboardPage />;
    }
  };

  // 1. STRICT AUTH GATE: Before login, ONLY show the Login / Sign Up options!
  // No extra options, no landing page, no dashboard. Just Login and Sign Up.
  if (!user) {
    return (
      <SpatialBackground>
        <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-white">
          <main className="flex-1 flex flex-col justify-center">
            <AuthPage mode={currentRoute === '/signup' ? 'signup' : 'login'} />
          </main>
          <ToastContainer />
          <ConfirmationModal />
        </div>
      </SpatialBackground>
    );
  }

  // 2. AFTER LOGIN: Landing Page ('/' or '/landing')
  // User lands here after login, sees everything on the landing page, and can click Dashboard to open the dashboard console!
  if (currentRoute === '/' || currentRoute === '/landing' || currentRoute === '/login' || currentRoute === '/signup') {
    return (
      <SpatialBackground>
        <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <LandingPage />
          </main>
          <Footer />

          {/* Opening Animation Component (3D Holographic Entry) */}
          <AppOpeningIntro
            forceShow={forceShowIntro}
            onComplete={() => setForceShowIntro(false)}
          />

          {/* Global Modals & Notifications */}
          <CallSimulatorModal />
          <CheckoutModal />
          <ToastContainer />
          <GlobalSearchModal />
          <DemoModeModal />
          <ConfirmationModal />
        </div>
      </SpatialBackground>
    );
  }

  return (
    <SpatialBackground>
      <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-white">
        {/* Authenticated Dashboard Console */}
        <div className="flex flex-1 min-h-screen">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
            <TopBar
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
              title={getPageTitle(currentRoute)}
            />
            <main className="flex-1 pb-16">{renderCurrentView()}</main>
          </div>
        </div>

        {/* Opening Animation Component (3D Holographic Entry) */}
        <AppOpeningIntro
          forceShow={forceShowIntro}
          onComplete={() => setForceShowIntro(false)}
        />

        {/* Global Modals & Notifications */}
        <CallSimulatorModal />
        <CheckoutModal />
        <ToastContainer />
        <GlobalSearchModal />
        <DemoModeModal />
        <ConfirmationModal />

        {/* Mobile Navigation Dock (Only inside Dashboard Console) */}
        {!isPublicRoute && <MobileAppDock />}
      </div>
    </SpatialBackground>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
