import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Adicione mais rotas conforme for criando as páginas */}
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/restaurante/:id" element={<RestaurantDetail />} /> */}
      {/* <Route path="/carrinho" element={<Cart />} /> */}
    </Routes>
  );
}

export default App;