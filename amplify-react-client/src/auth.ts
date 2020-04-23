import awsconfig from './aws-config';
import Amplify, { Hub, Auth, API } from 'aws-amplify';

// doing this here so that the stack is configured before
// we attempt to wrap anything
Amplify.configure(awsconfig);
Auth.configure(awsconfig);
API.configure(awsconfig);

export const getBearerToken = async () => `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`;
export const getUser = async () => await Auth.currentAuthenticatedUser();

export { Amplify, Auth, API };