import { useContext } from "react";
import { AuthContext } from "./Auth.tsx";
import { Login } from "./Login.tsx";
import { Logout } from "./Logout.tsx";

export const LoginLogout = () => {
  const { user } = useContext(AuthContext);

  return <>{user !== null && user !== undefined ? <Logout /> : <Login />}</>;
};
