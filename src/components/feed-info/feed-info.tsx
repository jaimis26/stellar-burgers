import { fetchFeed } from '@/services/slices/feedSlice';
import { useDispatch, useSelector } from '@/services/store';
import { FeedInfoUI } from '@ui';
import { useEffect } from 'react';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.feed.orders);
  const feed = useSelector((state) => state.feed);

  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
