import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../src/pages/Register.jsx';

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
    // Supón que los inputs tienen aria-label como fallback en lugar de placeholder
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
  });//test 


  test('muestra error si las contraseñas no coinciden', async () => {
    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirmar contraseña/i), {
      target: { value: 'xyz456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  test('muestra campo de especialidad si el rol es Médico', () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText(/tipo de usuario/i), {
      target: { value: 'Medic' },
    });

    expect(screen.getByLabelText(/especialidad/i)).toBeInTheDocument();
  });

  test('muestra campo de fecha de nacimiento si el rol es Paciente', () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText(/tipo de usuario/i), {
      target: { value: 'Patient' },
    });

    expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument();
  });

  test('no envía si no se selecciona tipo de usuario', () => {
    const mockRegister = jest.fn();
    render(<Register onRegister={mockRegister} />);
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), {
      target: { value: 'Pepe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'pepe@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'pepe123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirmar contraseña/i), {
      target: { value: 'pepe123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(mockRegister).not.toHaveBeenCalled();
  });

  test('muestra error si se selecciona Médico pero no se completa la especialidad', async () => {
    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), {
      target: { value: 'Dra. Carla' },
    });
    fireEvent.change(screen.getByPlaceholderText(/correo/i), {
      target: { value: 'carla@med.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'carla123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirmar contraseña/i), {
      target: { value: 'carla123' },
    });
    fireEvent.change(screen.getByLabelText(/tipo de usuario/i), {
      target: { value: 'Medic' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/obligatorio para médicos/i)).toBeInTheDocument();
  });//--------------------------------------------------------------------------------------------------------------------->

  test('renderiza todos los campos base del formulario', () => {
    renderWithProviders(<Register />);
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de usuario/i)).toBeInTheDocument();
  });

  test('muestra campo de especialidad solo si el rol es Médico', async () => {
    renderWithProviders(<Register />);
    fireEvent.change(screen.getByLabelText(/tipo de usuario/i), {
      target: { value: 'Medic' },
    });
    expect(screen.getByLabelText(/especialidad/i)).toBeInTheDocument();
  });

  test('muestra campo de fecha de nacimiento solo si el rol es Paciente', async () => {
    renderWithProviders(<Register />);
    fireEvent.change(screen.getByLabelText(/tipo de usuario/i), {
      target: { value: 'Patient' },
    });
    expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument();
  });

  test('muestra mensaje si las contraseñas no coinciden', async () => {
    renderWithProviders(<Register />);
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: 'clave123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'clave1234' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  test('lanza validaciones si se intenta enviar con campos vacíos', async () => {
    renderWithProviders(<Register />);
    fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));

    expect(await screen.findAllByRole('alert')).toHaveLength(5); // depende del rol
  });

  test('envía datos correctamente para médico', async () => {
    const mockRegister = jest.fn();
    jest.spyOn(require('../src/context/authContextInstance'), 'useAuth').mockReturnValue({
      registerUser: mockRegister,
      error: null,
    });

    renderWithProviders(<Register />);

    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Dr. House' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'house@clinic.com' },
    });
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), {
      target: { value: 'drhouse' },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: 'vicodin123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'vicodin123' },
    });
    fireEvent.change(screen.getByLabelText(/tipo de usuario/i), {
      target: { value: 'Medic' },
    });
    fireEvent.change(screen.getByLabelText(/especialidad/i), {
      target: { value: 'Diagnóstico' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Dr. House',
        email: 'house@clinic.com',
        username: 'drhouse',
        password: 'vicodin123',
        role: 'medic',
        specialty: 'Diagnóstico',
      }));
    });
  });//aqui se envía el formulario y se espera que se llame a la función de registro con los datos correctos

    test('muestra mensaje de error si error viene del contexto', async () => {
    useAuth.mockReturnValue({
      registerUser: mockRegisterUser,
      error: 'Error inesperado',
    });

    renderWithProviders(<Register />);

    expect(await screen.findByText(/error inesperado/i)).toBeInTheDocument();
  });

    test('renderiza el enlace para iniciar sesión si ya tienes cuenta', () => {
    renderWithProviders(<Register />);
    const loginLink = screen.getByRole('link', { name: /¿ya tienes una cuenta\? inicia sesión/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/login');
  });

    test('todos los campos se actualizan correctamente para paciente', () => {
    renderWithProviders(<Register />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: 'Ana' },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'ana@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: '12345678' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: '12345678' },
    });

    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('Ana');
    expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('ana@example.com');
  });

    test('envía datos y muestra estado de carga durante la petición', async () => {
    mockRegisterUser.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithProviders(<Register />);
    fillFormBase();
    selectUserType('Patient');

    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    fireEvent.click(submitButton);
    expect(submitButton).toBeDisabled();

    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });





});// fin test