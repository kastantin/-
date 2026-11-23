import { CHAR, STROKE } from './palette';

// Детали персонажей: причёски, одежда, аксессуары (координаты головы: центр 0,0, r=60)

export const outline = { stroke: CHAR.ink, strokeWidth: STROKE, strokeLinejoin: 'round' as const };

export function KostyaHair() {
  return (
    <g>
      <path
        d="M -58 -16 Q -62 -68 0 -66 Q 60 -68 58 -16 Q 46 -48 14 -46 Q -18 -56 -58 -16 Z"
        fill={CHAR.hairDark}
        {...outline}
      />
      {/* ручка за ухом */}
      <g transform="rotate(18 56 4)">
        <rect x={52} y={-18} width={8} height={40} rx={3} fill={CHAR.pen} {...outline} strokeWidth={2.2} />
        <rect x={52} y={-18} width={8} height={8} rx={2} fill={CHAR.ink} />
      </g>
    </g>
  );
}

export function EduardHair() {
  return (
    <g>
      <path d="M -60 -6 Q -70 -32 -50 -40 Q -56 -22 -46 -4 Z" fill={CHAR.hairGrey} {...outline} strokeWidth={2.4} />
      <path d="M 60 -6 Q 70 -32 50 -40 Q 56 -22 46 -4 Z" fill={CHAR.hairGrey} {...outline} strokeWidth={2.4} />
      {/* блик на лысине */}
      <path d="M -18 -50 Q -6 -56 6 -54" stroke={CHAR.hairGrey} strokeWidth={4} strokeLinecap="round" fill="none" />
    </g>
  );
}

export function EduardMustache() {
  return (
    <path
      d="M -24 16 Q -12 4 0 11 Q 12 4 24 16 Q 12 22 0 17 Q -12 22 -24 16 Z"
      fill={CHAR.mustache}
      {...outline}
      strokeWidth={2.2}
    />
  );
}

export function DimaHair() {
  return (
    <path
      d="M -57 -16 L -52 -50 L -38 -40 L -30 -70 L -14 -50 L 0 -74 L 12 -52 L 28 -68 L 34 -44 L 50 -54 L 57 -22 Q 20 -54 -57 -22 Z"
      fill={CHAR.hairBrown}
      {...outline}
    />
  );
}

// Тело в координатах персонажа: плечи на y≈70, пояс на y≈210, ботинки на y≈305

// кроссовок: белый, красная полоса, серая подошва; cx — центр ступни
function Sneaker({ cx }: { cx: number }) {
  return (
    <g transform={`translate(${cx} 0)`}>
      <path d="M -20 292 L -20 300 Q -20 306 -12 306 L 20 306 Q 26 306 24 300 Q 22 296 12 294 L 0 288 Z" fill="#ffffff" {...outline} strokeWidth={2.6} />
      <path d="M -19 302 L 23 302" stroke={CHAR.tie} strokeWidth={3} />
      <rect x={-21} y={305} width={46} height={6} rx={3} fill="#d9dbe0" {...outline} strokeWidth={2} />
    </g>
  );
}

// thick — на сколько ноги толще обычных (силач); sneakers — вместо ботинок кроссовки
export function Legs({ color, sneakers = false, thick = 0 }: { color: string; sneakers?: boolean; thick?: number }) {
  const centre = 20 + thick / 2;
  return (
    <g>
      <rect x={-30 - thick} y={200} width={24 + thick} height={98} rx={8} fill={color} {...outline} />
      <rect x={6} y={200} width={24 + thick} height={98} rx={8} fill={color} {...outline} />
      {sneakers ? (
        <>
          <Sneaker cx={-centre} />
          <Sneaker cx={centre} />
        </>
      ) : (
        <>
          <ellipse cx={-centre} cy={300} rx={18 + thick / 2} ry={9} fill={CHAR.ink} />
          <ellipse cx={centre} cy={300} rx={18 + thick / 2} ry={9} fill={CHAR.ink} />
        </>
      )}
    </g>
  );
}

export function Arms({ color, skin = CHAR.skin, thick = 0 }: { color: string; skin?: string; thick?: number }) {
  const w = 22 + thick;
  return (
    <g>
      <rect x={-66 - thick} y={74} width={w} height={108} rx={w / 2} fill={color} {...outline} transform="rotate(6 -55 74)" />
      <rect x={44} y={74} width={w} height={108} rx={w / 2} fill={color} {...outline} transform="rotate(-6 55 74)" />
      <circle cx={-66 - thick / 2} cy={186} r={11 + thick / 2} fill={skin} {...outline} />
      <circle cx={66 + thick / 2} cy={186} r={11 + thick / 2} fill={skin} {...outline} />
    </g>
  );
}

