'use client';
import { NumbersGameLevel } from '@/app/lib/definitions';
import { randomNumber } from '@/app/lib/utils';
import Card, { ECardStatus } from '@/app/ui/cards/Card';
import { lusitana } from '@/app/ui/fonts';
import NumbersKeyboard from '@/app/ui/keyboard/NumbersKeyboard';
import Lose from '@/app/ui/result-game/Lose';
import Countdown, { RefType } from '@/app/ui/timer/Countdown';
import { useEffect, useRef, useState } from 'react';

type StringAndNumber = number[] | string[];
type NumbersGameState = {
  userWinTimes: number;
  userLoseTimes: number;
  currentLevel: NumbersGameLevel;
  userInputList: StringAndNumber;
  sampleList: StringAndNumber;
};
export default function NumbersGame() {
  const defaultValueText: string = '?';
  const viewTime: number = 5;
  const answerTime: number = 6;
  const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const levels: NumbersGameLevel[] = [
    {
      level: 1,
      number: 1,
      times: 2,
    },
    {
      level: 2,
      number: 6,
      times: 5,
    },
    {
      level: 3,
      number: 7,
      times: 10,
    },
    {
      level: 4,
      number: 8,
      times: 10,
    },
    {
      level: 5,
      number: 9,
      times: 10,
    },
    {
      level: 6,
      number: 10,
      times: 10,
    },
    {
      level: 7,
      number: 11,
      times: 10,
    },
    {
      level: 8,
      number: 12,
      times: 10,
    },
    {
      level: 9,
      number: 13,
      times: 10,
    },
    {
      level: 10,
      number: 14,
      times: 10,
    },
  ];

  const [isShowSample, setIsShowSample] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<'win' | 'lose' | 'default'>(
    'default',
  );
  const [countDown, setCountDown] = useState<number>(viewTime);
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
  const childRef = useRef<RefType>(null);

  const stopCountdown = () => {
    if (childRef.current) {
      childRef.current.stopCountdown();
    }
  };
  const generateSampleList = (): number[] => {
    var newSampleList: number[] = [];
    for (let i = 0; i < currentLevel.number; i++) {
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
    let isWin = checkIsWin();
    if (isWin) {
      setNewGame(isWin);
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
    stopCountdown();
    setCountDown(viewTime);
    if (isWin) {
      if (userWinTimes == currentLevel.times) {
        let nextLevel = levels.find((i) => i.level == currentLevel.level + 1);
        if (nextLevel) {
          setGameState({
            ...gameState,
            currentLevel: nextLevel,
            userWinTimes: 0,
            userInputList: [],
            sampleList: generateSampleList(),
          });
          setIsShowSample(true);
        } else {
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
  };
  const endGame = () => {
    setGameStatus('lose');
    console.log('setResultGame');
  };
  const restartGame = () => {};
  const timeoutCallback = () => {
    if (isShowSample) {
      setIsShowSample(false);
      setCountDown(answerTime);
    } else {
      setNewGame(checkIsWin());
    }
  };

  var comps = renderUserInputList();
  console.log(userInputList);
  return (
    <div className="flex flex-col items-center">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Level: {currentLevel.level} | Times: {userWinTimes}/{currentLevel.times}
      </h2>
      <div className="m-2 flex">
        <h3 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Times: {userWinTimes}/
        </h3>
        <h3
          className={`${lusitana.className} mb-4 text-xl text-red-600 md:text-2xl`}
        >
          {userLoseTimes}
        </h3>
        <h3 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          /{currentLevel.times}
        </h3>
      </div>
      {gameStatus == 'default' ? (
        <div>
          <Countdown
            ref={childRef}
            seconds={countDown}
            timeoutCallback={timeoutCallback}
          />
          <div className="m-2 flex flex-wrap">
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
          <div className="m-2 flex flex-wrap">{comps}</div>
          <NumbersKeyboard
            disable={isShowSample}
            onClickKeyboard={onClickKeyboard}
          />
        </div>
      ) : (
        <Lose reset={restartGame} />
      )}
    </div>
  );
}
