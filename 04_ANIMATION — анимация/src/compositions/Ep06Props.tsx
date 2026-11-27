import { AbsoluteFill } from 'remotion';
import { Banknote, Button, Gum, Note, Sticker, TipJar } from '../scenes/ep06/props';
import { Stage6 } from '../scenes/ep06/Stage6';

// Предпросмотр реквизита серии 6 «На чай»: кадр-хук (высыпанная банка на стойке), две банки,
// а на стене — предметы для сцен 3–4 (купюра, записка, наклейка)
export function Ep06Props() {
  return (
    <AbsoluteFill>
      <Stage6
        bg="cashier"
        actors={[{ id: 'kostya', emotion: 'neutral', x: 300 }]}
        front={
          <g>
            <Button x={500} y={468} />
            <Gum x={545} y={470} />
            <Note x={640} y={470} lines={['Не ешьте', 'рыбу']} angle={-6} width={160} />
            <TipJar x={770} y={470} name="Бекс" fill={0.8} kind="coins" />
            <TipJar x={900} y={470} name="Костя" fill={0.25} kind="paper" />
            <Banknote x={560} y={260} label="500" angle={-5} />
            <Note x={760} y={260} lines={['Улыбайтесь', 'чаще']} angle={4} width={190} />
            <Sticker x={950} y={230} />
          </g>
        }
      />
    </AbsoluteFill>
  );
}
