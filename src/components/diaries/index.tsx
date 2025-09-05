import styles from './styles.module.css';

export default function Diaries() {
  return (
    <div className={styles.container}>
      <div className={styles.gap}></div>
      <div className={styles.search}>search</div>
      <div className={styles.gap2}></div>
      <div className={styles.main}>main</div>
      <div className={styles.gap3}></div>
      <div className={styles.pagination}>pagination</div>
      <div className={styles.gap4}></div>
    </div>
  );
}
