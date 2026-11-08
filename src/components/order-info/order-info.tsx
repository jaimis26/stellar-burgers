import {
  clearOrderByNumber,
  fetchOrderByNumberThunk,
} from '@/services/slices/orderSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import type { RootState } from '@/services/store';
import type { TIngredient, TOrder } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const params = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { number } = params;
  const orderNumber = Number(number);

  const orderData = useSelector((state: RootState): TOrder | null | undefined => {
    const feedOrder = state.feed.orders?.find((item) => item.number === orderNumber);
    if (feedOrder) return feedOrder;

    const userOrder = state.feed.userOrders?.find((item) => item.number === orderNumber);
    if (userOrder) return userOrder;

    return state.order.orderByNumber;
  });

  const ingredients = useSelector(
    (state: RootState): TIngredient[] => state.ingredients.ingredients
  );

  useEffect(() => {
    if (!orderData && orderNumber) {
      void dispatch(fetchOrderByNumberThunk(orderNumber));
    }
    return (): void => {
      void dispatch(clearOrderByNumber());
    };
  }, [orderNumber, dispatch]);

  useEffect(() => {
    return (): void => {
      void dispatch(clearOrderByNumber());
    };
  }, [dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  const isModal = !!(location.state as { background?: Location } | null)?.background;

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
};
