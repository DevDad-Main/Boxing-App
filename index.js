import { createRoot } from 'react-dom/client';
import { RootLayout } from './src/app/_layout';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<RootLayout />);
} else {
  console.error('No #root element found');
}
