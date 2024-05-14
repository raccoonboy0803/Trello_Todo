import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { ResetCss } from './ResetCss';
import { darkTheme } from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <ThemeProvider theme={darkTheme}>
      <ResetCss />
      <App />
    </ThemeProvider>
  </RecoilRoot>
);
