import "@/styles/globals.css";
import { Providers } from "@/redux/providers";
import store, { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }) {
  return (
    <Providers store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Providers>
  );
}
