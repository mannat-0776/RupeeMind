import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import { getRupeeMindTheme } from './theme/theme';
import { useFinanceStore } from './store/useFinanceStore';
import { useAuthStore } from './store/useAuthStore';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AddTransactionModal } from './components/AddTransactionModal';
import { ScanReceiptModal } from './components/ScanReceiptModal';
import { ParseSmsModal } from './components/ParseSmsModal';
import { AuthModal } from './components/AuthModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Startup Flow Components
import { LandingPage } from './pages/LandingPage';
import { Preloader } from './components/startup/Preloader';
import { AuthScreen } from './components/startup/AuthScreen';
import { Onboarding } from './components/startup/Onboarding';

// Main Application Pages
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { ScanReceipt } from './pages/ScanReceipt';
import { BankSms } from './pages/BankSms';
import { Budgets } from './pages/Budgets';
import { SavingsAI } from './pages/SavingsAI';
import { Goals } from './pages/Goals';
import { Profile } from './pages/Profile';

export function App() {
  const { themeMode, toggleThemeMode } = useFinanceStore();
  const theme = useMemo(() => getRupeeMindTheme(themeMode), [themeMode]);

  const { isAuthenticated, hasCompletedOnboarding, initializeAuth } = useAuthStore();

  // Launch Flow Management:
  // Step 1: Landing Page
  // Step 2: Animated Preloader
  // Step 3: Google Sign-In / Auth
  // Step 4: 3-Screen Onboarding
  // Step 5: Dashboard
  const [currentFlowStep, setCurrentFlowStep] = useState<'landing' | 'preloader' | 'auth' | 'onboarding' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const authUser = localStorage.getItem('rupeemind_auth_user');
      const onboardingDone = localStorage.getItem('rupeemind_onboarding_completed') === 'true';
      if (authUser && onboardingDone) {
        return 'app';
      }
    }
    return 'landing';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals
  const [openAddTx, setOpenAddTx] = useState(false);
  const [openScanReceipt, setOpenScanReceipt] = useState(false);
  const [openParseSms, setOpenParseSms] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Keep flow step in sync if user logs out or completes onboarding
  useEffect(() => {
    if (currentFlowStep === 'app' && !isAuthenticated) {
      setCurrentFlowStep('landing');
    }
  }, [isAuthenticated, currentFlowStep]);

  // Actions in the flow
  const handleLandingGetStarted = () => {
    setCurrentFlowStep('preloader');
  };

  const handlePreloaderComplete = () => {
    if (!isAuthenticated) {
      setCurrentFlowStep('auth');
    } else if (!hasCompletedOnboarding) {
      setCurrentFlowStep('onboarding');
    } else {
      setCurrentFlowStep('app');
    }
  };

  const handleAuthenticated = () => {
    if (!hasCompletedOnboarding) {
      setCurrentFlowStep('onboarding');
    } else {
      setCurrentFlowStep('app');
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentFlowStep('app');
  };

  const handleReturnToLanding = () => {
    setCurrentFlowStep('landing');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* 1. MANDATORY LAUNCH FLOW: LANDING PAGE */}
      {currentFlowStep === 'landing' && (
        <motion.div
          key="flow-landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LandingPage
            onGetStarted={handleLandingGetStarted}
            onWatchDemo={handleLandingGetStarted}
            themeMode={themeMode}
            onToggleTheme={toggleThemeMode}
          />
        </motion.div>
      )}

      {/* 2. MANDATORY LAUNCH FLOW: ANIMATED PRELOADER */}
      <AnimatePresence>
        {currentFlowStep === 'preloader' && (
          <motion.div
            key="flow-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
          >
            <Preloader onComplete={handlePreloaderComplete} durationMs={3500} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MANDATORY LAUNCH FLOW: GOOGLE SIGN-IN / AUTH SCREEN */}
      {currentFlowStep === 'auth' && (
        <motion.div
          key="flow-auth"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AuthScreen onAuthenticated={handleAuthenticated} />
        </motion.div>
      )}

      {/* 4. MANDATORY LAUNCH FLOW: 3 SCREEN ONBOARDING */}
      {currentFlowStep === 'onboarding' && (
        <motion.div
          key="flow-onboarding"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Onboarding onComplete={handleOnboardingComplete} />
        </motion.div>
      )}

      {/* 5. MANDATORY LAUNCH FLOW: DASHBOARD & FULL MAIN APP */}
      {currentFlowStep === 'app' && (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Top Navigation Bar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAddTx={() => setOpenAddTx(true)}
            onOpenScanReceipt={() => setOpenScanReceipt(true)}
            onOpenParseSms={() => setOpenParseSms(true)}
            onOpenAuth={() => setOpenAuth(true)}
          />

          {/* Main Workspace Router */}
          <Box component="main" sx={{ flexGrow: 1, pb: { xs: 10, md: 4 } }}>
            {activeTab === 'dashboard' && (
              <Dashboard
                setActiveTab={setActiveTab}
                onOpenAddTx={() => setOpenAddTx(true)}
                onOpenScanReceipt={() => setOpenScanReceipt(true)}
                onOpenParseSms={() => setOpenParseSms(true)}
              />
            )}
            {activeTab === 'transactions' && (
              <Transactions
                onOpenAddTx={() => setOpenAddTx(true)}
                onOpenScanReceipt={() => setOpenScanReceipt(true)}
                onOpenParseSms={() => setOpenParseSms(true)}
              />
            )}
            {activeTab === 'receipts' && <ScanReceipt />}
            {activeTab === 'sms' && <BankSms />}
            {activeTab === 'budgets' && <Budgets />}
            {activeTab === 'savings' && <SavingsAI />}
            {activeTab === 'goals' && <Goals />}
            {activeTab === 'profile' && (
              <Profile
                onViewLanding={handleReturnToLanding}
                onReplayOnboarding={() => setCurrentFlowStep('onboarding')}
              />
            )}
          </Box>

          {/* Mobile Bottom Navigation Bar */}
          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAddTx={() => setOpenAddTx(true)}
            onOpenScanReceipt={() => setOpenScanReceipt(true)}
            onOpenParseSms={() => setOpenParseSms(true)}
          />

          {/* Network Offline Status Indicator */}
          <OfflineIndicator />

          {/* Core Feature Modals */}
          <AddTransactionModal open={openAddTx} onClose={() => setOpenAddTx(false)} />
          <ScanReceiptModal open={openScanReceipt} onClose={() => setOpenScanReceipt(false)} />
          <ParseSmsModal open={openParseSms} onClose={() => setOpenParseSms(false)} />
          <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
