import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/App'

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { language } = useApp();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(isAdmin() ? '/admin' : '/profile');
    }
  }, [isAuthenticated, isAdmin, navigate]);

const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info using the access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        const userInfo = await userInfoResponse.json();
        
        // Create response object compatible with existing login function
        const response = {
          profileObj: userInfo,
          tokenObj: tokenResponse,
          accessToken: tokenResponse.access_token
        };
        
        const userData = await login(response);
        
        if (userData.email === 'alibix07@gmail.com') {
          toast.success(language === 'ur' ? 'ایڈمن لاگ ان کامیاب' : 'Admin login successful');
          navigate('/admin');
        } else {
          toast.success(language === 'ur' ? 'لاگ ان کامیاب' : 'Login successful');
          navigate('/profile');
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error(language === 'ur' ? 'لاگ ان ناکام' : 'Login failed');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error(language === 'ur' ? 'Google لاگ ان ناکام' : 'Google login failed');
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-4 py-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl font-display font-bold">
                <span className="text-primary">Ali</span>
                <span className="text-secondary">Bix</span>
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              {language === 'ur' ? 'خوش آمدید' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400">
              {language === 'ur' ? 'اپنے اکاؤنٹ میں لاگ ان کریں' : 'Sign in to your account'}
            </p>
          </div>

          {/* Google Login */}
          <div className="space-y-4">
<motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <ApperIcon name="Mail" className="w-5 h-5" />
              {language === 'ur' ? 'Google سے لاگ ان کریں' : 'Continue with Google'}
            </motion.button>

            {/* Admin Notice */}
            <div className="mt-6 p-4 bg-background rounded-lg border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <ApperIcon name="Info" className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-500 mb-1">
                    {language === 'ur' ? 'ایڈمن رسائی' : 'Admin Access'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'ur' 
                      ? 'صرف alibix07@gmail.com کو ایڈمن پینل تک رسائی ہے' 
                      : 'Only alibix07@gmail.com has access to the admin panel'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full mt-4 text-gray-400 hover:text-white transition-colors py-2"
            >
              {language === 'ur' ? 'واپس ہوم پیج' : 'Back to Home'}
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;