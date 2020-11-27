import '~/styles/reset.css';
import '~/styles/app.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { getAppState, initializeStoreFromDatabase, store } from '~/store';
import { seedDatabaseIfEmpty } from '~/seed';
import { AppContextProvider } from '~/context/app';
import { renderPageWithLayout } from '~/layout/assign';
import styled from 'styled-components';

async function init() {
  await initializeStoreFromDatabase();

  await seedDatabaseIfEmpty();
}

// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }: AppProps<{}>) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init().then(() => {
      setIsInitialized(true);
    });
  });

  const appState = isInitialized ? getAppState() : null;

  const appStateContext = useMemo(() => {
    return { appState: appState! };
  }, [appState]);

  return (
    <AppContextProvider value={appStateContext}>
      {/* <Head>
        <title>Create beautiful websites in minutes</title>
        <link
          rel="icon"
          type="image/png"
          href={require('@hello/app/assets/logo-rounded.png?resize&size=256')}
        />
        <link rel="dns-prefetch" href="//storage.googleapis.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
      </Head> */}
      <UIBootHolder style={{ opacity: isInitialized ? 1 : 0 }}>
        {isInitialized && renderPageWithLayout(Component, pageProps)}
      </UIBootHolder>
    </AppContextProvider>
  );
}

const UIBootHolder = styled.div`
  transition: 0.2s opacity;
  will-change: opacity;
`;
