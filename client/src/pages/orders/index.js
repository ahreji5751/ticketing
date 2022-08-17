const Orders = ({ orders }) => (
  <ul>
    {
      orders.map(({ id, ticket, status }) => 
        <li key={id}>
          {ticket.title} - {status}  
        </li>  
      )
    }
  </ul>
)

Orders.getInitialProps = async (ctx, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
}

export default Orders;