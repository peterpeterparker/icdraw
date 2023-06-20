import { IconJuno } from "../icons/IconJuno.tsx";
import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        className={styles.link}
        href="https://juno.build"
        aria-label="Build with Juno"
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconJuno />
        Build with Juno
      </a>
    </footer>
  );
};
