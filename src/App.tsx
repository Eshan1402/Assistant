import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CareerOSProvider, useCareerOS } from './context/CareerOSContext';
import { Navbar } from './components/Navbar';
import { HomePageView } from './components/HomePageView';
import { DashboardView } from './components/DashboardView';
import { JobFeedView } from './components/JobFeedView';
import { KanbanView } from './components/KanbanView';
import { EmailIntelligenceView } from './components/EmailIntelligenceView';
import { InterviewsView } from './components/InterviewsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AutomationControlView } from './components/AutomationControlView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { EnvelopeNotification } from './components/EnvelopeNotification';
import { AssistantModal } from './components/AssistantModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { AgentStatusWidget } from './components/AgentStatusWidget';

const CareerOSMain: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeView } = useCareerOS();

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="min-h-screen bg-[#ebf3fa] text-gray-800 flex flex-col font-sans selection:bg-doraemon-blue selection:text-white relative overflow-x-hidden">
      {/* Light studio canvas background */}

      {/* Top Navbar */}


      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeView === 'home' && <HomePageView />}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'jobs' && <JobFeedView />}
        {activeView === 'kanban' && <KanbanView />}
        {activeView === 'emails' && <EmailIntelligenceView />}
        {activeView === 'interviews' && <InterviewsView />}
        {activeView === 'analytics' && <AnalyticsView />}
        {activeView === 'automation' && <AutomationControlView />}
        {activeView === 'profile' && <ProfileSettingsView />}
      </main>

      {/* Overlays, Widgets & Drawers */}
      <AgentStatusWidget />
      <EnvelopeNotification />
      <AssistantModal />
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CareerOSProvider>
        <CareerOSMain />
      </CareerOSProvider>
    </AuthProvider>
  );
}
