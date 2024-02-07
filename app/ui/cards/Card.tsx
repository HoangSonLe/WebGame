import styles from '@/app/ui/Cards/Card.module.css';
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
  backCharacterKey?: string | number;
  status: ECardStatus;
};
export default function Card({
  frontCharacterKey,
  status,
  backCharacterKey,
}: CardType) {
  return (
    <div className={clsx(styles.flipBox, styles.keyboard)}>
      <div
        className={clsx(
          styles.flipBoxInner,
          status === ECardStatus.Success ? styles.flipBoxInnerHoverSuccess : '',
          status === ECardStatus.Error ? styles.flipBoxInnerHoverError : '',
        )}
      >
        {frontCharacterKey ? (
          <div className={styles.flipBoxFront}>
            <div className={styles.keyLetter} data-char={frontCharacterKey}>
              {frontCharacterKey}
            </div>
          </div>
        ) : null}
        {backCharacterKey ? (
          <div className={styles.flipBoxBack}>
            <div className={styles.keyLetter} data-char={backCharacterKey}>
              {backCharacterKey}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
