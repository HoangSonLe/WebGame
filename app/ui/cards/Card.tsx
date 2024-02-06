import styles from '@/app/ui/Cards/Card.module.css';
import clsx from 'clsx';
export default function Card({ characterKey }: { characterKey: string }) {
  return (
    <div className={ clsx(styles.flipBox, styles.keyboard)}>
      <div className={styles.flipBoxInner}>
        <div className={styles.flipBoxFront}>
          <div className={styles.keyLetter} data-char={characterKey}>
            ?
          </div>
        </div>
        <div className={styles.flipBoxBack}>
          <div className={styles.keyLetter} data-char={characterKey}>
            {characterKey}
          </div>
        </div>
      </div>
    </div>
  );
}
