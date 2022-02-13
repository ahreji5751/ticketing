import { useState } from 'react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = event => {
    event.preventDefault();
    console.log(email, password);
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
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}

export default Signup;