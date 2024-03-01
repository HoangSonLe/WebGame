'use client';
import { CardGameMode, GameLevel, ModeLevel } from '@/app/lib/definitions';
import { randomNumber, randomNumberWithSample } from '@/app/lib/utils';
import Card, { ECardStatus } from '@/app/ui/cards/Card';
import { lusitana } from '@/app/ui/fonts';
import { CharacterKeyType } from '@/app/ui/keyboard/Keyboard';
import Lose from '@/app/ui/result-game/Lose';
import StartGame from '@/app/ui/result-game/StartGame';
import Win from '@/app/ui/result-game/Win';
import { RefType } from '@/app/ui/timer/Countdown';
import { useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { cardGameModelData, modeLevelData } from '@/app/lib/data';
import CardV2 from '@/app/ui/cards/CardV2';

type CardGameState = {
  userWinTimes: number;
  userLoseTimes: number;
  currentLevel: CardGameMode;
  modeLevel: ModeLevel;
  userInputList: CardResultType[];
  sampleList: CardResultType[];
  isShowSample: boolean;
};
type CardResultType = {
  xAxis: number;
  yAxis: number;
  value: number;
  userAnswerIndex?: number;
};
type CountdownType = {
  key: number;
  time: number;
  isPlaying: boolean;
};
export default function Page() {
  const defaultValueText: string = '';
  const viewTime: number = 3;
  const answerTime: number = 10;
  const currentAnswerIndex = useRef<number>(1);
  // const viewTime: number = 3 + modeLevel.time;
  // const answerTime: number = 10 + modeLevel.time;

  const [gameState, setGameState] = useState<CardGameState>({
    userWinTimes: 0,
    userLoseTimes: 0,
    currentLevel: cardGameModelData[0],
    userInputList: [] as CardResultType[],
    sampleList: [] as CardResultType[],
    isShowSample: true,
    modeLevel: modeLevelData[0],
  } as CardGameState);
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
  const checkIsWin = (): boolean => {
    console.log('checkwin');
    var isWin = true;
    for (var i = 0; i < sampleList.length; ++i) {
      var checkItem = userInputList.find(
        (j) =>
          j.xAxis == sampleList[i].xAxis &&
          j.yAxis == sampleList[i].yAxis &&
          j.value == sampleList[i].value,
      );
      if (!checkItem) {
        isWin = false;
        break;
      }
    }
    return isWin;
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
  // const renderUserInputList = () => {
  //   var Comps = [];
  //   for (let i = 0; i < currentLevel.number; i++) {
  //     let valueCard = userInputList[i]
  //       ? userInputList[i].toString()
  //       : defaultValueText;
  //     let status = ECardStatus.Default;
  //     let props = {};
  //     if (valueCard != defaultValueText) {
  //       if (valueCard == sampleList[i].toString()) {
  //         status = ECardStatus.Success;
  //       } else {
  //         status = ECardStatus.Error;
  //       }
  //       props = { ...{ backCharacterKey: valueCard }, ...props };
  //     } else {
  //       props = { ...{ frontCharacterKey: defaultValueText }, ...props };
  //     }
  //     Comps.push(<Card status={status} key={i} {...props} />);
  //   }
  //   return Comps;
  // };
  const setNewGame = (isWin: boolean) => {
    if (isWin) {
      if (userWinTimes + 1 == currentLevel.times) {
        let nextLevel = cardGameModelData.find(
          (i) => i.level == currentLevel.level + 1,
        );
        if (nextLevel) {
          setGameState({
            ...gameState,
            isShowSample: true,
            currentLevel: nextLevel,
            userWinTimes: 0,
            userInputList: [],
            sampleList: generateSampleList(),
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
  // const restartGame = () => {
  //   // setGameState({
  //   //   userWinTimes: 0,
  //   //   userLoseTimes: 0,
  //   //   currentLevel: levels[0],
  //   //   userInputList: [] as CharacterKeyType[],
  //   //   sampleList: generateSampleList(),
  //   //   isShowSample: true,
  //   // } as MemoryGameState);
  //   // setGameStatus('default');
  // };
  // //#region COUNTDONW
  // const timeoutCallback = () => {
  //   // if (gameStatus == 'default') {
  //   //   if (isShowSample) {
  //   //     setGameState({
  //   //       ...gameState,
  //   //       isShowSample: false,
  //   //     });
  //   //     setCountDownState({
  //   //       ...countDownState,
  //   //       key: countDownState.key + 1,
  //   //       time: answerTime,
  //   //     });
  //   //   } else {
  //   //     setNewGame(checkIsWin());
  //   //   }
  //   //   return { shouldRepeat: true, delay: 1 };
  //   // }
  //   // return { shouldRepeat: false };
  // };

  // const renderCountdownContent = ({
  //   remainingTime,
  // }: {
  //   remainingTime: number;
  // }) => {
  //   if (remainingTime === 0) {
  //     return <div className="timer">Too lale...</div>;
  //   }

  //   return (
  //     <div
  //       className={`${lusitana.className} flex flex-col items-center text-sm`}
  //     >
  //       <div className="font-bold">
  //         {isShowSample && userInputList.length == 0 ? 'Viewing' : 'Answering'}
  //       </div>
  //       <div> {remainingTime} seconds</div>
  //     </div>
  //   );
  // };
  // //#endregion
  // const renderGameView = () => {
  //   switch (gameStatus) {
  //     // case 'start':
  //     //   return <StartGame title={titleGame} startGame={restartGame} />;
  //     case 'default':
  //       return (
  //         <div className="m-1 flex w-[100%] flex-col flex-wrap items-center justify-center">
  //           <CountdownCircleTimer
  //             size={100}
  //             isPlaying={isPlaying}
  //             key={key}
  //             duration={time}
  //             colors={['#004777', '#F7B801', '#A30000', '#A30000']}
  //             colorsTime={[10, 6, 3, 0]}
  //             onComplete={timeoutCallback}
  //           >
  //             {renderCountdownContent}
  //           </CountdownCircleTimer>
  //           <div className="m-2 mt-3 flex flex-wrap justify-center">
  //             {sampleList.map((i, index) => {
  //               return (
  //                 <Card
  //                   status={ECardStatus.Default}
  //                   key={index}
  //                   frontCharacterKey={!isShowSample ? defaultValueText : i}
  //                   backCharacterKey={!isShowSample ? i : undefined}
  //                 />
  //               );
  //             })}
  //           </div>
  //           <div className="m-2 flex flex-wrap justify-center">{comps}</div>
  //           {childrenKeyboard(isShowSample, onClickKeyboard)}
  //         </div>
  //       );
  //     case 'lose':
  //       return <Lose reset={restartGame} />;
  //     case 'win':
  //       return <Win reset={restartGame} />;
  //     default:
  //       return (
  //         <h2 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
  //           <b>Not Found This Type</b>
  //         </h2>
  //       );
  //   }
  // };
  // var comps = renderUserInputList();
  // if (gameStatus == 'start')
  //   return <StartGame title={titleGame} startGame={restartGame} />;

  var existNumberRandomList: number[] = [];
  const getRandomNumber = (maxRandom: number): number => {
    var sample: number[] = [];
    for (var i = 1; i <= maxRandom; ++i) {
      sample.push(i);
    }
    var num = randomNumberWithSample(
      sample.filter((i) => !existNumberRandomList.includes(i)),
    );
    if (existNumberRandomList.includes(num)) {
      num = getRandomNumber(maxRandom);
    }
    return num;
  };
  const generateSampleList = (): CardResultType[] => {
    var beginCount = 10;
    existNumberRandomList = [];
    if (sampleList.length > beginCount) {
      if (userWinTimes >= currentLevel.times) {
        beginCount = sampleList.length + 1;
      } else {
        beginCount = sampleList.length;
      }
    }
    var newSampleList: CardResultType[] = [];

    for (let i = 0; i < beginCount; i++) {
      var point: CardResultType = {
        xAxis: randomNumber(currentLevel.x_Axis),
        yAxis: randomNumber(currentLevel.y_Axis),
        value: getRandomNumber(beginCount),
      };
      existNumberRandomList.push(point.value as number);

      newSampleList.push(point);
    }
    return newSampleList;
  };
  const onClickCard = (
    xAxis: number | string,
    yAxis: number | string,
    value: number | string,
  ) => {
    if (userInputList.length == sampleList.length) {
      return;
    } else {
      setGameState({
        ...gameState,
        userInputList: [
          ...userInputList,
          {
            xAxis: xAxis,
            yAxis: yAxis,
            value: value,
          } as CardResultType,
        ],
      });
      // currentAnswerIndex.current++;
      // if (value !== defaultValueText) {
      //   let item = sampleList.find((i) => i.value == value) as CardResultType;
      //   if (!item.userAnswerIndex) {
      //     item.userAnswerIndex = currentAnswerIndex.current;
      //     setGameState({
      //       ...gameState,
      //     });
      //   }
      // }
    }
  };
  console.log(sampleList, userWinTimes, userLoseTimes);
  return (
    <div
      className="flex items-center justify-center"
      style={{
        border: '2px solid black',
        padding: '2px',
        width: 'fit-content',
      }}
    >
      {Array(currentLevel.x_Axis)
        .fill(1)
        .map((x, XIndex) => {
          {
            return (
              <div
                key={XIndex + 'X'}
                style={{
                  padding: '1px',
                }}
              >
                {Array(currentLevel.y_Axis)
                  .fill(1)
                  .map((y, YIndex) => {
                    let value = sampleList.find(
                      (i) => i.xAxis == XIndex && i.yAxis == YIndex,
                    );
                    let background = value?.userAnswerIndex ? 'grey' : 'unset';
                    let border = userInputList.find(
                      (i) => i.xAxis == XIndex && i.yAxis == YIndex,
                    );
                    return (
                      <CardV2
                        key={XIndex + YIndex}
                        frontCharacterKey={value?.value || defaultValueText}
                      />
                    );
                    return (
                      <div
                        style={{
                          height: '30px',
                          width: '30px',
                          border: '1px solid black',
                          borderRadius: '4px',
                          borderColor: border ? 'red' : 'black',
                          margin: '4px',
                          textAlign: 'center',
                          lineHeight: '1.8em',
                          background: background,
                        }}
                        key={XIndex + YIndex}
                        onClick={() =>
                          onClickCard(
                            XIndex,
                            YIndex,
                            value?.value || defaultValueText,
                          )
                        }
                      >
                        {value?.value ?? defaultValueText}
                      </div>
                    );
                  })}
              </div>
            );
          }
        })}
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
      {/* {renderGameView()} */}
    </div>
  );
}
