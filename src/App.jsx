import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import BottomNav from '@/components/organisms/BottomNav';
import Dashboard from '@/components/pages/Dashboard';
import MuscleMapPage from '@/components/pages/MuscleMapPage';
import RoutinePage from '@/components/pages/RoutinePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/muscle-map" element={<MuscleMapPage />} />
            <Route path="/routine" element={<RoutinePage />} />
          </Routes>
        </motion.div>
      </main>

      <BottomNav />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;