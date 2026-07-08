import React from 'react';

type Props = {
  isOnline: boolean;
};

export function OfflineBanner({ isOnline }: Props) {
  if (isOnline) return null;

  return (
    <div style={{ background: '#C2410C', color: '#fff', padding: '8px 16px', textAlign: 'center', fontSize: 14 }}>
      📡 Offline — exibindo dados do cache
    </div>
  );
}

export default OfflineBanner;
