/**
 * Root layout — test with block layout instead of flex.
 */
import { useState } from 'react';

export const RootLayout = () => {
  if (typeof window !== 'undefined') {
    console.log('RootLayout mounted');
  }
  return (
    <div
      style={{
        backgroundColor: '#151817',
        height: '100vh',
        width: '100vw',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#F3F1E9',
          fontSize: 32,
          fontWeight: 'bold',
        }}
      >
        BOXING
      </div>
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#C8F169',
          fontSize: 16,
        }}
      >
        Debug mode
      </div>
    </div>
  );
};
