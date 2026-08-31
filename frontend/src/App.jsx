import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TutorList from './pages/TutorList';
import TutorForm from './pages/TutorForm';
import PetList from './pages/PetList';
import PetForm from './pages/PetForm';
import FuncionarioList from './pages/FuncionarioList';
import FuncionarioForm from './pages/FuncionarioForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Principal */}
        <Route path="/" element={<LandingPage />} />

        {/* Tela de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Internas do Sistema Pet */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tutores" element={<TutorList />} />
          <Route path="tutores/novo" element={<TutorForm />} />
          <Route path="tutores/editar/:id" element={<TutorForm />} />
          <Route path="pets" element={<PetList />} />
          <Route path="pets/novo" element={<PetForm />} />
          <Route path="pets/editar/:id" element={<PetForm />} />
          
          {/* Gestão de Funcionários (Acesso controlado por nível de role no front e back) */}
          <Route path="funcionarios" element={<FuncionarioList />} />
          <Route path="funcionarios/novo" element={<FuncionarioForm />} />
          <Route path="funcionarios/editar/:id" element={<FuncionarioForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
