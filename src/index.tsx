import App from './App';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import { WalletButtonProvider } from './contexts/WalletButtonContext';

import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { AuthProvider } from './contexts/auth/authContext';
import ToastContainer from './components/Toast/ToastContainer';
// import { createRoot } from 'react-dom/client';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

ReactDOM.render(
  <HelmetProvider>
    <Web3ReactProvider getLibrary={getLibrary}>
      <AuthProvider>
        <SidebarProvider>
          <WalletButtonProvider>
            <BrowserRouter>
              <ToastContainer />
              <App />
            </BrowserRouter>
          </WalletButtonProvider>
        </SidebarProvider>
      </AuthProvider>
    </Web3ReactProvider>
  </HelmetProvider>,
  document.getElementById('root')
);

// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(
//   <HelmetProvider>
//     <Web3ReactProvider getLibrary={getLibrary}>
//       <AuthProvider>
//         <SidebarProvider>
//           <WalletButtonProvider>
//             <BrowserRouter>
//               <ToastContainer />
//               <App />
//             </BrowserRouter>
//           </WalletButtonProvider>
//         </SidebarProvider>
//       </AuthProvider>
//     </Web3ReactProvider>
//   </HelmetProvider>
// );

serviceWorker.unregister();
