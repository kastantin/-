import { CHAR } from './palette';
import { Arms, Legs, outline, TORSO } from './parts';

// Герои серии 3: Бекс, Ахма, Надир (друзья Кости) и Тамада (ведущий банкета).
// Координаты те же: голова — центр (0,0), радиус 60; плечи y≈70, пояс y≈210, ботинки y≈305.

// --- Бекс: «официант года» ---------------------------------------------------

export function BeksHair() {
  return (
    <g>
      {/* зачёсанные назад волосы с боковым пробором */}
      <path d="M -58 -14 Q -62 -62 0 -64 Q 62 -62 58 -14 Q 40 -40 6 -42 Q -30 -40 -58 -14 Z" fill={CHAR.hairBlack} {...outline} />
      <path d="M 6 -62 Q 3 -50 9 -42" stroke={CHAR.skin} strokeWidth={2.4} fill="none" opacity={0.7} />
      <path d="M -32 -50 Q -12 -60 14 -56" stroke="#ffffff" strokeWidth={4.5} strokeLinecap="round" fill="none" opacity={0.85} />
    </g>
  );
}

// Блик на зубах: золотая искра у уголка улыбки
export function BeksSparkle() {
  return (
    <g transform="translate(33 16)">
      <path d="M 0 -11 Q 1.6 -1.6 11 0 Q 1.6 1.6 0 11 Q -1.6 1.6 -11 0 Q -1.6 -1.6 0 -11 Z" fill={CHAR.gold} stroke={CHAR.ink} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M 16 -12 l 0 8 M 12 -8 l 8 0" stroke={CHAR.gold} strokeWidth={2.4} strokeLinecap="round" />
    </g>
  );
}

// --- Ахма: «силач года» -------------------------------------------------------

// Бритая голова с бликом и бородкой под ртом
export function AkhmaHead() {
  return (
    <g>
      <path d="M -32 -42 Q -14 -56 8 -54" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.9} />
      <path d="M -26 44 Q 0 72 26 44 Q 0 56 -26 44 Z" fill={CHAR.hairBlack} {...outline} strokeWidth={2.2} />
    </g>
  );
}

const WIDE_TORSO = 'M -82 74 Q 0 44 82 74 L 74 214 L -74 214 Z';
const MUSCLE = 16;

export function AkhmaBody() {
  return (
    <g>
      <Legs color={CHAR.trousers} thick={14} />
      {/* шея */}
      <rect x={-34} y={52} width={68} height={34} rx={10} fill={CHAR.skin} {...outline} />
      <path d={WIDE_TORSO} fill={CHAR.shirt} {...outline} />
      {/* жилет, который еле сходится на груди */}
      <path d="M -72 80 L -24 70 L 0 150 L 24 70 L 72 80 L 68 216 L -68 216 Z" fill={CHAR.apron} {...outline} />
      {[110, 140, 170, 196].map((y) => (
        <circle key={y} cx={0} cy={y} r={3.4} fill={CHAR.gold} />
      ))}
      <path d="M 0 74 L -17 64 L -17 84 Z M 0 74 L 17 64 L 17 84 Z" fill={CHAR.ink} {...outline} strokeWidth={2} />
      <Arms color={CHAR.shirt} thick={MUSCLE} />
    </g>
  );
}

// Восемь тарелок на правой ладони и стакан чая в подстаканнике в левой (рисуется поверх тела)
export function AkhmaHeld() {
  const plates = Array.from({ length: 8 }, (_, i) => i);
  return (
    <g>
      <g transform="translate(76 168)">
        {plates.map((i) => (
          <g key={i} transform={`translate(0 ${-i * 7})`}>
            <ellipse cx={0} cy={0} rx={36} ry={7.5} fill="#f6f3ec" {...outline} strokeWidth={2.2} />
            <ellipse cx={0} cy={-1} rx={24} ry={4} fill="none" stroke="#c9ccd2" strokeWidth={1.6} />
          </g>
        ))}
      </g>
      <g transform="translate(-76 168)">
        <path d="M -9 -34 L 9 -34 L 7 0 L -7 0 Z" fill="#b8651f" {...outline} strokeWidth={2.2} />
        <path d="M -11 -30 L 11 -30 L 9 -4 L -9 -4 Z" fill="none" stroke={CHAR.steel} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 11 -22 Q 20 -20 11 -10" stroke={CHAR.steel} strokeWidth={3.4} fill="none" />
        <path d="M -3 -40 Q -9 -50 -3 -58 M 4 -40 Q 10 -50 4 -58" stroke="#d6d2cc" strokeWidth={3} strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

// --- Надир: «обычный официант» -----------------------------------------------

export function NadirHair() {
  return (
    <path
      d="M -58 -12 Q -68 -44 -44 -56 Q -40 -74 -14 -66 Q 0 -80 22 -66 Q 46 -72 50 -52 Q 70 -40 58 -12 Q 48 -34 24 -36 Q 4 -46 -16 -36 Q -40 -38 -58 -12 Z"
      fill={CHAR.hairBlack}
      {...outline}
    />
  );
}

// --- Тамада: ведущий банкета --------------------------------------------------

const CURLS: ReadonlyArray<readonly [number, number]> = [
  [-46, -30],
  [-34, -52],
  [-12, -62],
  [12, -62],
  [34, -52],
  [46, -30],
];

export function TamadaHair() {
  return (
    <g>
      {CURLS.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={14} fill={CHAR.hairBlack} {...outline} strokeWidth={2.4} />
      ))}
      <path d="M -56 -14 Q -60 -54 0 -52 Q 60 -54 56 -14 Q 40 -40 0 -40 Q -40 -40 -56 -14 Z" fill={CHAR.hairBlack} {...outline} strokeWidth={2.4} />
    </g>
  );
}

