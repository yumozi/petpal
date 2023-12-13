import { createContext } from "react";

const UserContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
  });

export default UserContext;