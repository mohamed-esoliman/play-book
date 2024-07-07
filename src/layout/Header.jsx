import styles from "../styles/layout/Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>Play-Book</h1>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/games">Games</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
