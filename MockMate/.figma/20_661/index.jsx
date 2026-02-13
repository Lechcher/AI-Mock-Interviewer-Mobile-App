import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame42}>
      <div className={styles.frame41}>
        <p className={styles.resetsIn}>Resets in</p>
        <div className={styles.frame40}>
          <img src="../image/mklu1isr-kci0nja.svg" className={styles.frame} />
          <p className={styles.a5DayStreak}>5 Day Streak</p>
        </div>
      </div>
      <div className={styles.frame39}>
        <div className={styles.frame36}>
          <div className={styles.frame30}>
            <p className={styles.a12}>12</p>
          </div>
          <p className={styles.hOurs}>HOURS</p>
        </div>
        <div className={styles.frame36}>
          <div className={styles.frame30}>
            <p className={styles.a12}>30</p>
          </div>
          <p className={styles.hOurs}>MINUTES</p>
        </div>
        <div className={styles.frame36}>
          <div className={styles.frame30}>
            <p className={styles.a12}>45</p>
          </div>
          <p className={styles.hOurs}>SECONDS</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
