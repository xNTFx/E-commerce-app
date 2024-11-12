import { auth } from '../API/Firebase';

export default async function getIdTokenFunction() {
  if (auth.currentUser) {
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      return idToken;
    } catch (error) {
      console.error('Error getting ID token:', error);
      throw error;
    }
  }
}
