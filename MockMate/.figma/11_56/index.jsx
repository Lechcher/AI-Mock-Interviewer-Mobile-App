import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame1}>
      <div className={styles.image5}>
        <div className={styles.rectangle2} />
      </div>
      <div className={styles.statusIndicator}>
        <div className={styles.streak}>
          <img src="../image/mjysvgrt-zlwfy1i.svg" className={styles.frame} />
          <p className={styles.a12}>12</p>
        </div>
        <div className={styles.gems}>
          <img src="../image/mjysvgrt-a7ujprl.svg" className={styles.frame} />
          <p className={styles.a450}>450</p>
        </div>
        <div className={styles.vIpStatus}>
          <img src="../image/mjysvgrt-xc062le.svg" className={styles.frame} />
          <p className={styles.vIp}>VIP</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
