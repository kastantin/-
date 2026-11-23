import { Face } from './Face';
import { EMOTIONS, type EmotionName, type Expression } from './expressions';
import { HandDrawn } from './HandDrawn';
import { CHAR, STROKE } from './palette';
import { AkhmaBody, AkhmaHead, BeksHair, BossBody, BossGlasses, BossHair, BeksSparkle, NadirHair, TamadaBody, TamadaExtra, TamadaHair } from './parts-ep03';
import { CasualBody, ChefBody, DimaHair, EduardHair, EduardMustache, GenaHat, GenaStubble, GuestHair, KostyaHair, SuitBody, WaiterBody } from './parts';

export type CharacterId = 'kostya' | 'eduard' | 'dima' | 'guest' | 'gena' | 'beks' | 'akhma' | 'nadir' | 'tamada' | 'boss';

interface CharacterDef {
  name: string;
  role: string;
  body: React.ReactNode;
  hair: React.ReactNode;
  extra?: React.ReactNode;
  mouthY: number;
  // цвет кожи, если отличается от общего (Надир — смуглый)
  skin?: string;
}

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  kostya: { name: 'Костя', role: 'официант', body: <WaiterBody />, hair: <KostyaHair />, mouthY: 26 },
  eduard: {
    name: 'Эдуард Борисович',
    role: 'управляющий',
    body: <SuitBody />,
    hair: <EduardHair />,
    extra: <EduardMustache />,
    mouthY: 30,
  },
  dima: { name: 'Дима', role: 'стажёр', body: <WaiterBody badge />, hair: <DimaHair />, mouthY: 26 },
  guest: { name: 'Гостья', role: 'стол 7', body: <CasualBody />, hair: <GuestHair />, mouthY: 26 },
  // половник в сценах рисуется отдельно (им машут), на листе персонажей — через held
  gena: { name: 'Гена', role: 'повар', body: <ChefBody ladle={false} />, hair: <GenaHat />, extra: <GenaStubble />, mouthY: 28 },
  // серия 3: друзья Кости и ведущий банкета
  beks: { name: 'Бекс', role: 'официант года', body: <WaiterBody vest towel />, hair: <BeksHair />, extra: <BeksSparkle />, mouthY: 26 },
  akhma: { name: 'Ахма', role: 'силач года', body: <AkhmaBody />, hair: <AkhmaHead />, mouthY: 26 },
  nadir: { name: 'Надир', role: 'обычный официант', body: <WaiterBody skin={CHAR.tan} sneakers />, hair: <NadirHair />, mouthY: 26, skin: CHAR.tan },
  boss: { name: 'Начальник корпоратива', role: 'гость банкета', body: <BossBody />, hair: <BossHair />, extra: <BossGlasses />, mouthY: 28 },
  tamada: { name: 'Тамада', role: 'ведущий банкета', body: <TamadaBody />, hair: <TamadaHair />, extra: <TamadaExtra />, mouthY: 30 },
};

// Персонаж внутри SVG-сцены: (x, footY) — точка между ступнями
// Живое состояние в кадре: моргает ли, говорит ли
export type LiveState = {
  blink?: boolean;
  talking?: boolean;
};

interface SceneCharacterProps extends LiveState {
  id: CharacterId;
  emotion?: EmotionName;
  x: number;
  footY: number;
  height: number;
  flip?: boolean;
  boilSeed?: number;
  // наклон всего персонажа вокруг ступней, в градусах (минус — влево)
  tilt?: number;
  held?: React.ReactNode;
}

export function SceneCharacter({ id, emotion, x, footY, height, flip = false, boilSeed, tilt = 0, blink, talking, held }: SceneCharacterProps) {
  const vb = VIEWBOX.full;
  const width = (height * vb.w) / vb.h;
  const flipTransform = flip ? ` translate(${width} 0) scale(-1 1)` : '';
  return (
    <g transform={`rotate(${tilt} ${x} ${footY})`}>
      <g transform={`translate(${x - width / 2} ${footY - height})${flipTransform}`}>
        <Character id={id} emotion={emotion} mode="full" height={height} boilSeed={boilSeed} blink={blink} talking={talking} held={held} />
      </g>
    </g>
  );
}

// Где у персонажа правая рука (в координатах сцены) — чтобы вложить в неё предмет
export function handPosition(x: number, footY: number, height: number, side: 1 | -1 = 1) {
  const s = height / VIEWBOX.full.h;
  return { x: x + side * 66 * s, y: footY - (VIEWBOX.full.y + VIEWBOX.full.h - 186) * s };
}

// Рамки видимой области: полный рост или только голова
const VIEWBOX = {
  full: { x: -95, y: -80, w: 190, h: 400 },
  head: { x: -80, y: -82, w: 160, h: 160 },
} as const;

interface CharacterProps extends LiveState {
  id: CharacterId;
  emotion?: EmotionName;
  mode?: keyof typeof VIEWBOX;
  height: number;
  boilSeed?: number;
  // предмет в руках, в координатах тела (рисуется поверх тела, под головой)
  held?: React.ReactNode;
}

// Моргание закрывает глаза (кроме «счастливых» дуг), разговор открывает рот
function liveExpression(base: Expression, { blink, talking }: LiveState): Expression {
  const eyes = blink && base.eyes !== 'happy' ? 'closed' : base.eyes;
  const mouth = talking ? 'open' : base.mouth;
  return { ...base, eyes, mouth };
}

export function Character({ id, emotion = 'neutral', mode = 'full', height, boilSeed = 1, blink, talking, held }: CharacterProps) {
  const def = CHARACTERS[id];
  const vb = VIEWBOX[mode];
  const width = (height * vb.w) / vb.h;
  const expression = liveExpression(EMOTIONS[emotion], { blink, talking });

  return (
    <svg width={width} height={height} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ overflow: 'visible' }}>
      <HandDrawn seed={boilSeed}>
        {mode === 'full' && def.body}
        {mode === 'full' && held}
        <circle cx={0} cy={0} r={60} fill={def.skin ?? CHAR.skin} stroke={CHAR.ink} strokeWidth={STROKE} />
        {def.hair}
        {def.extra}
        <Face expression={expression} mouthY={def.mouthY} />
      </HandDrawn>
    </svg>
  );
}
