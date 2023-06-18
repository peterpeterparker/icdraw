import { useContext } from "react";
import { Login } from "../auth/Login.tsx";
import { Logout } from "../auth/Logout.tsx";
import { AuthContext } from "../context/Auth.tsx";
import { New } from "../data/New.tsx";
import { Open } from "../data/Open.tsx";
import { Busy } from "./Busy.tsx";
import styles from "./Header.module.scss";
import {Edit} from "../data/Edit.tsx";

export const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header
      className={`${styles.header} ${
        user !== null && user !== undefined ? styles.toolbar : ""
      }`}
    >
      <New />
      <Edit />

      {user !== null && user !== undefined ? (
        <>
          <Open />
          <Logout />
          <Busy />
        </>
      ) : (
        <Login />
      )}
    </header>
  );
};
