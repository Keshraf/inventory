import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";

import { Inter } from "next/font/google";
import store from "@/store";

const inter = Inter({
  subsets: ["latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ReduxProvider store={store}>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </ReduxProvider>
    </>
  );
}
