import axios from 'axios';

const buildClient = ({ req: { headers } }) => 
  axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers
  });

export default buildClient;