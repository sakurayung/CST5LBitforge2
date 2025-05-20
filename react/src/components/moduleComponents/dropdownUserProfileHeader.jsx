import { Link, Navigate, useNavigate } from "react-router-dom";

import { useGlobalContext } from "../context/globalContextProvider";
import axiosClient from "../../axiosClient";

import dropdownusernav from './dropdownUserProfileHeader.module.scss';

export default function DropdownUserProfileHeader() {
  const navigate = useNavigate();

  const { user, setUser, setToken } = useGlobalContext();

  async function handleLogOut(){
    try {
      await axiosClient.post('/logout');
      setToken(null);
      setUser({ role: 'guest' });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={dropdownusernav.usernav}>
      <p>{user.username}</p>
      <div className={dropdownusernav.dropdowncontent}>
        <section className="User">
          {user.role === 'user' && (
            <Link to="/dashboard">Dashboard</Link>
          )}
          {user.role === 'admin' && (
            <Link to="/admin">Admin</Link>
          )}
        </section>
        <section>
          <button onClick={handleLogOut}>Log out</button>
        </section>
      </div>
    </div>
  );
}