import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../src/pages/Register';

describe('Register', () => {
  test('renderiza inputs de nombre, correo y contraseña', () => {
    render(<Register onRegister={jest.fn()} />);

    expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });

  test('permite escribir en los inputs', () => {
    render(<Register onRegister={jest.fn()} />);
    const nameInput = screen.getByPlaceholderText(/nombre/i);
    const emailInput = screen.getByPlaceholderText(/correo/i);
    const passInput = screen.getByPlaceholderText(/contraseña/i);

    fireEvent.change(nameInput, { target: { value: 'Juan' } });
    fireEvent.change(emailInput, { target: { value: 'juan@mail.com' } });
    fireEvent.change(passInput, { target: { value: 'abc123' } });

    expect(nameInput.value).toBe('Juan');
    expect(emailInput.value).toBe('juan@mail.com');
    expect(passInput.value).toBe('abc123');
  });

  test('envía los datos correctos al registrarse', () => {
    const mockRegister = jest.fn();
    render(<Register onRegister={mockRegister} />);

    fireEvent.change(screen.getByPlaceholderText(/nombre/i), {
      target: { value: 'Laura' }
    });
    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'laura@mail.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'xyz123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Laura',
      email: 'laura@mail.com',
      password: 'xyz123'
    });
  });

  test('no envía si hay campos vacíos', () => {
    const mockRegister = jest.fn();
    render(<Register onRegister={mockRegister} />);

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(mockRegister).not.toHaveBeenCalled();
  });
  describe('Register - pruebas avanzadas', () => {
  test('renderiza inputs con valores iniciales vacíos', () => {
    render(<Register onRegister={jest.fn()} />);
    expect(screen.getByPlaceholderText(/nombre/i).value).toBe('');
    expect(screen.getByPlaceholderText(/correo/i).value).toBe('');
    expect(screen.getByPlaceholderText(/contraseña/i).value).toBe('');
  });

  test('presiona Enter en campo de contraseña y dispara el envío', () => {
    const mockRegister = jest.fn();
    render(<Register onRegister={mockRegister} />);

    fireEvent.change(screen.getByPlaceholderText(/nombre/i), {
      target: { value: 'Ana' }
    });
    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'ana@mail.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'clave123' }
    });

    fireEvent.keyDown(screen.getByPlaceholderText(/contraseña/i), {
      key: 'Enter',
      code: 'Enter',
    });

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@mail.com',
      password: 'clave123'
    });
  });

  test('renderiza el botón correctamente con su tipo submit', () => {
    render(<Register onRegister={jest.fn()} />);
    const button = screen.getByRole('button', { name: /registrarse/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('el formulario es accesible mediante etiquetas aria', () => {
    // Supón que los inputs tienen `aria-label` como fallback en lugar de `placeholder`
    render(
      <form>
        <input aria-label="nombre completo" />
        <input aria-label="correo electrónico" />
        <input aria-label="contraseña" />
      </form>
    );

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test('funciona si se deja el input de nombre en blanco pero los otros tienen datos', () => {
    const mockRegister = jest.fn();
    render(<Register onRegister={mockRegister} />);

    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'x@y.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: '123456' }
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      name: '', // intencionalmente vacío
      email: 'x@y.com',
      password: '123456',
    });
  });
});
});
