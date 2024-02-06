import styles from '@/app/ui/Cards/Card.module.css';
import clsx from 'clsx';
export default function Card({
  characterKey,
  status,
}: {
  characterKey: string | number;
  status: 'default' | 'success' | 'error';
}) {
  return (
    <div className={clsx(styles.flipBox, styles.keyboard)}>
      <div
        className={clsx(
          styles.flipBoxInner,
          status === 'success' ? styles.flipBoxInnerHoverSuccess : "",
          status === 'error' ? styles.flipBoxInnerHoverError : "",
        )}
      >
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
