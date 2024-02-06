import styles from '@/app/ui/keyboard/Keyboard.module.css';

export default function KeyboardButton( {characterKey}:{characterKey:string}) {
  return (
    <div className={styles.keyboardRow}>
        <div className={styles.keyLetter} data-char={characterKey}>{characterKey}</div>
    </div>
  );
}
