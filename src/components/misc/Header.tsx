import { useContext } from "react";
import { Login } from "../auth/Login.tsx";
import { Logout } from "../auth/Logout.tsx";
import { AuthContext } from "../context/Auth.tsx";
import { Open } from "../data/Open.tsx";

export const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header>
      {user !== null && user !== undefined ? (
        <>
          <Open />
          <Logout />
        </>
      ) : (
        <Login />
      )}
    </header>
  );
};
