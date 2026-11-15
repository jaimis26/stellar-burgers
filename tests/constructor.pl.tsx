import { expect, test } from '@playwright/test';

test.describe('add ingredients to constructor works correctly', function () {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('должен загружать ингредиенты', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
  });

  test('добавление ингредиента', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const nachCard = page.locator('li', { hasText: 'Хрустящие минеральные кольца' });
    await nachCard.getByRole('button', { name: 'Добавить' }).click();

    const burgerConstructor = page.getByTestId('burger-constructor');
    await expect(
      burgerConstructor.getByText('Краторная булка N-200i').first()
    ).toBeVisible();
    await expect(
      burgerConstructor.getByText('Хрустящие минеральные кольца')
    ).toBeVisible();
  });

  test('открытие и закрытие модального окна', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });

  test('закрытие по оверлею', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toBeVisible();
  });

  test('оформление заказа', async ({ page }) => {
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'khalinin.spb@mail.ru', name: 'Никита' },
        }),
      });
    });
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'Флюоресцентный бургер',
          success: true,
          order: { number: 999 },
        }),
      });
    });
    await page.evaluate(() => localStorage.setItem('refreshToken', 'test-token'));
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.reload({ waitUntil: 'domcontentloaded' });
    const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    const nachCard = page.locator('li', { hasText: 'Хрустящие минеральные кольца' });
    await nachCard.getByRole('button', { name: 'Добавить' }).click();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('999')).toBeVisible();
    const burgerConstructor = page.getByTestId('burger-constructor');
    await expect(burgerConstructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(burgerConstructor.getByText('Выберите начинку')).toBeVisible();
    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });
});
