import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { CartProvider } from './contexts/cart/CartProvider';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { Checkout } from './pages/Checkout';
import { PedidoSucesso } from './pages/PedidoSucesso'; // ← NOVA IMPORTAÇÃO
import { DetalhesPedido } from './pages/DetalhesPedido';
import { MeusPedidos } from './pages/MeusPedidos';
import { RestauranteDashboard } from './pages/RestauranteDashboard';
import { SelecionarRestaurante } from './pages/SelecionarRestaurante';
import { Perfil } from './pages/Perfil/Perfil';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/restaurante/:id" element={<RestaurantDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido-sucesso" element={<PedidoSucesso />} />
          <Route path="/meus-pedidos" element={<MeusPedidos />} />
          <Route path="/pedido/:id" element={<DetalhesPedido />} />
          <Route path="/selecionar-restaurante" element={<SelecionarRestaurante />} />
          <Route path="/restaurante-dashboard/:id" element={<RestauranteDashboard />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;