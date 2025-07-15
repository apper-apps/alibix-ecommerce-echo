const ADMIN_EMAIL = 'alibix07@gmail.com';
const AUTH_STORAGE_KEY = 'auth_user';

class AuthService {
async loginWithGoogle(googleResponse) {
    try {
      // Defensive validation of response structure
      if (!googleResponse) {
        throw new Error('No Google response provided');
      }

      const { profileObj, tokenId, accessToken } = googleResponse;
      
      // Verify the token and user email with null checks
      if (!profileObj || !profileObj.email) {
        throw new Error('Invalid Google response - missing profile data');
      }

      // Additional validation for required fields
      if (!tokenId && !accessToken) {
        throw new Error('Invalid Google response - missing token');
      }

      // Check if user is authorized admin
      const isAdminUser = profileObj.email === ADMIN_EMAIL;
      
      const userData = {
        id: profileObj.googleId || profileObj.id || 'unknown',
        email: profileObj.email,
        name: profileObj.name || 'Unknown User',
        imageUrl: profileObj.imageUrl || profileObj.picture || '',
        role: isAdminUser ? 'admin' : 'customer',
        tokenId: tokenId || accessToken,
        loginTime: new Date().toISOString()
      };

      // Store user data with error handling
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      } catch (storageError) {
        console.error('Failed to store user data:', storageError);
        throw new Error('Failed to save authentication data');
      }
      
      return userData;
    } catch (error) {
      console.error('Google login failed:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

async getCurrentUser() {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedUser) {
        return null;
      }

      let userData;
      try {
        userData = JSON.parse(storedUser);
      } catch (parseError) {
        console.error('Failed to parse stored user data:', parseError);
        this.logout();
        return null;
      }
      
      // Validate stored user data with more comprehensive checks
      if (!userData || typeof userData !== 'object' || !userData.email || !userData.tokenId) {
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