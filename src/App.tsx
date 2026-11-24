import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoadingPage } from './components/ui';
import AppLayout from './components/layout/AppLayout';

import Landing from './pages/Landing';
import { LoginPage, RegisterPage } from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import RoadmapPage from './pages/Roadmap';
import Mentor from './pages/Mentor';
import Tasks from './pages/Tasks';
import Portfolio from './pages/Portfolio';
import Interviews from './pages/Interviews';
import Profile from './pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  if (!isInitialized) return <LoadingPage />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  if (!isInitialized) return <LoadingPage />;
  if (user) return <Navigate to={user.onboardingCompleted ? '/dashboard' : '/onboarding'} replace />;
  return <>{children}</>;
}

function AppPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  const { initialize } = useAuthStore();
  useEffect(() => { initialize(); }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<AppPage><Dashboard /></AppPage>} />
        <Route path="/assessment" element={<AppPage><Assessment /></AppPage>} />
        <Route path="/roadmap" element={<AppPage><RoadmapPage /></AppPage>} />
        <Route path="/mentor" element={<AppPage><Mentor /></AppPage>} />
        <Route path="/tasks" element={<AppPage><Tasks /></AppPage>} />
        <Route path="/portfolio" element={<AppPage><Portfolio /></AppPage>} />
        <Route path="/interviews" element={<AppPage><Interviews /></AppPage>} />
        <Route path="/profile" element={<AppPage><Profile /></AppPage>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