export const TORSO = 'M -48 74 Q 0 54 48 74 L 44 214 L -44 214 Z';

// vest — жилет вместо фартука (Бекс), towel — полотенце на левой руке, sneakers/skin — Надир
export function WaiterBody({
  badge = false,
  skin = CHAR.skin,
  sneakers = false,
  vest = false,
  towel = false,
}: {
  badge?: boolean;
  skin?: string;
  sneakers?: boolean;
  vest?: boolean;
  towel?: boolean;
}) {
  return (
    <g>
      <Legs color={CHAR.trousers} sneakers={sneakers} />
      <path d={TORSO} fill={CHAR.shirt} {...outline} />
      {vest ? (
        <g>
          <path d="M -46 76 L -16 70 L 0 150 L 16 70 L 46 76 L 44 214 L -44 214 Z" fill={CHAR.apron} {...outline} />
          <circle cx={0} cy={168} r={3} fill={CHAR.gold} />
          <circle cx={0} cy={188} r={3} fill={CHAR.gold} />
          <path d="M 16 100 Q 34 120 24 150" stroke={CHAR.gold} strokeWidth={2.6} fill="none" />
        </g>
      ) : (
        <g>
          {/* фартук */}
          <path d="M -42 132 L 42 132 L 46 222 L -46 222 Z" fill={CHAR.apron} {...outline} />
          <path d="M -42 132 L 42 132" stroke={CHAR.skin} strokeWidth={3} opacity={0.35} />
        </g>
      )}
      {/* бабочка */}
      <path d="M 0 72 L -14 64 L -14 80 Z M 0 72 L 14 64 L 14 80 Z" fill={CHAR.ink} {...outline} strokeWidth={2} />
      {badge && (
        <g transform="rotate(-6 0 104)">
          <rect x={-38} y={92} width={76} height={26} rx={4} fill={CHAR.badge} {...outline} strokeWidth={2.4} />
          <text x={0} y={110} textAnchor="middle" fontSize={12} fontWeight={800} fontFamily="Arial, sans-serif" fill={CHAR.ink}>
            СТАЖЁР
          </text>
        </g>
      )}
      <Arms color={CHAR.shirt} skin={skin} />
      {towel && (
        <g transform="rotate(6 -55 74)">
          <rect x={-72} y={136} width={32} height={46} rx={5} fill="#ffffff" {...outline} strokeWidth={2.4} />
          <path d="M -72 150 L -40 150 M -72 162 L -40 162" stroke="#b9bcc6" strokeWidth={2} />
          <rect x={-66} y={176} width={18} height={34} rx={4} fill="#ffffff" {...outline} strokeWidth={2.4} />
        </g>
      )}
    </g>
  );
}

export function GuestHair() {
  return (
    <g>
      <circle cx={0} cy={-70} r={20} fill={CHAR.hairAuburn} {...outline} />
      <path
        d="M -60 -4 Q -64 -66 0 -64 Q 64 -66 60 -4 Q 52 -40 20 -44 Q -16 -50 -60 -4 Z"
        fill={CHAR.hairAuburn}
        {...outline}
      />
    </g>
  );
}

export function CasualBody() {
  return (
    <g>
      <Legs color={CHAR.trousers} />
      <path d={TORSO} fill={CHAR.sweater} {...outline} />
      <path d="M -20 66 Q 0 84 20 66" stroke={CHAR.ink} strokeWidth={2.4} fill="none" />
      <Arms color={CHAR.sweater} />
    </g>
  );
}

export function SuitBody() {
  return (
    <g>
      <Legs color={CHAR.suit} />
      <path d={TORSO} fill={CHAR.suit} {...outline} />
      {/* рубашка и галстук в вырезе пиджака */}
      <path d="M -18 66 L 0 128 L 18 66 Q 0 60 -18 66 Z" fill={CHAR.shirt} {...outline} strokeWidth={2.4} />
      <path d="M -6 72 L 6 72 L 9 112 L 0 124 L -9 112 Z" fill={CHAR.tie} {...outline} strokeWidth={2.2} />
      {/* лацканы и пуговица */}
      <path d="M -18 66 L -4 132 M 18 66 L 4 132" stroke={CHAR.ink} strokeWidth={2.4} fill="none" />
      <circle cx={0} cy={160} r={3.5} fill={CHAR.ink} />
      <Arms color={CHAR.suit} />
    </g>
  );
}

// --- Повар Гена ------------------------------------------------------------

