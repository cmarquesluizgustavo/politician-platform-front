import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return <Component className={inter.className} {...pageProps} />;
}
