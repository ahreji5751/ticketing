import Header from '../components/Header';
import buildClient from '../api/buildClient';

const CustomApp = ({ Component, pageProps }) => (
  <>
    <Header {...pageProps} />
    <div className="container">
      <Component {...pageProps} />
    </div>
  </>
);

CustomApp.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);

  const { data } = await client.get('api/users/currentuser');

  const pageProps = appContext.Component.getInitialProps ? (await appContext.Component.getInitialProps(appContext.ctx, client)) : {};

  return { pageProps: { ...pageProps, ...data } };
}

export default CustomApp;