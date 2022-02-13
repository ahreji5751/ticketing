import axios from 'axios';

import { useState } from 'react';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const { data } = await axios.post('/api/users/signup', { email, password });
    } catch ({ response: { data: { errors } } }) {
      setErrors(errors);
    }
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
      {
        errors.length > 0 &&
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {errors.map(error => <li key={error.message}>{error.message}</li>)}
          </ul>
        </div>
      }
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}

export default Signup;