import { createContext, useState } from "react";

const StateContext = createContext({
  user: {
    id: null,
    name: null,
    password: null,
    email: null,
    role: null,
  },
  setUser: () => {},
  token: null,
  setToken: () => {},
});

export function StateProvider({ children }) {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(null);

  function setToken(token) {
    _setToken(token);
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  } 

  return (
    <StateContext.Provider value={{ 
      user, 
      token, 
      setUser, 
      setToken 
    }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}