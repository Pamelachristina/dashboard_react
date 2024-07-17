import React from 'react';
import styles from './User.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import avatars
import avatar1 from '../assets/avatars/avatar1.gif';
import avatar2 from '../assets/avatars/avatar2.gif';
import avatar3 from '../assets/avatars/avatar3.gif';
import avatar4 from '../assets/avatars/avatar4.gif';
import avatar5 from '../assets/avatars/avatar5.gif';
import avatar6 from '../assets/avatars/avatar6.gif';
import avatar7 from '../assets/avatars/avatar7.gif';
import avatar8 from '../assets/avatars/avatar8.gif';
import avatar9 from '../assets/avatars/avatar9.gif';

const User = () => {
  return (
    <div className={styles.mainContent}>
      <div className="container-fluid p-0">
        <header className={`${styles.header} d-flex justify-content-center align-items-center`}>
          <img src={avatar1} alt="Avatar 1" className={styles.avatar} />
          <img src={avatar2} alt="Avatar 2" className={styles.avatar} />
          <img src={avatar3} alt="Avatar 3" className={styles.avatar} />
          <img src={avatar4} alt="Avatar 4" className={styles.avatar} />
          <img src={avatar5} alt="Avatar 5" className={styles.avatar} />
          <img src={avatar6} alt="Avatar 6" className={styles.avatar} />
          <img src={avatar7} alt="Avatar 7" className={styles.avatar} />
          <img src={avatar8} alt="Avatar 8" className={styles.avatar} />
          <img src={avatar9} alt="Avatar 9" className={styles.avatar} />
        </header>
      </div>
      <h1>User Stats</h1>
      {/* Add other components or content for User Stats here */}
    </div>
  );
};

export default User;



