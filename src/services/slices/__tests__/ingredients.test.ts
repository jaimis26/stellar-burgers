import ingredientsReducer, { fetchIngredients, initialState } from '../ingredientsSlice';

import type { TIngredient } from '@/utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 200,
    image: 'url',
    image_mobile: 'url',
    image_large: 'url',
  },
];

describe('Тесты редьюсера ingredients', () => {
  test('вернуть изначальное состояние при несуществующем экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });
  test('должен установить isLoading: true и сбросить error при fetchIngredients.pending', () => {
    const action = fetchIngredients.pending('');
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });
  test('должен записать ингредиенты и установить isLoading: false при fetchIngredients.fulfilled', () => {
    const action = fetchIngredients.fulfilled(mockIngredients, '');
    const state = ingredientsReducer({ ...initialState, isLoading: true }, action);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
  });
  test('должен записать текст ошибки и установить isLoading: false при fetchIngredients.rejected', () => {
    const error = new Error('Ошибка сети');
    const action = fetchIngredients.rejected(error, '');
    const state = ingredientsReducer({ ...initialState, isLoading: true }, action);
    expect(state.error).toBe('Ошибка сети');
    expect(state.isLoading).toBe(false);
  });
});
