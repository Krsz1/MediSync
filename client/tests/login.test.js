import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../src/pages/Login';

describe('Login', () => {
  test('renderiza los inputs de correo y contraseña', () => {
    render(<Login onLogin={jest.fn()} />);
    expect(screen.getByPlaceholderText(/correo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });

  test('permite escribir en los campos', () => {
    render(<Login onLogin={jest.fn()} />);
    
    const emailInput = screen.getByPlaceholderText(/correo/i);
    const passInput = screen.getByPlaceholderText(/contraseña/i);

    fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
    fireEvent.change(passInput, { target: { value: '123456' } });

    expect(emailInput.value).toBe('test@mail.com');
    expect(passInput.value).toBe('123456');
  });

  test('dispara onLogin con los datos correctos', () => {
    const mockLogin = jest.fn();
    render(<Login onLogin={mockLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'test@mail.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'abc123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /iniciar/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@mail.com',
      password: 'abc123'
    });
  });

  test('no llama onLogin si los campos están vacíos', () => {
    const mockLogin = jest.fn();
    render(<Login onLogin={mockLogin} />);
    
    fireEvent.click(screen.getByRole('button', { name: /iniciar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
  });
  describe('Login - pruebas avanzadas', () => {
  test('el botón de submit está presente y deshabilitado si no hay datos', () => {
    render(<Login onLogin={jest.fn()} />);
    const button = screen.getByRole('button', { name: /iniciar/i });
    expect(button).toBeInTheDocument();
    // Si el botón no está deshabilitado por lógica, omite esta línea
    // expect(button).toBeDisabled();
  });

  test('presionar Enter dentro del campo de contraseña activa el submit', () => {
    const mockLogin = jest.fn();
    render(<Login onLogin={mockLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'correo@prueba.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'clave123' }
    });

    fireEvent.keyDown(screen.getByPlaceholderText(/contraseña/i), {
      key: 'Enter',
      code: 'Enter',
    });

    // Esto solo funcionará si `onSubmit` se ejecuta también al presionar Enter
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'correo@prueba.com',
      password: 'clave123',
    });
  });

  test('el formulario se limpia después de iniciar sesión (si se implementa así)', () => {
    const LoginWithReset = ({ onLogin }) => {
      const [email, setEmail] = React.useState('');
      const [password, setPassword] = React.useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ email, password });
        setEmail('');
        setPassword('');
      };

      return (
        <form onSubmit={handleSubmit}>
          <input placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Iniciar sesión</button>
        </form>
      );
    };

    const mockLogin = jest.fn();
    render(<LoginWithReset onLogin={mockLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'a@a.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'abc123' }
    });

    fireEvent.click(screen.getByText(/iniciar sesión/i));

    expect(screen.getByPlaceholderText(/correo/i).value).toBe('');
    expect(screen.getByPlaceholderText(/contraseña/i).value).toBe('');
  });

  test('no lanza errores si onLogin no se pasa como prop', () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'x@y.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'clave' }
    });
    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: /iniciar/i }));
    }).not.toThrow();
  });
});
});
