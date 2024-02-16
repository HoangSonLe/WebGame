'use clients'
import styles from '@/app/ui/keyboard/Keyboard.module.css';
import clsx from 'clsx';
export default function Keyboard1() {
  const dataKeyboard = [
    [1,2,3,4,5,6,7,8,9,0],
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Caps","Z","X","C","V","B","N","M","Enter"]
  ];
  return (
    <div className={styles.keyboard}>
        {
            dataKeyboard.map((current, index)=> {
                return <div key={index} className={clsx(styles.keyboardRow,styles.keyboardRowAll)}>
                        {current.map(j=> <div key={j} className={styles.keyLetter} data-char={j}>{j}</div>)}
                        </div>;
            })
        }
        
    </div>
    
  );
}
