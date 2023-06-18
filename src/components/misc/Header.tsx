import { useContext } from "react";
import { AuthContext } from "../context/Auth.tsx";
import { Login } from "../auth/Login.tsx";
import { Logout } from "../auth/Logout.tsx";

export const Header = () => {
  const { user } = useContext(AuthContext);

  return <header>{user !== null && user !== undefined ? <Logout /> : <Login />}</header>;
};
