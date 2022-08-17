import Link from 'next/link';

const Tickets = ({ tickets }) => (
  <>
    <h1>Tickets</h1>
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {
          tickets.map(({ id, title, price }) => 
            <tr key={id}>
              <td>{title}</td>
              <td>{price}</td>
              <td><Link href="/tickets/ticketId" as={`/tickets/${id}`}>View</Link></td>
            </tr>
          )
        }
      </tbody>
    </table>
  </>
)

Tickets.getInitialProps = async (ctx, client) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
}

export default Tickets;