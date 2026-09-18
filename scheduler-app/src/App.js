import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './components/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
