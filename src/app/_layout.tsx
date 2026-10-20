/**
 * Root layout — absolute minimal debug: no hooks, no imports except React.
 */
import { useState } from 'react';

export const RootLayout = () => {
  if (typeof window !== 'undefined') {
    console.log('RootLayout component function executed');
  }
  return (
    <div
      style={{
        backgroundColor: '#151817',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ color: '#F3F1E9', fontSize: 32, fontWeight: 'bold' }}>
        BOXING
      </div>
      <div style={{ color: '#C8F169', marginTop: 12, fontSize: 16 }}>
        Debug mode — if you see this, React works
      </div>
    </div>
  );
};
