'use client';
import { levelData, modeLevelData } from '@/app/lib/data';
import { GameLevel } from '@/app/lib/definitions';
import CoreCharacterGame from '@/app/ui/core-game/CoreCharacterGame';
import NumbersKeyboard, { CharacterKeyType } from '@/app/ui/keyboard/Keyboard';

export default function AlphabetGame() {
  const alphabet: CharacterKeyType[] = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
  ];
  const dataKeyboard = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];
  const levels: GameLevel[] = levelData;

  return (
    <CoreCharacterGame
      titleGame="Alphabet Game"
      levels={levels}
      sampleRandomList={alphabet}
      modeLevel={modeLevelData[0]}
      childrenKeyboard={(isDisable, onClickKeyboard) => (
        <NumbersKeyboard
          disable={isDisable}
          dataKeyboard={dataKeyboard}
          onClickKeyboard={onClickKeyboard}
        />
      )}
    />
  );
}
