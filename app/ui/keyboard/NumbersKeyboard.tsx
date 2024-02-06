import styles from '@/app/ui/keyboard/Keyboard.module.css';
export default async function NumbersKeyboard() {
  const dataKeyboard = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
  ];
  return (
    <div className={styles.keyboard}>
        {
            dataKeyboard.map((current, index)=> {
                return <div key={index} className={styles.keyboardRow}>
                        {current.map(j=> <div key={j} className={styles.keyLetter} data-char={j}>{j}</div>)}
                        </div>;
            })
        }
        
    </div>
    
  );
}
