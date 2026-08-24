import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import api from '../services/api';
import { useAuth } from '../context/useAuth';

// Mockeamos el servicio de API para no pegarle al backend real
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mockeamos useAuth para controlar el login() sin depender del contexto real
vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

const renderLogin = () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

describe('Login', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin });
  });

  it('muestra error de validación si el email es inválido', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/correo electrónico/i), 'email-invalido');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'algunapass');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText(/ingresá un email válido/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('muestra error de validación si falta la contraseña', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('llama a la API y hace login con datos válidos', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValueOnce({
      data: { token: 'fake-token', user: { id: 1, name: 'Fiamma' } },
    });

    renderLogin();

    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockLogin).toHaveBeenCalledWith('fake-token', { id: 1, name: 'Fiamma' });
  });

  it('muestra error del servidor si las credenciales son inválidas', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValueOnce({
      response: { data: { error: { message: 'Credenciales inválidas' } } },
    });

    renderLogin();

    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });

  it('alterna la visibilidad de la contraseña al hacer click en el ícono', async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /mostrar contraseña/i }));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
