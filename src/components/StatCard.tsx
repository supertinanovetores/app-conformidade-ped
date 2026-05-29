type Cor = 'green' | 'yellow' | 'red' | 'blue';

export function StatCard({ label, value, cor }: { label: string; value: number; cor: Cor }) {
  return (
    <div className={`stat-card ${cor}`}>
      <div className="label">{label}</div>
      <div className={`value ${cor}`}>{value}</div>
    </div>
  );
}
