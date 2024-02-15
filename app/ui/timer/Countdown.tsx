import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { lusitana } from '../fonts';
type CountdownType = {
  seconds: number;
  timeoutCallback: () => void;
};
export type RefType = {
  stopCountdown: () => void;
};

function Countdown(props: CountdownType, ref: Ref<RefType>) {
  const { seconds, timeoutCallback } = props;
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // Add a ref to store the interval id

  useImperativeHandle(ref, () => ({ stopCountdown }), []);

  useEffect(() => {
    if (timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => clearTimeout(intervalRef.current as NodeJS.Timeout);
  });
  const stopCountdown = () => {
    clearTimeout(intervalRef.current as NodeJS.Timeout);
  };
  // Add a listener to `timeLeft`
  useEffect(() => {
    if (timeLeft <= 0) {
      clearTimeout(intervalRef.current as NodeJS.Timeout);
      timeoutCallback();
    }
  }, [timeLeft]);

  useLayoutEffect(() => {
    setTimeout(() => {
      setTimeLeft(seconds);
    }, 500);
  }, [seconds]);
  return (
    <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
      {timeLeft}
    </h2>
  );
}
export default forwardRef(Countdown);
