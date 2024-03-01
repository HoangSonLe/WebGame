'use client';
import { GameLevel, ModeLevel } from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/fonts';
import { CharacterKeyType } from '@/app/ui/keyboard/Keyboard';

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
export default function BoardGame({
  currentLevel,
  userLoseTimes,
  userWinTimes,
  modeLevel,
}: {
  currentLevel: GameLevel;
  userWinTimes: number;
  userLoseTimes: number;
  modeLevel: ModeLevel;
}) {
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
      </div>
    </div>
  );
}
