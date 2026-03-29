import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Onboarding from './components/Onboarding';
import ModuleZero from './components/ModuleZero';
import { UserProfile, Message } from './types';
import { INITIAL_USER_PROFILE } from './constants';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeModule, setActiveModule] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('dr_medix_profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setIsOnboardingComplete(true);
      // If module 0 is completed, set active module to 1 by default
      if (profile.completedModules.includes(0)) {
        setActiveModule(1);
      }
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsOnboardingComplete(true);
    localStorage.setItem('dr_medix_profile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    localStorage.removeItem('dr_medix_profile');
    setUserProfile(null);
    setIsOnboardingComplete(false);
    setMessages([]);
    setActiveModule(0);
  };

  const handleXPIncrease = (amount: number = 10) => {
    if (!userProfile) return;
    const newXP = userProfile.xp + amount;
    const newProfile = { ...userProfile, xp: newXP };
    setUserProfile(newProfile);
    localStorage.setItem('dr_medix_profile', JSON.stringify(newProfile));
  };

  const handleModuleZeroComplete = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('dr_medix_profile', JSON.stringify(updatedProfile));
    setActiveModule(1); // Move to first real module
  };

  if (!isOnboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-[100dvh] bg-[#05070A] overflow-hidden font-sans relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-medical-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 left-1/4 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
        
        <div className={`fixed lg:relative z-50 h-full transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <Sidebar 
            user={userProfile || INITIAL_USER_PROFILE} 
            activeModuleId={activeModule}
            onModuleChange={(id) => {
              setActiveModule(id);
              setIsSidebarOpen(false);
            }}
            onLogout={handleLogout}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <main className="flex-1 flex flex-col min-w-0 relative h-full">
          {/* Mobile Header Toggle */}
          <div className="lg:hidden absolute top-6 left-6 z-30">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-xl shadow-xl active:scale-95 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeModule === 0 && userProfile && !userProfile.completedModules.includes(0) ? (
              <motion.div
                key="module-zero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50"
              >
                <ModuleZero user={userProfile} onComplete={handleModuleZeroComplete} />
              </motion.div>
            ) : (
              <motion.div
                key={`module-${activeModule}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col h-full"
              >
                <ChatInterface 
                  activeModuleId={activeModule}
                  messages={messages}
                  setMessages={setMessages}
                  onXPIncrease={() => handleXPIncrease(10)}
                  userProfile={userProfile || INITIAL_USER_PROFILE}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
