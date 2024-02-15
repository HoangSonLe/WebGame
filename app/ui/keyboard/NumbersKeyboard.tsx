import styles from '@/app/ui/keyboard/Keyboard.module.css';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
interface NumbersKeyboardProps {
  disable: boolean;
  onClickKeyboard: (value: number) => void;
}
export default function NumbersKeyboard({
  disable,
  onClickKeyboard,
}: NumbersKeyboardProps) {
  const dataKeyboard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const [disbaleState, setDisableState] = useState<boolean>(disable);
  const onClick = (data: number) => {
    if (!disable) {
      onClickKeyboard(data);
    } else return;
  };
  useEffect(() => {
    setDisableState(disable);
  }, [disable]);
  return (
    <div className={styles.keyboard}>
      {dataKeyboard.map((current, index) => {
        return (
          <div
            key={index}
            className={clsx(
              styles.keyboardRow,
              !disbaleState
                ? styles.keyboardRowActive
                : styles.keyboardRowDisable,
            )}
          >
            {current.map((j) => (
              <div
                onClick={() => onClick(j)}
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
