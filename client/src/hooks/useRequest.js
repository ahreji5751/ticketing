import axios from 'axios';

import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const { data } = await axios[method](url, { ...body, ...props });
      onSuccess(data);
    } catch ({ response: { data: { errors } } }) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {errors.map(error => <li key={error.message}>{error.message}</li>)}
          </ul>
        </div>
      );
    }
  }

  return { doRequest, errors };
}

export default useRequest;