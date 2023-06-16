import { authSubscribe, User } from "@junobuild/core";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<{
  user: undefined | null | User;
  setBusy:
    | React.Dispatch<React.SetStateAction<boolean | undefined>>
    | undefined;
}>({
  user: undefined,
  setBusy: undefined,
});

export const Auth = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [busy, setBusy] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const sub = authSubscribe((user) => setUser(user));

    return () => sub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setBusy }}>
      {children}

      {busy ? <div>Spinner</div> : undefined}
    </AuthContext.Provider>
  );
};
