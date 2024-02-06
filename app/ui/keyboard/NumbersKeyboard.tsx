import styles from '@/app/ui/keyboard/Keyboard.module.css';
interface NumbersKeyboardProps {
  onClickKeyboard: (value: number) => void;
}
export default function NumbersKeyboard({
  onClickKeyboard,
}: NumbersKeyboardProps) {
  const dataKeyboard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  return (
    <div className={styles.keyboard}>
      {dataKeyboard.map((current, index) => {
        return (
          <div key={index} className={styles.keyboardRow}>
            {current.map((j) => (
              <div
                onClick={() => onClickKeyboard(j)}
                key={j}
                className={styles.keyLetter}
                data-char={j}
              >
                {j}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
