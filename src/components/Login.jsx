import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setRole }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const users = {
    admin: { password: 'admin123', role: 'admin' },
    revisor: { password: 'revisor123', role: 'revisor' },
    usuario: { password: 'usuario123', role: 'usuario' }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users[form.username];

    if (user && user.password === form.password) {
      setRole(user.role);
      navigate('/');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>

      <input className="input" type="text" name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
      <input className="input" type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
      
      <button className="btn" type="submit">Ingresar</button>

      {error && <p className="text-red-500 font-bold">{error}</p>}
    </form>
  );
}

export default Login;

