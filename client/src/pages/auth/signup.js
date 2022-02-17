import { useState } from 'react';
import { useRouter } from 'next/router';

import useRequest from '../../hooks/useRequest';

const Signup = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSuccess = (data) => router.push('/');

  const { doRequest, errors } = useRequest({ url: '/api/users/signup', method: 'post', body: { email, password }, onSuccess });

  const onSubmit = async event => {
    event.preventDefault();
    doRequest();
  }

  return (
    <form className="col-6 p-2" onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="mb-3">
        <label>Email Address</label>
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          className="form-control" 
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input 
          type="password"
          value={password} 
          onChange={e => setPassword(e.target.value)}
          className="form-control" 
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}

export default Signup;