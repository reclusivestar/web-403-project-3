import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Signup.scss';

const SignupScreen = () => {
 const [username, setUsername] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const navigate = useNavigate();

 const handleSignup = async (e) => {
   e.preventDefault();
   setIsLoading(true);
   try {
     await axios.post('/api/auth/signup', { username, email, password });
     alert('Signup successful! Please log in.');
     navigate('/login');
   } catch (err) {
     console.error('Signup failed:', err);
     alert(err.response?.data?.error || 'Signup failed. Try again.');
   } finally {
     setIsLoading(false);
   }
 };

 return (
   <div className="signup-screen">
     <div className="hero-section">
       <h1>Join Our Community</h1>
       <p>Start sharing your travel experiences today</p>
     </div>

     <div className="container">
       <div className="row justify-content-center">
         <div className="col-md-6 col-lg-5">
           <div className="signup-card">
             <h2 className="text-center mb-4">Create Account</h2>
             <form onSubmit={handleSignup}>
               <div className="mb-4">
                 <label className="form-label">Username</label>
                 <div className="input-group">
                   <span className="input-group-text">
                     <i className="bi bi-person"></i>
                   </span>
                   <input
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="form-control"
                     placeholder="Choose a username"
                     required
                   />
                 </div>
               </div>

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
                     placeholder="Create a password"
                     required
                   />
                 </div>
               </div>

               <button 
                 type="submit" 
                 className="btn btn-primary w-100"
                 disabled={isLoading}
               >
                 {isLoading ? 'Creating Account...' : 'Sign Up'}
               </button>

               <div className="text-center mt-4">
                 <p className="mb-0">
                   Already have an account? <Link to="/login">Sign In</Link>
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

export default SignupScreen;