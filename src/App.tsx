import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { CartProvider } from './contexts/cart/CartProvider';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { RestaurantDetail } from './pages/RestaurantDetail';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/restaurante/:id" element={<RestaurantDetail />} />
        </Routes>
        {/* ⚠️ REMOVA O FloatingCart DAQUI - ele já está dentro do RestaurantDetail */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;