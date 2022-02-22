import { Fragment, Suspense, lazy } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import theme from "./utils/theme";
import './App.css';
import { getPhantomWallet, getSolletExtensionWallet } from '@solana/wallet-adapter-wallets';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  clusterApiUrl
} from '@solana/web3.js';


const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  getPhantomWallet(),
  getSolletExtensionWallet()
]
const network = clusterApiUrl('devnet');
console.log('network', network)

const MainComponent = lazy(() => import("./components/Main"));

function App() {
  return (

    <Router>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Fragment />}>
          <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <Switch>
                  <Route>
                    <MainComponent />
                  </Route>
                </Switch>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </Suspense>
      </MuiThemeProvider>
    </Router>

  );
}

export default App;
