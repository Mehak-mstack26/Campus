import React, { useState, useEffect } from 'react';
import './mentor.css';

const MentorPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    signInEmail: '',
    signInPassword: '',
    signUpUsername: '',
    emailSignUp: '',
    passwordSignUp: ''
  });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);

  // Mock Firebase functions - replace with actual Firebase imports
  const mockFirebaseAuth = {
    createUserWithEmailAndPassword: async (email, password) => {
      // Mock implementation
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'existing@test.com') {
            reject({ code: 'auth/email-already-in-use', message: 'Email already in use' });
          } else if (password.length < 6) {
            reject({ code: 'auth/weak-password', message: 'Password too weak' });
          } else {
            resolve({
              user: {
                uid: 'mock-uid-' + Date.now(),
                email: email,
                updateProfile: async (profile) => Promise.resolve(),
                photoURL: null
              }
            });
          }
        }, 1000);
      });
    },
    signInWithEmailAndPassword: async (email, password) => {
      // Mock implementation
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'test@mentor.com' && password === 'password123') {
            resolve({
              user: {
                uid: 'mock-mentor-uid',
                email: email,
                photoURL: null
              }
            });
          } else {
            reject({ code: 'auth/invalid-credential', message: 'Invalid credentials' });
          }
        }, 1000);
      });
    },
    onAuthStateChanged: (callback) => {
      // Mock implementation
      setTimeout(() => {
        const mockUser = null; // No user initially
        callback(mockUser);
      }, 100);
      return () => {}; // Return unsubscribe function
    }
  };

  const mockFirestore = {
    doc: () => ({
      get: async () => ({
        exists: () => true,
        data: () => ({ 
          role: 'mentor', 
          displayName: 'Test Mentor',
          dashboardPage: 'genericMentorDashboard.html'
        })
      }),
      set: async () => Promise.resolve(),
      update: async () => Promise.resolve()
    }),
    serverTimestamp: () => new Date()
  };

  useEffect(() => {
    // Mock auth state listener
    const unsubscribe = mockFirebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User authenticated:', user.uid);
        try {
          const userDoc = await mockFirestore.doc().get();
          if (userDoc.exists() && userDoc.data().role === 'mentor') {
            console.log('Mentor authenticated, redirecting to dashboard');
            // In a real app, you would navigate to the dashboard
            // For demo purposes, we'll just show a success message
            showMessage('Login successful! Redirecting to dashboard...', false);
            setTimeout(() => {
              // window.location.href = userDoc.data().dashboardPage;
              console.log('Would redirect to:', userDoc.data().dashboardPage);
            }, 1500);
          } else {
            console.warn('User is not a mentor');
            showMessage('You were logged in with a non-mentor account and have been signed out. Please sign in as a mentor.', true);
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          showMessage('Error verifying your session. You have been signed out.', true);
        }
      } else {
        console.log('No user authenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => {
      setMessage({ text: '', isError: false });
    }, 7000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { signUpUsername, emailSignUp, passwordSignUp } = formData;

    if (!emailSignUp || !passwordSignUp || !signUpUsername) {
      showMessage('Please fill in all fields for mentor signup.', true);
      setIsLoading(false);
      return;
    }

    try {
      showMessage('Creating mentor account...', false);
      
      const userCredential = await mockFirebaseAuth.createUserWithEmailAndPassword(emailSignUp, passwordSignUp);
      const user = userCredential.user;
      
      await user.updateProfile({ displayName: signUpUsername });

      let dashboardPage = 'genericMentorDashboard.html';
      const lowerCaseEmail = emailSignUp.toLowerCase();
      
      if (lowerCaseEmail.startsWith('anuj.k23csai')) dashboardPage = 'anujDashBoard.html';
      else if (lowerCaseEmail.startsWith('pottabathini.v23csai')) dashboardPage = 'vivekDashBoard.html';
      else if (lowerCaseEmail === 'mehak26114@gmail.com') dashboardPage = 'mehakDashBoard.html';

      await mockFirestore.doc().set({
        uid: user.uid,
        email: user.email,
        displayName: signUpUsername,
        role: 'mentor',
        isOnline: false,
        dashboardPage: dashboardPage,
        photoURL: user.photoURL || '',
        createdAt: mockFirestore.serverTimestamp()
      });
      
      console.log('Mentor Signed Up & Profile Created:', user.uid);
      showMessage('Mentor account created successfully! Please sign in.', false);
      
      setTimeout(() => {
        setIsSignUp(false);
        setFormData(prev => ({
          ...prev,
          signUpUsername: '',
          emailSignUp: '',
          passwordSignUp: ''
        }));
      }, 2000);
      
    } catch (error) {
      console.error('Mentor Sign Up Error:', error);
      let userMessage = 'Error creating mentor account: ' + error.message;
      if (error.code === 'auth/email-already-in-use') {
        userMessage = 'This email is already registered. Please sign in or use a different email.';
      } else if (error.code === 'auth/weak-password') {
        userMessage = 'The password is too weak (min. 6 characters).';
      }
      showMessage(userMessage, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { signInEmail, signInPassword } = formData;

    if (!signInEmail || !signInPassword) {
      showMessage('Please fill in mentor email and password.', true);
      setIsLoading(false);
      return;
    }

    try {
      showMessage('Signing in...', false);
      
      const userCredential = await mockFirebaseAuth.signInWithEmailAndPassword(signInEmail, signInPassword);
      const user = userCredential.user;
      
      const userDoc = await mockFirestore.doc().get();

      if (userDoc.exists() && userDoc.data().role === 'mentor') {
        console.log('Mentor Signed In:', user.uid);
        
        showMessage('Login successful! Redirecting...', false);
        const dashboardPage = userDoc.data().dashboardPage || 'genericMentorDashboard.html';
        setTimeout(() => {
          // window.location.href = dashboardPage;
          console.log('Would redirect to:', dashboardPage);
        }, 1500);
        
      } else {
        console.warn(`Attempted login by ${user.email} (${user.uid}) who is not a mentor or profile incomplete.`);
        showMessage('Access denied. This login is for registered mentors only or profile is incomplete.', true);
      }
    } catch (error) {
      console.error('Mentor Sign In Error:', error);
      let userMessage = 'Error signing in: ' + error.message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        userMessage = 'Invalid email or password for mentor.';
      }
      showMessage(userMessage, true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mentor-page">
      <div className={`wrapper ${isSignUp ? 'active' : ''}`}>
        {/* Mentor Sign-In Form */}
        <div className="form-wrapper sign-in">
          <form onSubmit={handleSignIn}>
            <h2>Mentor Sign In</h2>
            
            {message.text && !isSignUp && (
              <div className={`form-message ${message.isError ? 'error' : 'success'}`}>
                {message.text}
              </div>
            )}
            
            <div className="input-group">
              <input
                type="email"
                name="signInEmail"
                value={formData.signInEmail}
                onChange={handleInputChange}
                required
              />
              <label>Email</label>
            </div>
            
            <div className="input-group">
              <input
                type="password"
                name="signInPassword"
                value={formData.signInPassword}
                onChange={handleInputChange}
                required
              />
              <label>Password</label>
            </div>
            
            <button type="submit" className="login" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Login'}
            </button>
            
            <div className="signUp-link">
              <p>
                New Mentor?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); }}>
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Mentor Sign-Up Form */}
        <div className="form-wrapper sign-up">
          <form onSubmit={handleSignUp}>
            <h2>Mentor Sign Up</h2>
            
            {message.text && isSignUp && (
              <div className={`form-message ${message.isError ? 'error' : 'success'}`}>
                {message.text}
              </div>
            )}
            
            <div className="input-group">
              <input
                type="text"
                name="signUpUsername"
                value={formData.signUpUsername}
                onChange={handleInputChange}
                required
              />
              <label>Full Name</label>
            </div>
            
            <div className="input-group">
              <input
                type="email"
                name="emailSignUp"
                value={formData.emailSignUp}
                onChange={handleInputChange}
                required
              />
              <label>Email</label>
            </div>
            
            <div className="input-group">
              <input
                type="password"
                name="passwordSignUp"
                value={formData.passwordSignUp}
                onChange={handleInputChange}
                required
              />
              <label>Password</label>
            </div>
            
            <button type="submit" className="signup" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div className="signUp-link">
              <p>
                Already a Mentor?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }}>
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorPage;