import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>민지의 다이어리</h1>
      </header>
      
      <div className={styles.gap}></div>
      
      <section className={styles.banner}>
        <Image 
          src="/images/banner.png" 
          alt="배너 이미지" 
          width={1168} 
          height={240}
          className={styles.bannerImage}
        />
      </section>
      
      <div className={styles.gap}></div>
      
      <nav className={styles.navigation}>
        <div className={styles.navItem}>
          <span className={`${styles.navText} ${styles.diaryNav}`}>일기보관함</span>
        </div>
        <div className={styles.navItem}>
          <span className={`${styles.navText} ${styles.photoNav}`}>사진보관함</span>
        </div>
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
