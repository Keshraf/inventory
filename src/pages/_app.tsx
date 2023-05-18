import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import store from "@/store";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import Session from "@/components/Session";

const inter = Inter({
  subsets: ["latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  private?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const privatePage = Component.private ? Component.private : false;

  return (
    <>
      <ReduxProvider store={store}>
        <main className={inter.className}>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 1000,
              style: {
                background: "$fff",
                color: "#000",
                fontFamily: "Inter",
              },
            }}
          />
          {privatePage ? (
            <Session>
              <Component {...pageProps} />
            </Session>
          ) : (
            <Component {...pageProps} />
          )}
        </main>
      </ReduxProvider>
    </>
  );
}
