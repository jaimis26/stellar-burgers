import burgerConstructorReducer, {
  addIngredient,
  clearConstructor,
  initialState,
  moveIngredient,
  removeIngredient,
} from '../burgerConstructorSlice';
import { createOrderThunk } from '../orderSlice';

import type { TConstructorIngredient, TIngredient, TOrder } from '@/utils/types';

const mockBun: TIngredient = {
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
};

const mockIngredient1: TIngredient = {
  _id: '2',
  name: 'Соус',
  type: 'sauce',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 200,
  image: 'url',
  image_mobile: 'url',
  image_large: 'url',
};

const mockConstructorIngredient1: TConstructorIngredient = {
  ...mockIngredient1,
  id: '1',
};

const mockConstructorIngredient2: TConstructorIngredient = {
  ...mockIngredient1,
  id: '2',
};

describe('Тесты редьюсера burgerConstructor', () => {
  const filledState = {
    bun: { ...mockBun, id: 'bun-1' },
    ingredients: [mockConstructorIngredient1],
  };
  test('вернуть изначальное состояние при несуществующем экшене', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });
  describe('Экшен addIngredient', () => {
    test('добавить булку в bun', () => {
      const action = addIngredient(mockBun);
      const state = burgerConstructorReducer(initialState, action);
      expect(state.bun).toMatchObject(mockBun);
      expect(typeof state.bun?.id).toBe('string');
    });
    test('добавить начинку в ingredients', () => {
      const action = addIngredient(mockIngredient1);
      const state = burgerConstructorReducer(initialState, action);
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject(mockIngredient1);
      expect(typeof state.ingredients[0]?.id).toBe('string');
    });
  });
  describe('Экшен removeIngredient', () => {
    test('должен удалить ингредиент по id при removeIngredient', () => {
      const startState = {
        bun: null,
        ingredients: [mockConstructorIngredient1, mockConstructorIngredient2],
      };
      const action = removeIngredient('1');
      const newState = burgerConstructorReducer(startState, action);
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients).toEqual([mockConstructorIngredient2]);
    });
  });
  describe('Экшен moveIngredient', () => {
    test('должен менять порядок ингредиентов при moveIngredient', () => {
      const startState = {
        bun: null,
        ingredients: [mockConstructorIngredient1, mockConstructorIngredient2],
      };
      const action = moveIngredient({ from: 0, to: 1 });
      const newState = burgerConstructorReducer(startState, action);
      expect(newState.ingredients).toEqual([
        mockConstructorIngredient2,
        mockConstructorIngredient1,
      ]);
    });
  });
  describe('Очистка конструктора (clearConstructor и createOrderThunk.fulfilled)', () => {
    test('должен очищать конструктор при clearConstructor', () => {
      const newState = burgerConstructorReducer(filledState, clearConstructor());
      expect(newState).toEqual(initialState);
    });
    test('должен очищать конструктор при успешном создании заказа', () => {
      const mockOrder = { number: 12345 } as TOrder;
      const action = createOrderThunk.fulfilled(mockOrder, '', ['1', '2']);
      const newState = burgerConstructorReducer(filledState, action);
      expect(newState).toEqual(initialState);
    });
  });
});
