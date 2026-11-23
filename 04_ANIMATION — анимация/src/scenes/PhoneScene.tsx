import { SCENE_VIEWBOX, VIDEO } from '../config';
import { Character } from '../characters/Character';
import { HandDrawn } from '../characters/HandDrawn';
import { CHAR } from '../characters/palette';

// Крупный план телефона: сообщение от управляющего
const INK = CHAR.ink;

interface PhoneSceneProps {
  sender: string;
  message: string[];
  time: string;
  boilSeed?: number;
  // смещение корпуса при вибрации, в единицах сцены
  shake?: number;
  // появление сообщения: 0 — нет, 1 — на месте
  messageIn?: number;
}

export function PhoneScene({ sender, message, time, boilSeed = 1, shake = 0, messageIn = 1 }: PhoneSceneProps) {
  const bubbleHeight = 40 + message.length * 40;
  const bubbleScale = 0.6 + 0.4 * messageIn;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} viewBox={SCENE_VIEWBOX}>
      <rect x={-200} y={0} width={1480} height={720} fill="#3a3640" />
      <circle cx={540} cy={400} r={290} fill="#4a4552" />
      {/* телефон между ремаркой сверху и субтитрами снизу */}
      <g transform={`translate(${540 + shake} 384) scale(0.55) translate(-540 -380)`}>
      <HandDrawn seed={boilSeed}>
        <g transform="rotate(-4 540 380)">
          {/* корпус и экран */}
          <rect x={340} y={70} width={400} height={700} rx={48} fill="#1f1f22" stroke={INK} strokeWidth={5} />
          <rect x={360} y={92} width={360} height={660} rx={32} fill="#eef0f4" />
          {/* шапка чата */}
          <rect x={360} y={92} width={360} height={96} rx={32} fill="#dfe3ea" />
          <rect x={360} y={150} width={360} height={38} fill="#dfe3ea" />
          <path d="M 360 188 L 720 188" stroke="#c5cad3" strokeWidth={2} />
          <text x={392} y={152} fontSize={34} fill="#5a6070" fontFamily="Arial">
            ‹
          </text>
          <text x={518} y={140} fontSize={21} fontWeight={700} fill={INK} fontFamily="Segoe UI, Arial">
            {sender}
          </text>
          <text x={518} y={166} fontSize={16} fill="#7a8090" fontFamily="Segoe UI, Arial">
            был(а) только что
          </text>
          {/* сообщение «выпрыгивает» из левого верхнего угла пузыря */}
          <g
            opacity={messageIn}
            transform={`translate(384 226) scale(${bubbleScale}) translate(-384 -226)`}
          >
            <rect x={384} y={226} width={300} height={bubbleHeight} rx={20} fill="#ffffff" stroke="#c5cad3" strokeWidth={2} />
            {message.map((line, i) => (
              <text key={line} x={406} y={268 + i * 40} fontSize={28} fill={INK} fontFamily="Segoe UI, Arial">
                {line}
              </text>
            ))}
            <text x={664} y={226 + bubbleHeight - 14} textAnchor="end" fontSize={15} fill="#8a90a0" fontFamily="Segoe UI, Arial">
              {time}
            </text>
          </g>
        </g>
      </HandDrawn>
      {/* аватар — голова отправителя */}
      <g transform="rotate(-4 540 380) translate(440 108)">
        <Character id="eduard" emotion="tired" mode="head" height={64} boilSeed={boilSeed} />
      </g>
      </g>
    </svg>
  );
}
