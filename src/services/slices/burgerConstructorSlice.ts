import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { TConstructorIngredient, TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      const movingIngredient = state.ingredients.splice(from, 1)[0];
      state.ingredients.splice(to, 0, movingIngredient);
    },
  },
});

export const { addIngredient, removeIngredient, clearConstructor, moveIngredient } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
