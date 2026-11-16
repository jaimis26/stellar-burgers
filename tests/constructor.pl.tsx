import { expect, test } from '@playwright/test';

test.describe('Тестирование страницы конструктора бургеров', function () {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/**',
      update: false,
      notFound: 'abort',
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test.describe('Конструктор бургера', () => {
    test('должен загружать ингредиенты', async ({ page }) => {
      await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
    });

    test('добавление ингредиента', async ({ page }) => {
      const burgerConstructor = page.getByTestId('burger-constructor');
      await expect(
        burgerConstructor.getByText('Краторная булка N-200i')
      ).not.toBeVisible();
      await expect(
        burgerConstructor.getByText('Хрустящие минеральные кольца')
      ).not.toBeVisible();

      const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
      await bunCard.getByRole('button', { name: 'Добавить' }).click();

      const ingredientCard = page.locator('li', {
        hasText: 'Хрустящие минеральные кольца',
      });
      await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

      await expect(
        burgerConstructor.getByText('Краторная булка N-200i').first()
      ).toBeVisible();
      await expect(
        burgerConstructor.getByText('Хрустящие минеральные кольца')
      ).toBeVisible();
    });
  });

  test.describe('Модальное окно ингредиента', () => {
    test('открытие и закрытие модального окна', async ({ page }) => {
      const modal = page.getByTestId('modal');
      await expect(modal).not.toBeVisible();
      await page.getByText('Краторная булка N-200i').click();
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
      await page.getByTestId('modal-close').click();
      await expect(modal).not.toBeVisible();
    });

    test('закрытие по оверлею', async ({ page }) => {
      const modal = page.getByTestId('modal');
      await expect(modal).not.toBeVisible();
      await page.getByText('Краторная булка N-200i').click();
      await expect(modal).toBeVisible();
      await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
      await expect(modal).not.toBeVisible();
    });
  });

  test.describe('Оформление заказа', () => {
    test('оформление заказа', async ({ page }) => {
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
      const modal = page.getByTestId('modal');
      const burgerConstructor = page.getByTestId('burger-constructor');
      const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
      await bunCard.getByRole('button', { name: 'Добавить' }).click();
      const ingredientCard = page.locator('li', {
        hasText: 'Хрустящие минеральные кольца',
      });
      await ingredientCard.getByRole('button', { name: 'Добавить' }).click();
      await expect(
        burgerConstructor.getByText('Краторная булка N-200i').first()
      ).toBeVisible();
      await expect(
        burgerConstructor.getByText('Хрустящие минеральные кольца')
      ).toBeVisible();
      await expect(modal).not.toBeVisible();
      await page.getByRole('button', { name: 'Оформить заказ' }).click();
      await expect(modal).toBeVisible();
      await expect(modal.getByText('999')).toBeVisible();
      await expect(burgerConstructor.getByText('Выберите булки').first()).toBeVisible();
      await expect(burgerConstructor.getByText('Выберите начинку')).toBeVisible();
      await page.getByTestId('modal-close').click();
      await expect(modal).not.toBeVisible();
    });
  });
});
