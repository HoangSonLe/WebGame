'use client';
import { levelData, modeLevelData } from '@/app/lib/data';
import { GameLevel } from '@/app/lib/definitions';
import CoreCharacterGame from '@/app/ui/core-game/CoreCharacterGame';
import Keyboard from '@/app/ui/keyboard/Keyboard';

export default function NumbersGame() {
  const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const levels: GameLevel[] = levelData;
  const dataKeyboard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  return (
    <CoreCharacterGame
      titleGame="Numbers Game"
      levels={levels}
      sampleRandomList={numbers}
      modeLevel={modeLevelData[0]}
      childrenKeyboard={(isDisable, onClickKeyboard) => (
        <Keyboard
          disable={isDisable}
          dataKeyboard={dataKeyboard}
          onClickKeyboard={onClickKeyboard}
        />
      )}
    />
  );
}
