import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { RestaurantDetail } from './pages/RestaurantDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/restaurante/:id" element={<RestaurantDetail />} />
      {/* ⚠️ ATENÇÃO: não pode ter nada depois, tipo exact ou algo assim */}
    </Routes>
  );
}

export default App;