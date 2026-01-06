import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.splash}>
      <div className={styles.aIPhoneXBarsStatusDe}>
        <p className={styles.aTime}>9:41</p>
        <img src="../image/mjx7vzih-fire6jm.svg" className={styles.container} />
      </div>
      <div className={styles.logo2}>
        <img src="../image/mjx7vzij-dehrw9b.png" className={styles.logo} />
        <div className={styles.titleSub}>
          <p className={styles.mockMate}>MockMate</p>
          <p className={styles.interviewPracticeMad}>
            Interview practice made easy.
          </p>
        </div>
      </div>
      <div className={styles.aIPhoneXHomeIndicato}>
        <div className={styles.line} />
      </div>
    </div>
  );
}

export default Component;
