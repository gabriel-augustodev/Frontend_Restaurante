import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { CartProvider } from './contexts/cart/CartProvider';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { Checkout } from './pages/Checkout';
import { PedidoSucesso } from './pages/PedidoSucesso'; // ← NOVA IMPORTAÇÃO

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/restaurante/:id" element={<RestaurantDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido-sucesso" element={<PedidoSucesso />} /> {/* ← NOVA ROTA */}
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;