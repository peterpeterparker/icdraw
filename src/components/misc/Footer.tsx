import { IconGitHub } from "../icons/IconGitHub.tsx";
import { IconJuno } from "../icons/IconJuno.tsx";
import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.juno}>
        <a
          className={styles.link}
          href="https://juno.build"
          aria-label="Built with Juno"
          rel="noopener noreferrer"
          target="_blank"
        >
          <IconJuno />
          Built with Juno
        </a>
      </div>

      <a
        className={styles.github}
        href="https://github.com/peterpeterparker/icdraw"
        aria-label="Open source on GitHub"
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconGitHub />
      </a>
    </footer>
  );
};
