import { useEffect } from 'react';
import { useRouter } from 'next/router';

import useRequest from '../../hooks/useRequest';

const SignOut = () => {
  const router = useRouter();
  
  const { doRequest, errors } = useRequest({ 
    url: '/api/users/signout', 
    method: 'post', 
    body: { }, 
    onSuccess: () => router.push('/') 
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>Signing you out...</div>
  );
}

export default SignOut;