// Поварской колпак вместо причёски + бакенбарды
export function GenaHat() {
  return (
    <g>
      {/* бакенбарды */}
      <path d="M -60 -6 Q -62 -26 -52 -36 L -48 -10 Z M 60 -6 Q 62 -26 52 -36 L 48 -10 Z" fill={CHAR.hairDark} {...outline} strokeWidth={2.2} />
      <path
        d="M -48 -36 L -50 -64 Q -72 -78 -56 -98 Q -42 -114 -20 -104 Q -6 -124 18 -112 Q 44 -122 54 -98 Q 72 -80 50 -64 L 48 -36 Q 0 -44 -48 -36 Z"
        fill={CHAR.chefJacket}
        {...outline}
      />
      <path d="M -49 -52 Q 0 -60 49 -52" stroke={CHAR.ink} strokeWidth={2.2} fill="none" />
      <path d="M -14 -100 Q -11 -82 -14 -64 M 18 -106 Q 21 -86 18 -66" stroke={CHAR.ink} strokeWidth={1.8} fill="none" opacity={0.5} />
    </g>
  );
}

// Щетина: точки по нижней половине лица
const STUBBLE_DOTS = Array.from({ length: 34 }, (_, i) => {
  const a = Math.PI * (0.18 + (i / 33) * 0.64);
  const r = 44 + (i % 3) * 6;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r + 2 };
});

export function GenaStubble() {
  return (
    <g fill={CHAR.stubble}>
      {STUBBLE_DOTS.map((d) => (
        <circle key={`${d.x.toFixed(1)}-${d.y.toFixed(1)}`} cx={d.x} cy={d.y} r={1.8} />
      ))}
    </g>
  );
}

// Половник: ручка вверх, черпак внизу; точка хвата — (0,0)
export function Ladle({ angle = 0 }: { angle?: number }) {
  return (
    <g transform={`rotate(${angle})`}>
      <rect x={-4} y={-120} width={8} height={150} rx={4} fill={CHAR.steel} {...outline} strokeWidth={2.4} />
      <path d="M -26 30 Q -28 62 0 64 Q 28 62 26 30 Z" fill={CHAR.steel} {...outline} />
      <path d="M -22 34 L 22 34" stroke={CHAR.ink} strokeWidth={2} opacity={0.4} />
    </g>
  );
}

function CheckedLegs() {
  const checks: { x: number; y: number }[] = [];
  for (let y = 204; y < 292; y += 12) {
    for (const x0 of [-28, 8]) {
      for (let x = x0 + ((y / 12) % 2) * 6; x < x0 + 20; x += 12) checks.push({ x, y });
    }
  }
  return (
    <g>
      <Legs color={CHAR.chefCheck} />
      <g fill={CHAR.chefJacket} opacity={0.75}>
        {checks.map((c) => (
          <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width={5} height={5} />
        ))}
      </g>
    </g>
  );
}

const CHEF_TORSO = 'M -58 76 Q 0 50 58 76 L 56 216 L -56 216 Z';
const CHEF_BUTTONS = [100, 128, 156, 184];

// Двубортный китель с шейным платком; ladle — половник в правой руке
export function ChefBody({ ladle = true }: { ladle?: boolean }) {
  return (
    <g>
      <CheckedLegs />
      <path d={CHEF_TORSO} fill={CHAR.chefJacket} {...outline} />
      <path d="M -10 66 L 26 216" stroke={CHAR.ink} strokeWidth={2.2} fill="none" />
      {CHEF_BUTTONS.map((y) => (
        <g key={y}>
          <circle cx={-14 + (y - 66) * 0.12} cy={y} r={3.6} fill={CHAR.ink} />
          <circle cx={30 + (y - 66) * 0.12} cy={y} r={3.6} fill={CHAR.ink} />
        </g>
      ))}
      <path d="M -24 66 L 0 96 L 24 66 Q 0 58 -24 66 Z" fill={CHAR.tie} {...outline} strokeWidth={2.4} />
      <rect x={-74} y={74} width={26} height={110} rx={12} fill={CHAR.chefJacket} {...outline} transform="rotate(8 -58 74)" />
      <circle cx={-76} cy={188} r={12} fill={CHAR.skin} {...outline} />
      <rect x={50} y={74} width={26} height={110} rx={12} fill={CHAR.chefJacket} {...outline} transform="rotate(-8 58 74)" />
      {ladle && (
        <g transform="translate(76 188)">
          <Ladle angle={14} />
        </g>
      )}
      <circle cx={76} cy={188} r={12} fill={CHAR.skin} {...outline} />
    </g>
  );
}

// Половник в правой руке Гены (координаты тела) — для листа персонажей и статичных кадров
export function GenaLadleInHand({ angle = 14 }: { angle?: number }) {
  return (
    <g transform="translate(76 188)">
      <Ladle angle={angle} />
      <circle cx={0} cy={0} r={12} fill={CHAR.skin} {...outline} />
    </g>
  );
}
