'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Toggle } from '../components/toggle';
import styles from './styles.module.css';
import { useLinkRouting } from './hooks/index.link.routing.hook';
import { useArea } from './hooks/index.area.hook';

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

  const areaVisibility = useArea();
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className={styles.container}>
      {areaVisibility.header.visible && (
        <>
          <header className={styles.header} data-testid="layout-header">
            {areaVisibility.header.logo && (
              <h1 
                className={styles.headerTitle}
                onClick={handleLogoClick}
                data-testid="header-logo"
              >
                민지의 다이어리
              </h1>
            )}
            
            <div className={styles.headerActions}>
              <Toggle
                size="small"
                variant="primary"
                checked={theme === 'dark'}
                onChange={handleThemeToggle}
                data-testid="theme-toggle"
              />
            </div>
          </header>
          
          <div className={styles.gap}></div>
        </>
      )}
      
      {areaVisibility.banner && (
        <>
          <section className={styles.banner} data-testid="layout-banner">
            <Image 
              src="/images/banner.png" 
              alt="배너 이미지" 
              width={1168} 
              height={240}
              className={styles.bannerImage}
            />
          </section>
          
          <div className={styles.gap}></div>
        </>
      )}
      
      {areaVisibility.navigation && (
        <nav className={styles.navigation} data-testid="layout-navigation">
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
      )}
      
      <main className={styles.main}>
        {children}
      </main>
      
      {areaVisibility.footer && (
        <footer className={styles.footer} data-testid="layout-footer">
          {/* Footer content */}
        </footer>
      )}
    </div>
  );
}
