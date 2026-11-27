import { AbsoluteFill } from 'remotion';
import { Character, CHARACTERS, type CharacterId } from '../characters/Character';
import { EMOTION_LABELS, type EmotionName } from '../characters/expressions';
import { COLORS } from '../config';
import { GenaLadleInHand } from '../characters/parts';
import { AkhmaHeld } from '../characters/parts-ep03';
import { RedPenHeld } from '../characters/parts-ep05';
import { BagHeld, NotebookHeld, PhoneHeld } from '../characters/parts-ep06';

// Лист персонажей: полный рост + 6 эмоций на каждого (4 строки на 1080×1920)
const CARD_HEIGHT = 405;
const FULL_HEIGHT = 255;
const HEAD_HEIGHT = 120;
// hatRoom — место над головой под колпак
export type SheetRow = { id: CharacterId; pose: EmotionName; emotions: EmotionName[]; tilt: number; hatRoom?: number; scale?: number };

const ROWS: SheetRow[] = [
  { id: 'kostya', pose: 'neutral', emotions: ['neutral', 'happy', 'panic', 'smirk', 'sad', 'surprised'], tilt: -0.6 },
  { id: 'eduard', pose: 'tired', emotions: ['tired', 'angry', 'skeptical', 'surprised', 'happy', 'neutral'], tilt: 0.5 },
  { id: 'dima', pose: 'happy', emotions: ['happy', 'panic', 'surprised', 'sad', 'neutral', 'smirk'], tilt: -0.4 },
  { id: 'gena', pose: 'yell', emotions: ['yell', 'angry', 'tired', 'skeptical', 'surprised', 'neutral'], tilt: 0.6, hatRoom: 34 },
];

const CARD_BG = '#ebe5d8';
const HAND_FONT = 'Segoe Print, Comic Sans MS, sans-serif';

function EmotionCell({ id, emotion, hatRoom = 0 }: { id: CharacterId; emotion: EmotionName; hatRoom?: number }) {
  return (
    <div style={{ width: 200, paddingTop: hatRoom, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Character id={id} emotion={emotion} mode="head" height={HEAD_HEIGHT} />
      <div style={{ fontFamily: HAND_FONT, fontSize: 26, color: COLORS.ink, marginTop: 4 }}>{EMOTION_LABELS[emotion]}</div>
    </div>
  );
}

// предмет в руках на листе: половник у Гены, стопка тарелок и чай у Ахмы
function heldFor(id: CharacterId): React.ReactNode {
  if (id === 'gena') return <GenaLadleInHand />;
  if (id === 'akhma') return <AkhmaHeld />;
  if (id === 'owner') return <RedPenHeld />;
  if (id === 'granny') return <BagHeld />;
  if (id === 'poet') return <NotebookHeld />;
  if (id === 'blogger') return <PhoneHeld />;
  return undefined;
}

function CharacterCard({ id, pose, emotions, tilt, hatRoom = 0, scale = 1 }: SheetRow) {
  const def = CHARACTERS[id];
  return (
    <div
      style={{
        position: 'relative',
        height: CARD_HEIGHT,
        margin: '0 40px',
        background: CARD_BG,
        border: `4px solid ${COLORS.ink}`,
        borderRadius: 26,
        transform: `rotate(${tilt}deg)`,
        display: 'flex',
        padding: '20px 24px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontFamily: HAND_FONT, fontSize: 38, color: COLORS.ink, lineHeight: 1.1, textAlign: 'center' }}>
          {def.name}
        </div>
        <div style={{ fontFamily: HAND_FONT, fontSize: 26, color: '#c2412f', marginBottom: 6 }}>{def.role}</div>
        <div style={{ marginTop: hatRoom }}>
          <Character id={id} emotion={pose} mode="full" height={FULL_HEIGHT * scale - hatRoom} held={heldFor(id)} />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', rowGap: hatRoom ? 4 : 18 }}>
        {emotions.map((e) => (
          <EmotionCell key={e} id={id} emotion={e} hatRoom={hatRoom / 2} />
        ))}
      </div>
    </div>
  );
}

export function CharacterSheet() {
  return <SheetView title="ПЕРСОНАЖИ" subtitle="ресторан «Скатерть» · сезон 1" rows={ROWS} />;
}

// Лист новых героев серии 3
const ROWS_EP03: SheetRow[] = [
  { id: 'beks', pose: 'happy', emotions: ['happy', 'smirk', 'neutral', 'surprised', 'tired', 'sad'], tilt: -0.5 },
  { id: 'akhma', pose: 'neutral', emotions: ['neutral', 'tired', 'happy', 'surprised', 'angry', 'skeptical'], tilt: 0.5, scale: 1.1 },
  { id: 'nadir', pose: 'neutral', emotions: ['neutral', 'happy', 'surprised', 'skeptical', 'smirk', 'tired'], tilt: -0.4 },
  { id: 'tamada', pose: 'happy', emotions: ['happy', 'surprised', 'smirk', 'angry', 'neutral', 'panic'], tilt: 0.6 },
];

export function CharacterSheetEp03() {
  return <SheetView title="НОВЫЕ ГЕРОИ" subtitle="серия 3 · «Друзья»" rows={ROWS_EP03} />;
}

// Лист новой героини серии 5
const ROWS_EP05: SheetRow[] = [
  { id: 'owner', pose: 'neutral', emotions: ['neutral', 'skeptical', 'tired', 'angry', 'surprised', 'happy'], tilt: -0.4, scale: 0.9 },
];

export function CharacterSheetEp05() {
  return <SheetView title="НОВАЯ ГЕРОИНЯ" subtitle="серия 5 · «Дружба дружбой»" rows={ROWS_EP05} />;
}

// Лист новых героев серии 6
const ROWS_EP06: SheetRow[] = [
  { id: 'granny', pose: 'neutral', emotions: ['neutral', 'surprised', 'happy', 'skeptical', 'sad', 'angry'], tilt: -0.5 },
  { id: 'poet', pose: 'neutral', emotions: ['neutral', 'happy', 'surprised', 'sad', 'smirk', 'tired'], tilt: 0.5 },
  { id: 'blogger', pose: 'happy', emotions: ['happy', 'surprised', 'smirk', 'neutral', 'skeptical', 'angry'], tilt: -0.4 },
  { id: 'tguest', pose: 'skeptical', emotions: ['skeptical', 'neutral', 'angry', 'smirk', 'surprised', 'tired'], tilt: 0.6 },
];

export function CharacterSheetEp06() {
  return <SheetView title="НОВЫЕ ГЕРОИ" subtitle="серия 6 · «Тайный гость»" rows={ROWS_EP06} />;
}

function SheetView({ title, subtitle, rows }: { title: string; subtitle: string; rows: SheetRow[] }) {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background, paddingTop: 36, gap: 26 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Segoe UI Black, Arial Black, sans-serif', fontSize: 64, color: COLORS.paper, letterSpacing: 2 }}>
          {title}
        </div>
        <div style={{ fontFamily: HAND_FONT, fontSize: 34, color: '#e5533d' }}>{subtitle}</div>
      </div>
      {rows.map((row) => (
        <CharacterCard key={row.id} {...row} />
      ))}
    </AbsoluteFill>
  );
}
