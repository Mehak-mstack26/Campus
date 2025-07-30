import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { auth, db } from '../../firebase/firebase-init';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleView = () => setIsSignUp(prev => !prev);

  const showMessage = (form, msg, isError = false) => {
    const msgDiv = form.querySelector('.form-message') || document.createElement('div');
    msgDiv.className = 'form-message';
    msgDiv.textContent = msg;
    msgDiv.style.color = isError ? 'red' : 'green';
    msgDiv.style.marginTop = '10px';
    msgDiv.style.textAlign = 'center';
    if (!form.contains(msgDiv)) form.appendChild(msgDiv);

    setTimeout(() => { msgDiv.textContent = ''; }, 4000);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    const form = e.target;
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    // Validation
    if (!username || !email || !password) {
      showMessage(form, 'Please fill in all fields.', true);
      return;
    }

    if (password.length < 6) {
      showMessage(form, 'Password must be at least 6 characters long.', true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage(form, 'Please enter a valid email address.', true);
      return;
    }

    setLoading(true);

    try {
      showMessage(form, 'Creating account...');
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: username,
        role: 'student',
        createdAt: serverTimestamp()
      });

      showMessage(form, 'Account created successfully! Redirecting...');
      
      setTimeout(() => {
        // Navigate to the main app component instead of HTML file
        navigate('/app', { replace: true });
      }, 2000);

    } catch (err) {
      console.error('Sign up error:', err);
      let msg = 'Sign up failed. Please try again.';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          msg = 'Email already registered. Please use a different email.';
          break;
        case 'auth/weak-password':
          msg = 'Password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-email':
          msg = 'Invalid email address.';
          break;
        case 'auth/operation-not-allowed':
          msg = 'Email/password accounts are not enabled. Please contact support.';
          break;
        case 'auth/network-request-failed':
          msg = 'Network error. Please check your internet connection.';
          break;
        default:
          msg = `Error: ${err.message}`;
      }
      
      showMessage(form, msg, true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      showMessage(form, 'Please fill in email and password.', true);
      return;
    }

    setLoading(true);

    try {
      showMessage(form, 'Signing in...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docSnap = await getDoc(doc(db, 'users', user.uid));
      
      let userData;
      if (!docSnap.exists()) {
        userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          role: 'student',
          createdAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
      } else {
        userData = docSnap.data();
      }

      showMessage(form, 'Login successful! Redirecting...');
      
      setTimeout(() => {
        // Navigate based on role using React Router
        const route = userData.role === 'mentor' ? '/mentor-dashboard' : '/app';
        navigate(route, { replace: true });
      }, 1500);

    } catch (err) {
      console.error('Sign in error:', err);
      let msg = 'Sign in failed. Please try again.';
      
      switch (err.code) {
        case 'auth/user-not-found':
          msg = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          msg = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          msg = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          msg = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          msg = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          msg = 'Network error. Please check your internet connection.';
          break;
        default:
          msg = `Error: ${err.message}`;
      }
      
      showMessage(form, msg, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`wrapper ${isSignUp ? 'active' : ''}`}>
      {/* Sign In Form */}
      <div className="form-wrapper sign-in">
        <form onSubmit={handleSignIn}>
          <h2>Login</h2>
          <div className="input-group">
            <input type="email" name="email" required disabled={loading} />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input type="password" name="password" required disabled={loading} />
            <label>Password</label>
          </div>
          <button type="submit" className="login" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <button 
            type="button" 
            className="login mentor-btn" 
            onClick={() => navigate('/mentor-login')}
            disabled={loading}
          >
            Login As Mentor
          </button>
          <div className="signUp-link">
            <p>Don't have an account? 
              <button 
                type="button" 
                className="signUpBtn-link" 
                onClick={toggleView}
                disabled={loading}
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Sign Up Form */}
      <div className="form-wrapper sign-up">
        <form onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          <div className="input-group">
            <input type="text" name="username" required disabled={loading} />
            <label>Username</label>
          </div>
          <div className="input-group">
            <input type="email" name="email" required disabled={loading} />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input type="password" name="password" required disabled={loading} />
            <label>Password</label>
          </div>
          <button type="submit" className="signup" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          <button 
            type="button" 
            className="login mentor-btn" 
            onClick={() => navigate('/mentor-signup')}
            disabled={loading}
          >
            Signup As Mentor
          </button>
          <div className="signUp-link">
            <p>Already have an account? 
              <button 
                type="button" 
                className="signInBtn-link" 
                onClick={toggleView}
                disabled={loading}
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;