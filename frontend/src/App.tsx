import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import './i18n/config';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <HomePage />
        </main>
        <footer className="bg-gray-200 text-center py-4 mt-12">
          <p>&copy; 2026 Hair Salon Booking System. All rights reserved.</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
