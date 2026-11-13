import { addIngredient } from '@/services/slices/burgerConstructorSlice';
import { useDispatch, useSelector } from '@/services/store';
import { BurgerIngredientUI } from '@ui';
import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
}: TBurgerIngredientProps): React.JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();

  const { bun, ingredients: constuctorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );

  const count = useMemo(() => {
    if (ingredient.type === 'bun') {
      return bun && bun._id === ingredient._id ? 2 : 0;
    } else {
      const total = constuctorIngredients.filter((item) => item._id === ingredient._id);
      return total.length;
    }
  }, [bun, constuctorIngredients, ingredient]);

  const handleAdd = (): void => {
    dispatch(addIngredient(ingredient));
    // TODO: Добавить ингредиент в конструктор
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
