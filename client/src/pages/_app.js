
import App from 'next/app';

import Header from '../components/Header';
import buildClient from '../api/buildClient';

const CustomApp = ({ Component, pageProps }) => (
  <>
    <Header {...pageProps} />  
    <Component {...pageProps} />
  </>
);

CustomApp.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);

  const { data } = await client.get('api/users/currentuser');

  const pageProps = await App.getInitialProps(appContext, client);

  return { pageProps: { ...pageProps, ...data } };
}

export default CustomApp;