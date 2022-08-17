import { useRouter } from 'next/router';
import { useState } from 'react';

import useRequest from '../../hooks/useRequest';

const NewTicket = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const onSuccess = ticket => router.push('/');

  const { doRequest, errors } = useRequest({ url: '/api/tickets', method: 'post', body: { title, price }, onSuccess });

  const onPriceInputBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  }

  const onSubmitTheForm = e => {
    e.preventDefault();
    doRequest();
  }

  return (
    <div>
      <h1>Create a ticket</h1>  
      <form onSubmit={onSubmitTheForm}>
        <div className="mb-3">
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input 
            type="text" 
            value={price} 
            onChange={e => setPrice(e.target.value)}
            onBlur={onPriceInputBlur} 
            className="form-control" 
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket;