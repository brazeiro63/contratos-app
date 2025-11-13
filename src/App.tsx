import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PropertyManagement from './pages/contracts/PropertyManagement';
import RentalContract from './pages/contracts/RentalContract';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contrato/administracao" element={<PropertyManagement />} />
        <Route path="/contrato/locacao" element={<RentalContract />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
