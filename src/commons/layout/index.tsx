import React from 'react';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* Header content */}
      </header>
      
      <div className={styles.gap}></div>
      
      <section className={styles.banner}>
        {/* Banner content */}
      </section>
      
      <div className={styles.gap}></div>
      
      <nav className={styles.navigation}>
        {/* Navigation content */}
      </nav>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        {/* Footer content */}
      </footer>
    </div>
  );
}
