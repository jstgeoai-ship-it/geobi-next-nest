'use client';

import type { PbbAggregateRow } from '@geobi/shared';
import { rupiahM, pctOf } from '../../lib/format';

const ROWS = [
  { key: 'sudah_bayar' as const, rpKey: 'realisasi_rp' as const, label: 'Sudah Bayar', color: '#22c55e' },
  { key: 'belum_bayar' as const, rpKey: 'belum_rp' as const, label: 'Belum Bayar', color: '#ef4444' },
  { key: 'pbb_nol' as const, rpKey: null, label: 'PBB 0 Rupiah', color: '#f59e0b' },
  { key: 'dibatalkan' as const, rpKey: null, label: 'Di Batalkan', color: '#3b82f6' },
];

export function DistributionTable({ stats }: { stats?: PbbAggregateRow }) {
  const total = stats?.total ?? 0;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
      <tbody>
        {ROWS.map((r) => {
          const count = Number(stats?.[r.key] ?? 0);
          const pct = pctOf(count, total);
          const rp = r.rpKey ? rupiahM(stats?.[r.rpKey] ?? 0) : 'Rp 0';
          return (
            <tr key={r.key}>
              <td style={{ padding: '5px 5px', border: '1px solid rgba(255,255,255,0.10)', width: 20 }}>
                <span style={{ display: 'block', width: 11, height: 11, borderRadius: 2, background: r.color }} />
              </td>
              <td style={{ padding: '5px 6px', border: '1px solid rgba(255,255,255,0.10)', fontSize: 10, color: '#fff' }}>{r.label}</td>
              <td style={{ padding: '5px 6px', border: '1px solid rgba(255,255,255,0.10)', fontSize: 10, color: '#cbd5e1', textAlign: 'right', whiteSpace: 'nowrap' }}>{rp}</td>
              <td style={{ padding: '5px 6px', border: '1px solid rgba(255,255,255,0.10)', fontSize: 10, color: r.color, textAlign: 'right', whiteSpace: 'nowrap' }}>{pct}%</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
