import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return (
    <h1>Landing Page</h1>
  );
}

LandingPage.getInitialProps = async () => {
  const { data } = await axios.get('/api/users/currentuser');

  return data;
}

export default LandingPage;