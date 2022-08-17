import { useRouter } from 'next/router';

import useRequest from '../../hooks/useRequest';

const ShowTicket = ({ ticket }) => {
  const router = useRouter();

  const onSuccess = order => router.push('/orders/[orderId]', `/orders/${order.id}`);

  const { doRequest, errors } = useRequest({ url: '/api/orders', method: 'post', body: { ticketId: ticket.id }, onSuccess });

  return (
    <>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>Purchase</button>
    </>
  )
}

ShowTicket.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
}

export default ShowTicket;