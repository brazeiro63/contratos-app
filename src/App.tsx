import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PropertyManagement from './pages/contracts/PropertyManagement';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contrato/administracao" element={<PropertyManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
