import { test, expect} from '@playwright/test'

test.beforeEach(async ({ page }) => {
    // Navigate to the register page before each test
    await page.goto('http://localhost:5173/register');
})

test.describe('Register Page', () => {


    test('main navigation', async ({ page }) => {
        // Assertions use the expect API.
        await expect(page).toHaveURL('http://localhost:5173/register');
      });
    
    test('deberia mostrar  ', async({ page }) =>{
        await page.getByPlaceholder('Nombre completo').fill('john');
        await page.getByPlaceholder('Correo electrónico').fill('Example@gmail.com');
        await page.getByPlaceholder('Nombre de usuario').fill('johnDoe');
        await page.getByPlaceholder('Contraseña', {exact: true}).fill('secret');
        await page.getByPlaceholder('Confirmar contraseña', {exact: true}).fill('secret');
        await page.getByLabel('Tipo de usuario').selectOption('Medic');
        await expect(page.getByLabel('Especialidad')).toBeVisible();
        await page.getByPlaceholder('Especialidad').fill('Cardiología');


        await page.getByRole('button', { name: 'Registrarse' }).click();

    })

})
