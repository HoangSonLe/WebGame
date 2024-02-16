'use client';
import { GameLevel, ModeLevel } from '@/app/lib/definitions';
import { randomNumber } from '@/app/lib/utils';
import Card, { ECardStatus } from '@/app/ui/cards/Card';
import { lusitana } from '@/app/ui/fonts';
import { CharacterKeyType } from '@/app/ui/keyboard/Keyboard';
import Lose from '@/app/ui/result-game/Lose';
import StartGame from '@/app/ui/result-game/StartGame';
import Win from '@/app/ui/result-game/Win';
import { RefType } from '@/app/ui/timer/Countdown';
import { useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Keyboard from '../keyboard/Keyboard';
import { modeLevelData } from '@/app/lib/data';

type MemoryGameState = {
  userWinTimes: number;
  userLoseTimes: number;
  currentLevel: GameLevel;
  modeLevel: ModeLevel;
  userInputList: CharacterKeyType[];
  sampleList: CharacterKeyType[];
  isShowSample: boolean;
};
type CountdownType = {
  key: number;
  time: number;
  isPlaying: boolean;
};
export default function CoreCharacterGame({
  levels,
  sampleRandomList,
  childrenKeyboard,
  titleGame,
  modeLevel,
}: {
  levels: GameLevel[];
  sampleRandomList: CharacterKeyType[];
  titleGame: string;
  modeLevel: ModeLevel;
  childrenKeyboard: (
    isDisable: boolean,
    onClickKeyboardProp: (value: CharacterKeyType) => void,
  ) => JSX.Element;
}) {
  const defaultValueText: string = '?';
  const viewTime: number = 3 + modeLevel.time;
  const answerTime: number = 10 + modeLevel.time;

  const [gameState, setGameState] = useState<MemoryGameState>({
    userWinTimes: 0,
    userLoseTimes: 0,
    currentLevel: levels[0],
    userInputList: [] as CharacterKeyType[],
    sampleList: [] as CharacterKeyType[],
    isShowSample: true,
  } as MemoryGameState);
  const [gameStatus, setGameStatus] = useState<
    'win' | 'lose' | 'default' | 'start'
  >('start');

  const [countDownState, setCountDownState] = useState<CountdownType>({
    key: 0,
    time: viewTime,
    isPlaying: true,
  });

  const {
    userWinTimes,
    userLoseTimes,
    currentLevel,
    userInputList,
    sampleList,
    isShowSample,
  } = gameState;
  const { isPlaying, key, time } = countDownState;
  const childRef = useRef<RefType>(null);

  const stopCountdown = () => {
    if (childRef.current) {
      childRef.current.stopCountdown();
    }
  };
  const generateSampleList = (nextLevel?: GameLevel): number[] => {
    var newSampleList: number[] = [];
    let currentLevelTmp = nextLevel ?? currentLevel;

    for (let i = 0; i < currentLevelTmp.number; i++) {
      var randomIndex = randomNumber(sampleRandomList);
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

  const onClickKeyboard = (value: CharacterKeyType): void => {
    setGameState({
      ...gameState,
      isShowSample:
        userInputList.length + 1 == sampleList.length ? true : false,
      userInputList: [...userInputList, value] as CharacterKeyType[],
    });
  };

  useEffect(() => {
    if (userInputList.length == sampleList.length && sampleList.length > 0) {
      stopCountdown();
      let timer1 = setTimeout(() => {
        let isWin = checkIsWin();
        setNewGame(isWin);
        console.log('time out');
      }, 2000);
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
            isShowSample: true,
            currentLevel: nextLevel,
            userWinTimes: 0,
            userInputList: [],
            sampleList: generateSampleList(nextLevel),
          });
        } else {
          setGameStatus('win');

          console.log('Bạn đã vượt qua hết vòng.');
        }
      } else {
        setGameState({
          ...gameState,
          isShowSample: true,
          userWinTimes: userWinTimes + 1,
          userInputList: [],
          sampleList: generateSampleList(),
        });
      }
    } else {
      setGameState({
        ...gameState,
        isShowSample: true,
        userLoseTimes: userLoseTimes + 1,
        userInputList: [],
        sampleList: generateSampleList(),
      });
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
      userInputList: [] as CharacterKeyType[],
      sampleList: generateSampleList(),
      isShowSample: true,
    } as MemoryGameState);
    setGameStatus('default');
  };
  //#region COUNTDONW
  const timeoutCallback = () => {
    if (gameStatus == 'default') {
      if (isShowSample) {
        setGameState({
          ...gameState,
          isShowSample: false,
        });
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

  const renderCountdownContent = ({
    remainingTime,
  }: {
    remainingTime: number;
  }) => {
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
  //#endregion
  const renderGameView = () => {
    switch (gameStatus) {
      // case 'start':
      //   return <StartGame title={titleGame} startGame={restartGame} />;
      case 'default':
        return (
          <div className="m-1 flex w-[100%] flex-col flex-wrap items-center justify-center">
            <CountdownCircleTimer
              size={100}
              isPlaying={isPlaying}
              key={key}
              duration={time}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[10, 6, 3, 0]}
              onComplete={timeoutCallback}
            >
              {renderCountdownContent}
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
            {childrenKeyboard(isShowSample, onClickKeyboard)}
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
  if (gameStatus == 'start')
    return <StartGame title={titleGame} startGame={restartGame} />;
  return (
    <div className="flex flex-col items-center justify-center">
      {/* <div className="flex">
        <div>
          <div className="flex">
            <h3
              className={`${lusitana.className} mb-2 text-xl text-red-600 md:text-2xl`}
            >
              {currentLevel.level}
            </h3>
            <div className="rounded-[50%] border-[1px] border-[greenyellow] border-[solid] p-4">
              {modeLevel.name}
            </div>
          </div>
          <div>cdscdscsd</div>
        </div>
        <div>Avatar number</div>
      </div>
      <div className='flex border-t-[1px_solid_gray]'>
        <div className='p-2'>
          csdcds
        </div>
        <div className='p-2 border-t-[1px_solid_gray]'>
            pause
        </div>
      </div> */}

      <h2 className={`${lusitana.className} mb-1 text-xl md:text-2xl`}>
        <b>Level:</b> {currentLevel.level} | <b>Mode:</b> {modeLevel.name}
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
        <h3 className={`${lusitana.className} mb-2 ml-1 text-xl md:text-2xl`}>
          | <b>Times:</b> {userWinTimes}/{currentLevel.times}
        </h3>
      </div>
      {renderGameView()}
    </div>
  );
}
