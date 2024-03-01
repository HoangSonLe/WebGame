import styles from '@/app/ui/cards/Card.module.css';
import clsx from 'clsx';
export enum ECardStatus {
  Default,
  Success,
  Error,
}
const defaults = {
  frontCharacterKey: null,
  backCharacterKey: null,
};
type CardType = {
  frontCharacterKey?: string | number;
  // backCharacterKey?: string | number;
  // status: ECardStatus;
};
export default function CardV2({
  frontCharacterKey,
}: CardType) {
  return (
    <div className={clsx(styles.flipBox, styles.keyboard)}>
      <div
        className={clsx(
          styles.flipBoxInner,
        )}
      >
        {/* {frontCharacterKey ? (
          <div className={styles.flipBoxFront}>
            <div className={styles.keyLetter} data-char={frontCharacterKey}>
              {frontCharacterKey}
            </div>
          </div>
        ) : null} */}
         <div className={styles.flipBoxBack}>
            <div className={styles.keyLetter}>
            </div>
          </div>
      </div>
    </div>
  );
}
