import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.scss';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      console.log('Login response:', data);
      localStorage.setItem('token', data.token);
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      localStorage.setItem('user', tokenPayload.username);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="hero-section">
        <h1>Welcome Back</h1>
        <p>Sign in to continue your journey</p>
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-card">
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;