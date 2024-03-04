'use client';
import styles from '@/app/dashboard/cards/CardsPage.module.css';
import { cardGameModelData, modeLevelData } from '@/app/lib/data';
import { CardGameMode, GameLevel, ModeLevel } from '@/app/lib/definitions';
import { randomNumber, randomNumberWithSample } from '@/app/lib/utils';
import { lusitana } from '@/app/ui/fonts';
import { CharacterKeyType } from '@/app/ui/keyboard/Keyboard';
import Lose from '@/app/ui/result-game/Lose';
import StartGame from '@/app/ui/result-game/StartGame';
import Win from '@/app/ui/result-game/Win';
import clsx from 'clsx';
import React, { ReactNode, useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

type CardGameState = {
  userWinTimes: number;
  userLoseTimes: number;
  currentLevel: CardGameMode;
  modeLevel: ModeLevel;
  userInputList: CardResultType[];
  sampleList: CardResultType[];
  isShowSample: boolean;
  currentIndex: number;
  beginCount: number;
  hasWrongSelect: boolean;
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
type LevelFormType = {
  level: string;
  beginCount: number;
};
var showStyle: React.CSSProperties = {
  background: 'unset',
  color: 'white',
  textShadow: '0px 0px 10px white',
};
var hiddenStyle: React.CSSProperties = {
  background: 'white',
  color: 'transparent',
  // boxShadow: "0px 0px 10px white",
  borderRadius: '0.3em',
};
export default function Page() {
  const viewTime: number = 5;
  const answerTime: number = 10;
  const defaultGameState = {
    userWinTimes: 0,
    userLoseTimes: 0,
    currentLevel: cardGameModelData[3],
    userInputList: [] as CardResultType[],
    sampleList: [] as CardResultType[],
    isShowSample: true,
    modeLevel: modeLevelData[0],
    currentIndex: 1,
    hasWrongSelect: false,
    beginCount: 10,
  } as CardGameState;
  const [gameState, setGameState] = useState<CardGameState>(defaultGameState);
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
    currentIndex,
    hasWrongSelect,
    beginCount,
  } = gameState;
  const { isPlaying, key, time } = countDownState;
  const [formData, setFormData] = useState<LevelFormType>({
    level: currentLevel.level.toString(),
    beginCount: beginCount,
  });
  var existNumberRandomList: number[] = [];

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
  const generateSampleList = (specialBegin?: number): CardResultType[] => {
    existNumberRandomList = [];

    var newSampleList: CardResultType[] = [];
    var max = specialBegin ?? beginCount;
    for (let i = 0; i < max; i++) {
      var point: CardResultType = {
        xAxis: randomNumber(currentLevel.x_Axis),
        yAxis: randomNumber(currentLevel.y_Axis),
        value: getRandomNumber(max),
      };

      //Handle same xAxis and yAxis
      var sameItem = newSampleList.find(
        (j) => j.xAxis == point.xAxis && j.yAxis == point.yAxis,
      );
      while (sameItem) {
        point.xAxis = randomNumber(currentLevel.x_Axis);
        point.yAxis = randomNumber(currentLevel.y_Axis);
        sameItem = newSampleList.find(
          (j) => j.xAxis == point.xAxis && j.yAxis == point.yAxis,
        );
      }

      existNumberRandomList.push(point.value as number);

      newSampleList.push(point);
    }
    return newSampleList;
  };
  useEffect(() => {
    if (userInputList.length == sampleList.length && sampleList.length > 0) {
      let timer1 = setTimeout(() => {
        let isWin = checkIsWin();
        setNewGame(isWin);
        console.log('time out');
      }, 1500);
      return () => {
        clearTimeout(timer1);
      };
    }
  }, [userInputList]);

  // useEffect(() => {
  //   setGameState({
  //     ...gameState,
  //     sampleList: generateSampleList(),
  //   });
  // }, []);
  useEffect(() => {
    if (userLoseTimes == currentLevel.times) endGame();
  }, [userLoseTimes]);

  const setNewGame = (isWin: boolean) => {
    if (isWin && !hasWrongSelect) {
      if (beginCount == currentLevel.x_Axis * currentLevel.y_Axis) {
        let nextLevel = cardGameModelData.find(
          (i) => i.level == currentLevel.level + 1,
        );
        if (nextLevel) {
          setGameState({
            ...defaultGameState,
            currentLevel: nextLevel,
            sampleList: generateSampleList(),
          });
        } else {
          setGameStatus('win');

          console.log('Bạn đã vượt qua hết vòng.');
        }
      } else if (userWinTimes + 1 == currentLevel.times) {
        setGameState({
          ...gameState,
          isShowSample: true,
          beginCount: beginCount + 1,
          userWinTimes: 0,
          userInputList: [],
          sampleList: generateSampleList(beginCount + 1),
          currentIndex: 1,
        });
      } else {
        setGameState({
          ...gameState,
          isShowSample: true,
          userWinTimes: userWinTimes + 1,
          userInputList: [],
          currentIndex: 1,
          sampleList: generateSampleList(),
        });
      }
    } else {
      setGameState({
        ...gameState,
        isShowSample: true,
        userLoseTimes: userLoseTimes + 1,
        userInputList: [],
        currentIndex: 1,
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
      ...defaultGameState,
      sampleList: generateSampleList(),
    } as CardGameState);
    setGameStatus('default');
  };
  // //#region COUNTDONW
  const timeoutCallback = () => {
    if (gameStatus == 'default') {
      setGameState({
        ...gameState,
        hasWrongSelect: false,
        isShowSample: false,
      });
    }
    return { shouldRepeat: false };
  };

  const renderCountdownContent = ({
    remainingTime,
  }: {
    remainingTime: number;
  }) => {
    return (
      <div
        className={`${lusitana.className} flex flex-col items-center text-base text-sm`}
      >
        <div className="font-bold">
          Mode: {currentLevel.x_Axis} * {currentLevel.y_Axis}
        </div>
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
      </div>
    );
  };
  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    let selectLevel = cardGameModelData.find(
      (i) => i.level.toString() == formData.level,
    );
    setCountDownState({
      ...countDownState,
      key: countDownState.key + 1,
      time: viewTime,
    });
    setGameState({
      ...defaultGameState,
      currentLevel: selectLevel,
      sampleList: generateSampleList(formData.beginCount),
    } as CardGameState);
  };
  const onChangeLevel = (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      level: event.target.value.toString(),
    });
  };
  const onChangeBeginCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      beginCount: parseInt(event.target.value),
    });
  };
  // //#endregion
  const renderGameView = () => {
    switch (gameStatus) {
      case 'start':
        return (
          <StartGame title={'Chimpanzee Memory Game'} startGame={restartGame} />
        );
      case 'default':
        return (
          <div
            className="flex flex-wrap items-center justify-center"
            style={{
              padding: '2px',
              width: 'fit-content',
              borderRadius: '0.3em',
            }}
          >
            <div className="m-2 flex flex-wrap items-center justify-center">
              <CountdownCircleTimer
                size={150}
                isPlaying={true}
                key={key}
                duration={time}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[5, 3, 1, 0]}
                onComplete={timeoutCallback}
              >
                {renderCountdownContent}
              </CountdownCircleTimer>
              <form onSubmit={onSubmitForm}>
                <div className="m-1 flex flex-wrap items-center justify-center">
                  <FormControl
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                    fullWidth
                  >
                    <InputLabel id="demo-select-small-label">Level</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={currentLevel.level.toString()}
                      label="Level"
                      onChange={onChangeLevel}
                      sx={{ marginBottom: '10px' }}
                    >
                      {cardGameModelData.map((i) => (
                        <MenuItem key={i.level} value={i.level}>
                          {i.x_Axis} * {i.y_Axis}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextField
                      id="outlined-basic"
                      label="Max"
                      variant="outlined"
                      size="small"
                      defaultValue={beginCount}
                      sx={{ marginBottom: '10px' }}
                      onChange={onChangeBeginCount}
                    />
                  </FormControl>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
            <div
              style={{
                border: '2px solid black',
                padding: '2px',
                width: 'fit-content',
                borderRadius: '0.3em',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  border: '2px solid black',
                  padding: '2px',
                  width: 'fit-content',
                  background: 'black',
                  borderRadius: '0.3em',
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
                              let item = sampleList.find(
                                (i) => i.xAxis == XIndex && i.yAxis == YIndex,
                              );
                              var style: React.CSSProperties =
                                (isShowSample && item) || !item
                                  ? showStyle
                                  : hiddenStyle;
                              let existAnswerItem = userInputList.find(
                                (i) => i.xAxis == XIndex && i.yAxis == YIndex,
                              );

                              return (
                                <div
                                  className={clsx(
                                    existAnswerItem ? styles.minimizeCSS : '',
                                  )}
                                  style={{
                                    height: '35px',
                                    width: '35px',
                                    margin: '4px',
                                    textAlign: 'center',
                                    lineHeight: '1.8em',
                                    userSelect: 'none',
                                    fontSize: '20px',
                                    ...style,
                                  }}
                                  key={XIndex + YIndex}
                                  onClick={(e) => {
                                    if (item && !isShowSample) {
                                      if (item.value == currentIndex) {
                                        onClickCard(XIndex, YIndex, item.value);
                                      } else {
                                        e.preventDefault();
                                        onClickWrong(e);
                                      }
                                    }
                                  }}
                                >
                                  {item?.value ?? null}
                                </div>
                              );
                            })}
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
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

  const onClickCard = (
    xAxis: number | string,
    yAxis: number | string,
    value: number | null,
  ) => {
    if (currentIndex == value) {
      if (userInputList.length == sampleList.length) {
        return;
      } else {
        setGameState({
          ...gameState,
          currentIndex: currentIndex + 1,
          userInputList: [
            ...userInputList,
            {
              xAxis: xAxis,
              yAxis: yAxis,
              value: value,
            } as CardResultType,
          ],
        });
      }
    }
  };

  const onClickWrong = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const element = event.currentTarget as HTMLDivElement;
    if (element) {
      const backgroundColor = element.style.backgroundColor;
      // Convert background-color to RGB format
      const rgbColor = backgroundColor.match(/\d+/g);
      if (rgbColor) {
        // const rgb = `rgb(${rgbColor.join(', ')})`;
        // console.log('RGB color:', rgb);
      } else {
        var currentStyle = element.style;
        currentStyle.setProperty('background', 'rgba(255, 99, 71, 0.8)');
      }
    }
    if (!hasWrongSelect) {
      setGameState({
        ...gameState,
        hasWrongSelect: true,
      });
    }
  };
  console.log(gameState);
  if (gameStatus == 'start')
    return (
      <StartGame
        title={'Chimpanzee Memory Game'}
        startGame={restartGame}
        customRender={(): ReactNode => {
          return (
            <main className="flex h-full flex-col items-center justify-center">
              <h2 className="m-2 text-center font-medium">
                The game gets ideas from this video
              </h2>
              <video width="320" height="240" controls>
                <source src="/videos/videoplayback.mp4" type="video/mp4" />
                <track
                  // src="/path/to/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                Your browser does not support the video tag.
              </video>
            </main>
          );
        }}
      />
    );
  return <div>{renderGameView()}</div>;
}
