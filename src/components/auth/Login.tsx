import Icon from "@ant-design/icons";
import {
  InternetIdentityProvider,
  NFIDProvider,
  signIn,
} from "@junobuild/core";
import { Button } from "antd";
import { useContext } from "react";
import { AuthContext } from "../context/Auth.tsx";
import { IconII } from "../icons/IconII.tsx";
import { IconNFID } from "../icons/IconNFID.tsx";

export const Login = () => {
  const { setBusy } = useContext(AuthContext);

  const login = async (signIn: () => Promise<void>) => {
    setBusy?.(true);

    try {
      await signIn();
    } catch (err) {
      console.error(err);
    }

    setBusy?.(false);
  };

  const signInII = async () =>
    login(async () =>
      signIn({
        provider: new InternetIdentityProvider({
          domain: "ic0.app",
        }),
      }),
    );

  const signInNFID = async () =>
    login(async () =>
      signIn({
        provider: new NFIDProvider({
          appName: "icdraw",
          logoUrl:
            "https://y7m4b-fiaaa-aaaal-acgna-cai.raw.icp0.io/logo512.png",
        }),
      }),
    );

  return (
    <>
      <Button
        onClick={signInII}
        shape="circle"
        aria-label="Sign-in with Internet Identity"
        className="header"
      >
        <Icon component={IconII} />
      </Button>

      <Button
        onClick={signInNFID}
        shape="circle"
        aria-label="Sign-in with NFID"
        className="header"
      >
        <Icon component={IconNFID} />
      </Button>
    </>
  );
};
