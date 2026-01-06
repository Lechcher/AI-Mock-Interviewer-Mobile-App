import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame5}>
      <div className={styles.frame1}>
        <img src="../image/mk20bha1-fvw1qee.svg" className={styles.frame} />
      </div>
      <div className={styles.frame3}>
        <p className={styles.productManager}>Product Manager</p>
        <p className={styles.manager}>Manager</p>
      </div>
      <div className={styles.frame6}>
        <div className={styles.frame4}>
          <img src="../image/mk20bha2-ll8p1su.svg" className={styles.vector} />
          <p className={styles.a48}>4.8</p>
          <p className={styles.a12KReviews}>(1.2k reviews)</p>
        </div>
        <img src="../image/mk20bha2-s2xwkhf.svg" className={styles.frame2} />
      </div>
      <div className={styles.frame7}>
        <p className={styles.pOpular}>POPULAR</p>
      </div>
    </div>
  );
}

export default Component;
