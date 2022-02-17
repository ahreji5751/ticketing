import buildClient from '../api/buildClient';

const LandingPage = ({ currentUser }) => {
  return (
    <h1>{currentUser ? 'You are signed in' : 'You are not signed in'}</h1>
  )
}

export const getServerSideProps = async (context) => {
  const client = buildClient(context);

  const { data } = await client.get('api/users/currentuser');

  return { props: data };
}

export default LandingPage;