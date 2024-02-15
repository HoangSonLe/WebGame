'use client';
import { NumbersGameLevel } from '@/app/lib/definitions';
import { randomNumber } from '@/app/lib/utils';
import Card, { ECardStatus } from '@/app/ui/cards/Card';
import { lusitana } from '@/app/ui/fonts';
import NumbersKeyboard from '@/app/ui/keyboard/NumbersKeyboard';
import Lose from '@/app/ui/result-game/Lose';
import Win from '@/app/ui/result-game/Win';
import Countdown, { RefType } from '@/app/ui/timer/Countdown';
import { useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

type StringAndNumber = number[] | string[];
type NumbersGameState = {
  userWinTimes: number;
  userLoseTimes: number;
  currentLevel: NumbersGameLevel;
  userInputList: StringAndNumber;
  sampleList: StringAndNumber;
};
type CountdownType = {
  key: number;
  time: number;
  isPlaying: boolean;
};
export default function NumbersGame() {
  const defaultValueText: string = '?';
  const viewTime: number = 3;
  const answerTime: number = 10;
  const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const levels: NumbersGameLevel[] = [
    {
      level: 1,
      number: 1,
      times: 1,
    },
    // {
    //   level: 2,
    //   number: 6,
    //   times: 5,
    // },
    // {
    //   level: 3,
    //   number: 7,
    //   times: 10,
    // },
    // {
    //   level: 4,
    //   number: 8,
    //   times: 10,
    // },
    // {
    //   level: 5,
    //   number: 9,
    //   times: 10,
    // },
    // {
    //   level: 6,
    //   number: 10,
    //   times: 10,
    // },
    // {
    //   level: 7,
    //   number: 11,
    //   times: 10,
    // },
    // {
    //   level: 8,
    //   number: 12,
    //   times: 10,
    // },
    // {
    //   level: 9,
    //   number: 13,
    //   times: 10,
    // },
    // {
    //   level: 10,
    //   number: 14,
    //   times: 10,
    // },
  ];

  const [isShowSample, setIsShowSample] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<'win' | 'lose' | 'default'>(
    'default',
  );
  const [countDownState, setCountDownState] = useState<CountdownType>({
    key: 0,
    time: viewTime,
    isPlaying: true,
  });
  const [gameState, setGameState] = useState<NumbersGameState>({
    userWinTimes: 0,
    userLoseTimes: 0,
    currentLevel: levels[0],
    userInputList: [] as StringAndNumber,
    sampleList: [] as StringAndNumber,
  } as NumbersGameState);

  const {
    userWinTimes,
    userLoseTimes,
    currentLevel,
    userInputList,
    sampleList,
  } = gameState;
  const { isPlaying, key, time } = countDownState;
  const childRef = useRef<RefType>(null);

  const stopCountdown = () => {
    if (childRef.current) {
      childRef.current.stopCountdown();
    }
  };
  const generateSampleList = (nextLevel?: NumbersGameLevel): number[] => {
    var newSampleList: number[] = [];
    let currentLevelTmp = nextLevel ?? currentLevel;

    for (let i = 0; i < currentLevelTmp.number; i++) {
      var randomIndex = randomNumber(numbers);
      newSampleList.push(randomIndex);
    }
    return newSampleList;
  };
  const checkIsWin = () => {
    if (userInputList.length != sampleList.length) return false;
    let userString = userInputList.join('');
    let sampleString = sampleList.join('');
    if (userString == sampleString) return true;
    return false;
  };

  const onClickKeyboard = (value: number): void => {
    setGameState({
      ...gameState,
      userInputList: [...userInputList, value] as StringAndNumber,
    });
  };

  useEffect(() => {
    if (userInputList.length == sampleList.length && sampleList.length > 0) {
      stopCountdown();
      let timer1 = setTimeout(() => {
        let isWin = checkIsWin();
        setNewGame(isWin);
        console.log('time out');
      }, 1000);
      return () => {
        clearTimeout(timer1);
      };
    }
  }, [userInputList]);

  useEffect(() => {
    setGameState({
      ...gameState,
      sampleList: generateSampleList(),
    });
  }, []);
  useEffect(() => {
    if (userLoseTimes == currentLevel.times) endGame();
  }, [userLoseTimes]);
  const renderUserInputList = () => {
    var Comps = [];
    for (let i = 0; i < currentLevel.number; i++) {
      let valueCard = userInputList[i]
        ? userInputList[i].toString()
        : defaultValueText;
      let status = ECardStatus.Default;
      let props = {};
      if (valueCard != defaultValueText) {
        if (valueCard == sampleList[i].toString()) {
          status = ECardStatus.Success;
        } else {
          status = ECardStatus.Error;
        }
        props = { ...{ backCharacterKey: valueCard }, ...props };
      } else {
        props = { ...{ frontCharacterKey: defaultValueText }, ...props };
      }
      Comps.push(<Card status={status} key={i} {...props} />);
    }
    return Comps;
  };
  const setNewGame = (isWin: boolean) => {
    if (isWin) {
      if (userWinTimes + 1 == currentLevel.times) {
        let nextLevel = levels.find((i) => i.level == currentLevel.level + 1);
        if (nextLevel) {
          setGameState({
            ...gameState,
            currentLevel: nextLevel,
            userWinTimes: 0,
            userInputList: [],
            sampleList: generateSampleList(nextLevel),
          });
          setIsShowSample(true);
        } else {
          setGameStatus('win');
          // setCountDownState({
          //   ...countDownState,
          //   key: key + 1,
          //   time: viewTime,
          //   isPlaying: false,
          // });
          console.log('Bạn đã vượt qua hết vòng.');
        }
      } else {
        setGameState({
          ...gameState,
          userWinTimes: userWinTimes + 1,
          userInputList: [],
          sampleList: generateSampleList(),
        });
        setIsShowSample(true);
      }
    } else {
      setGameState({
        ...gameState,
        userLoseTimes: userLoseTimes + 1,
        userInputList: [],
        sampleList: generateSampleList(),
      });
      setIsShowSample(true);
    }
    setCountDownState({
      ...countDownState,
      key: countDownState.key + 1,
      time: viewTime,
    });
  };
  const endGame = () => {
    setGameStatus('lose');
    console.log('setResultGame');
  };
  const restartGame = () => {
    setGameState({
      userWinTimes: 0,
      userLoseTimes: 0,
      currentLevel: levels[0],
      userInputList: [] as StringAndNumber,
      sampleList: generateSampleList(),
    } as NumbersGameState);
    setGameStatus('default');
  };
  const timeoutCallback = () => {
    if (gameStatus == 'default') {
      if (isShowSample) {
        setIsShowSample(false);
        setCountDownState({
          ...countDownState,
          key: countDownState.key + 1,
          time: answerTime,
        });
      } else {
        setNewGame(checkIsWin());
      }
      return { shouldRepeat: true, delay: 1 };
    }
    return { shouldRepeat: false };
  };

  const renderTime = ({ remainingTime }: { remainingTime: number }) => {
    if (remainingTime === 0) {
      return <div className="timer">Too lale...</div>;
    }

    return (
      <div
        className={`${lusitana.className} flex flex-col items-center text-sm`}
      >
        <div className="font-bold">
          {isShowSample ? 'Viewing' : 'Answering'}
        </div>
        <div> {remainingTime} seconds</div>
      </div>
    );
  };
  const renderResult = () => {
    switch (gameStatus) {
      case 'default':
        return (
          <div className="m-1 flex flex-col flex-wrap items-center justify-center">
            <CountdownCircleTimer
              size={100}
              isPlaying={isPlaying}
              key={key}
              duration={time}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[10, 6, 3, 0]}
              onComplete={timeoutCallback}
            >
              {renderTime}
            </CountdownCircleTimer>
            <div className="m-2 mt-3 flex flex-wrap justify-center">
              {sampleList.map((i, index) => {
                return (
                  <Card
                    status={ECardStatus.Default}
                    key={index}
                    frontCharacterKey={!isShowSample ? defaultValueText : i}
                    backCharacterKey={!isShowSample ? i : undefined}
                  />
                );
              })}
            </div>
            <div className="m-2 flex flex-wrap justify-center">{comps}</div>
            <NumbersKeyboard
              disable={isShowSample}
              onClickKeyboard={onClickKeyboard}
            />
          </div>
        );
      case 'lose':
        return <Lose reset={restartGame} />;
      case 'win':
        return <Win reset={restartGame} />;
      default:
        return (
          <h2 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
            <b>Not Found This Type</b>
          </h2>
        );
    }
  };
  var comps = renderUserInputList();
  console.log(answerTime);
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
        <b>Level:</b> {currentLevel.level} | <b>Times:</b> {userWinTimes}/
        {currentLevel.times}
      </h2>
      <div className="m-1 flex">
        <h3 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
          <b>Turns:</b> {userWinTimes}/
        </h3>
        <h3
          className={`${lusitana.className} mb-2 text-xl text-red-600 md:text-2xl`}
        >
          {userLoseTimes}
        </h3>
        <h3 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
          /{currentLevel.times}
        </h3>
      </div>
      {renderResult()}
    </div>
  );
}
