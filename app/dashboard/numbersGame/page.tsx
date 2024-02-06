'use client';
import { NumbersGameLevel } from '@/app/lib/definitions';
import { randomNumber } from '@/app/lib/utils';
import Card from '@/app/ui/cards/Card';
import NumbersKeyboard from '@/app/ui/keyboard/NumbersKeyboard';
import { useEffect, useState } from 'react';
export default function NumbersGame() {
  const defaultValueText: string = '?';
  const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const levels: NumbersGameLevel[] = [
    {
      level: 1,
      number: 5,
      times: 5,
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
  const [currentLevel, setCurrentLevel] = useState<NumbersGameLevel>(levels[0]);
  const [userInputNumberList, setUserInputNumberList] = useState<number[]>(
    [] as number[],
  );
  const generateSampleList = (): number[] => {
    var newSampleList: number[] = [];
    for (let i = 0; i < currentLevel.number; i++) {
      var randomIndex = randomNumber(numbers);
      newSampleList.push(randomIndex);
    }
    return newSampleList;
  };

  const [sampleList, setSampleList] = useState<number[]>([] as number[]);

  const checkIsWin = () => {
    let userString = userInputNumberList.join('');
    let sampleString = sampleList.join('');
    if (userString == sampleString) return true;
    return false;
  };

  const onClickKeyboard = (value: number): void => {
    setUserInputNumberList([...userInputNumberList, value]);
  };

  useEffect(() => {
    if (checkIsWin()) {
      setCurrentLevel(levels[currentLevel.level - 1]);
    }
  }, [userInputNumberList]);

  useEffect(() => {
    setSampleList(generateSampleList());
  }, [currentLevel]);

  var Comps = [];
  for (let i = 0; i < currentLevel.number; i++) {
    let valueCard = userInputNumberList[i]
      ? userInputNumberList[i].toString()
      : defaultValueText;
    let status = 'error';
    if(valueCard == sampleList[i].toString()){
      status = 'success';
    }
    Comps.push(<Card status= 'default' key={i} characterKey={valueCard} />);
  }
  return (
    <div className="flex flex-col items-center">
      <h3>Level: {currentLevel.level}</h3>
      <div className="m-2 flex flex-wrap">
        {sampleList.map((i, index) => {
          return <Card status='default'  key={index} characterKey={i} />;
        })}
      </div>
      <div className="m-2 flex flex-wrap">{Comps}</div>
      <NumbersKeyboard onClickKeyboard={onClickKeyboard} />
    </div>
  );
}
