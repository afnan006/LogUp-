// Mock Firebase for development
console.log('Using mock Firebase authentication for development');

// Mock auth object
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Return unsubscribe function
    return () => {};
  }
};

// Mock app object
const app = {};
export default app;