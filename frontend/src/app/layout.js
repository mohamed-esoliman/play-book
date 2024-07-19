import SessionProvider from './auth/SessionProvider'
import { Inter } from 'next/font/google'
import '@/styles/globals.scss'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Play-Book',
  description: 'Your ultimate gaming companion',
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Header/>
          <Toaster />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}

RootLayout.requireAuth = true