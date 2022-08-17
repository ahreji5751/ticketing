import StripeCheckout from 'react-stripe-checkout';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useRequest from '../../hooks/useRequest';

const ShowOrder = ({ order, currentUser }) => {
  const router = useRouter();

  const onSuccess = order => router.push('/orders');
  const { doRequest, errors } = useRequest({ url: '/api/payments', method: 'post', body: { orderId: order.id }, onSuccess });

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    }

    findTimeLeft();
    const interval = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout 
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51LXJPhIsw7RmZHINTpyHwgqumcQz4oWG7MkutAlpmrMTWV5mDORfYvKoQgMxGYhjnmZZVeNtRk3xQYyqM0B9Cpac00cdiGn8V3"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

ShowOrder.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default ShowOrder;