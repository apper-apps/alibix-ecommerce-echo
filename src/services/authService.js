const ADMIN_EMAIL = 'alibix07@gmail.com';
const AUTH_STORAGE_KEY = 'auth_user';

class AuthService {
  async loginWithGoogle(googleResponse) {
    try {
      const { profileObj, tokenId } = googleResponse;
      
      // Verify the token and user email
      if (!profileObj || !profileObj.email) {
        throw new Error('Invalid Google response');
      }

      // Check if user is authorized admin
      const isAdminUser = profileObj.email === ADMIN_EMAIL;
      
      const userData = {
        id: profileObj.googleId,
        email: profileObj.email,
        name: profileObj.name,
        imageUrl: profileObj.imageUrl,
        role: isAdminUser ? 'admin' : 'customer',
        tokenId,
        loginTime: new Date().toISOString()
      };

      // Store user data
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Google login failed:', error);
      throw new Error('Authentication failed');
    }
  }

  async getCurrentUser() {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedUser) {
        return null;
      }

      const userData = JSON.parse(storedUser);
      
      // Validate stored user data
      if (!userData.email || !userData.tokenId) {
        this.logout();
        return null;
      }

      // Verify admin status
      if (userData.email === ADMIN_EMAIL) {
        userData.role = 'admin';
      }

      return userData;
    } catch (error) {
      console.error('Get current user failed:', error);
      this.logout();
      return null;
    }
  }

  async logout() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      
      // Sign out from Google if available
      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance) {
          await authInstance.signOut();
        }
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  isValidAdmin(user) {
    return user && user.email === ADMIN_EMAIL && user.role === 'admin';
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user;
  }
}

const authService = new AuthService();
export default authService;