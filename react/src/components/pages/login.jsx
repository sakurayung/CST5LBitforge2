import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../context/globalContextProvider";
import axiosClient from "../../axiosClient";

import login from './login.module.scss';

export default function Login() {
  const { setToken, setUser } = useGlobalContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handlesubmit(e) {
    e.preventDefault();

    try {
      const { data } = await axiosClient.post('/login', {
        username,
        password,
      });

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('ACCESS_TOKEN', data.token);
      window.location.href = "/";
    } catch (err) {
      console.error(err.response?.data || err);
      
      alert('Invalid login credentials');
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) navigate('/');
  }, []);


  return (
    <div className={login.login}>
      <form onSubmit={handlesubmit} method="POST">
        <h1>Login</h1>

        <div className={login.usernameBlock}>
          <label className={login.userLabel} htmlFor="username">Username:</label>
          <div>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <div>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}