// Пышные усы + шарик микрофона перед лицом (рисуется поверх головы)
export function TamadaExtra() {
  return (
    <g>
      <path d="M -28 18 Q -14 2 0 10 Q 14 2 28 18 Q 14 26 0 19 Q -14 26 -28 18 Z" fill={CHAR.hairBlack} {...outline} strokeWidth={2.2} />
      <circle cx={15} cy={48} r={12} fill={CHAR.steel} {...outline} strokeWidth={2.6} />
      <path d="M 6 44 L 24 44 M 5 50 L 25 50 M 8 55 L 22 55" stroke="#8d9199" strokeWidth={1.8} />
    </g>
  );
}

export function TamadaBody() {
  return (
    <g>
      <Legs color="#2a2230" />
      <path d={TORSO} fill={CHAR.burgundy} {...outline} />
      <path d="M -18 66 L 0 128 L 18 66 Q 0 60 -18 66 Z" fill={CHAR.shirt} {...outline} strokeWidth={2.4} />
      <path d="M 0 76 L -20 64 L -20 90 Z M 0 76 L 20 64 L 20 90 Z" fill={CHAR.tie} {...outline} strokeWidth={2.2} />
      <path d="M -18 66 L -4 132 M 18 66 L 4 132" stroke={CHAR.gold} strokeWidth={3.4} fill="none" />
      {[158, 182].map((y) => (
        <circle key={y} cx={0} cy={y} r={4} fill={CHAR.gold} {...outline} strokeWidth={1.6} />
      ))}
      <path d="M -36 98 L -22 94 L -24 106 Z" fill="#ffffff" {...outline} strokeWidth={1.8} />
      {/* левая рука висит, правая согнута и держит микрофон у рта */}
      <rect x={-66} y={74} width={22} height={108} rx={11} fill={CHAR.burgundy} {...outline} transform="rotate(6 -55 74)" />
      <circle cx={-66} cy={186} r={11} fill={CHAR.skin} {...outline} />
      <rect x={44} y={74} width={22} height={84} rx={11} fill={CHAR.burgundy} {...outline} transform="rotate(-6 55 74)" />
      <g transform="translate(60 152) rotate(-35)">
        <rect x={-10} y={-62} width={20} height={66} rx={10} fill={CHAR.burgundy} {...outline} />
      </g>
      <circle cx={60} cy={152} r={11} fill={CHAR.burgundy} {...outline} />
      {/* кисть и ручка микрофона; шарик — в TamadaExtra, поверх головы */}
      <path d="M 24 96 L 17 58" stroke={CHAR.ink} strokeWidth={10} strokeLinecap="round" />
      <path d="M 24 96 L 17 58" stroke="#5a5d66" strokeWidth={5} strokeLinecap="round" />
      <circle cx={24} cy={101} r={11} fill={CHAR.skin} {...outline} />
    </g>
  );
}

// --- Начальник корпоратива (эпизодический герой, сцены 10 и 14) ----------------

export function BossHair() {
  return (
    <g>
      <path d="M -58 -14 Q -62 -60 0 -62 Q 62 -60 58 -14 Q 40 -34 4 -40 Q -34 -34 -58 -14 Z" fill={CHAR.hairBrown} {...outline} />
      <path d="M -40 -36 Q -10 -48 30 -40" stroke={CHAR.hairBrown} strokeWidth={5} strokeLinecap="round" fill="none" />
    </g>
  );
}

// Круглые очки поверх лица (глаза рисуются поверх, видны сквозь стёкла)
export function BossGlasses() {
  return (
    <g fill="none" stroke={CHAR.ink} strokeWidth={3}>
      <circle cx={-21} cy={-4} r={15} />
      <circle cx={21} cy={-4} r={15} />
      <path d="M -6 -5 L 6 -5 M -36 -6 L -58 -14 M 36 -6 L 58 -14" strokeLinecap="round" />
    </g>
  );
}

const BOSS_SUIT = '#2f4a3f';

export function BossBody() {
  return (
    <g>
      <Legs color="#262a30" />
      <path d="M -58 74 Q 0 52 58 74 L 56 214 L -56 214 Z" fill={BOSS_SUIT} {...outline} />
      <path d="M -18 66 L 0 128 L 18 66 Q 0 60 -18 66 Z" fill={CHAR.shirt} {...outline} strokeWidth={2.4} />
      <path d="M -6 72 L 6 72 L 9 112 L 0 124 L -9 112 Z" fill={CHAR.gold} {...outline} strokeWidth={2.2} />
      <path d="M -18 66 L -4 132 M 18 66 L 4 132" stroke={CHAR.ink} strokeWidth={2.4} fill="none" />
      <circle cx={0} cy={164} r={3.5} fill={CHAR.ink} />
      <Arms color={BOSS_SUIT} />
    </g>
  );
}
