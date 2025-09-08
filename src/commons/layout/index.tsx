'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { useLinkRouting } from './hooks/index.link.routing.hook';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const {
    handleDiariesClick,
    handlePicturesClick,
    handleLogoClick,
    isDiariesActive,
    isPicturesActive
  } = useLinkRouting();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 
          className={styles.headerTitle}
          onClick={handleLogoClick}
          data-testid="header-logo"
        >
          민지의 다이어리
        </h1>
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
          <span 
            className={`${styles.navText} ${isDiariesActive ? styles.navTextActive : ''}`}
            onClick={handleDiariesClick}
            data-testid="nav-diaries"
          >
            일기보관함
          </span>
        </div>
        <div className={styles.navItem}>
          <span 
            className={`${styles.navText} ${isPicturesActive ? styles.navTextActive : ''}`}
            onClick={handlePicturesClick}
            data-testid="nav-pictures"
          >
            사진보관함
          </span>
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
