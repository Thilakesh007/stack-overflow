import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@/i18n";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/lib/AuthContext";
import Head from "next/head";
import Script from "next/script";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Code-Quest</title>
      </Head>
      <AuthProvider>
        <ToastContainer />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
