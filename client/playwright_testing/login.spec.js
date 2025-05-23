import {test, expect} from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Navigate to the register page before each test
    await page.goto('http://localhost:5173/login');
})

test.describe('Login Page', () => {

    test('main navigation', async ({ page }) => {
        // Assertions use the expect API.
        await expect(page).toHaveURL('http://localhost:5173/login');
    });

    test('ingresar los datos y logearse', async ({ page }) =>{
        await page.getByPlaceholder('Correo electrónico').fill('example@gmail.com')
        await page.getByPlaceholder('Contraseña', {exact: true}).fill('secret');

        await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    })
    
      

})