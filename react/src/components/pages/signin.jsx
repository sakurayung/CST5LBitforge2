import { useRef } from 'react';
import { useNavigate } from "react-router-dom";

import axiosClient from '../../axiosClient';
import { useGlobalContext } from '../context/globalContextProvider';

import signin from './signin.module.scss';

export default function SignIn() {
  const navigate = useNavigate();

  const { setUser, setToken } = useGlobalContext();

  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const phoneNumberRef = useRef();
  const streetRef = useRef();
  const cityRef = useRef();
  const regionRef = useRef();
  const postalCodeRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
  
    const payload = {
      username: userNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      confirm_password: confirmPasswordRef.current.value,
      phone_number: phoneNumberRef.current.value,
      street: streetRef.current.value,
      city: cityRef.current.value,
      region: regionRef.current.value,
      postal_code: postalCodeRef.current.value
    };
  
    axiosClient.post('/signin', payload)
      .then(({ data }) => {
        setUser(data.user);         // store the new user in context
        setToken(data.token);       // this also writes to localStorage
        navigate('/');              // redirect to home (or dashboard)
      })
      .catch(err => {
        const errorData = err.response?.data;

        if (errorData?.errors) {
          const allErrors = errorData.errors;
          const messages = [];

          for (const key in allErrors) {
            if (Array.isArray(allErrors[key])) {
              messages.push(...allErrors[key]);
            }
          }

          alert(messages.join('\n')); 
        } else {
          alert(errorData?.message || 'Signup failed. Please try again.');
        }

        console.error(errorData || err);
      });
  }

  return (
    <div className={signin.signin}>
      <form onSubmit={handleSubmit}>
        <h3>Sign In</h3>
  
        {/* Username with hover effect */}
        <div className={signin.usernameBlock}>
          <label className={signin.userLabel} htmlFor="username">Username</label>
          <div>
            <input 
              ref={userNameRef}
              type="text" 
              id="username" 
              name="username" 
              placeholder="GenghisChan"
              required 
            />
          </div>
        </div>
  
        {/* All other fields follow same styling without hover effect on label */}
        <div className={signin.inputGroup}>
          <label htmlFor="email">Email</label>
          <div>
            <input 
              ref={emailRef}
              type="email" 
              id="email" 
              name="email" 
              placeholder="GenghisChan@gmail.com"
              required 
            />
          </div>
        </div>
  
        <div className={signin.inputGroup}>
          <label htmlFor="password">Password</label>
          <div>
            <input 
              ref={passwordRef}
              type="password" 
              id="password" 
              name="password" 
              placeholder="password"
              required 
            />
          </div>
        </div>
  
        <div className={signin.inputGroup}>
          <label htmlFor="confirm-password">Confirm Password</label>
          <div>
            <input 
              ref={confirmPasswordRef}
              type="password" 
              id="confirm-password" 
              name="confirm-password" 
              placeholder="confirm password"
              required 
            />
          </div>
        </div>
  
        <div className={signin.inputGroup}>
          <label htmlFor="phone_number">Phone Number</label>
          <div>
            <input
              ref={phoneNumberRef}
              type="tel" 
              id="phone_number"
              name="phone_number"
              pattern="^09\d{9}$"
              placeholder="09123456789"
              required
            />
          </div>
        </div>
  
        <div className={signin.inputGroup}>
          <label>Address</label>
          <div className={signin.addresswrap}>
            <div><input 
              ref={streetRef} 
              type="text" 
              name="Street" 
              placeholder="Street, Town/Village" 
              required
            /></div>
            <div><input 
              ref={cityRef} 
              type="text" 
              name="City" 
              placeholder="City" 
              required 
            /></div>
            <div><input 
              ref={regionRef} 
              type="text" 
              name="Region" 
              placeholder="Region" 
              required 
            /></div>
            <div><input 
              ref={postalCodeRef} 
              type="text" 
              name="PostalCode" 
              placeholder="Postal Code" 
              required 
            /></div>
          </div>
        </div>
  
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
} 