import React from 'react';
import ReactDOM from 'react-dom/client';
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import './index.css'
import { networkConfig } from "./networkConfig.ts";

export const network = import.meta.env.VITE_NETWORK || 'testnet';


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
          <WalletProvider stashedWallet={{
                name: 'SuissTicket',
                network: network,
              }} autoConnect>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
  </React.StrictMode>,
);