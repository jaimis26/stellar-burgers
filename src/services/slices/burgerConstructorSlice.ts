import { createSlice, nanoid } from '@reduxjs/toolkit';

import { createOrderThunk } from './orderSlice';

import type {
  TConstructorIngredient,
  TIngredient,
  TConstructorState,
} from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: TConstructorState = {
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
  extraReducers: (builder) => {
    builder.addCase(createOrderThunk.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  },
});

export const { addIngredient, removeIngredient, clearConstructor, moveIngredient } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
