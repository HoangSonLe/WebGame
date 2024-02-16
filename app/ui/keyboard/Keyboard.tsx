import styles from '@/app/ui/keyboard/Keyboard.module.css';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
export type CharacterKeyType = string | number;
interface KeyboardProps {
  disable: boolean;
  onClickKeyboard: (value: CharacterKeyType) => void;
  dataKeyboard: CharacterKeyType[][];
}
export default function Keyboard({
  disable,
  onClickKeyboard,
  dataKeyboard,
}: KeyboardProps) {
  // const dataKeyboard = [
  //   [1, 2, 3],
  //   [4, 5, 6],
  //   [7, 8, 9],
  // ];
  // const dataKeyboard = [
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  //   ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  //   ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  //   ['Caps', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter'],
  // ];
  const [disbaleState, setDisableState] = useState<boolean>(disable);
  const onClick = (data: CharacterKeyType) => {
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
              styles.keyboardRowAll,
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
