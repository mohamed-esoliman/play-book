import { Inter } from 'next/font/google'
import { AuthProvider } from '../contexts/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/globals.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Play-Book',
  description: 'Your ultimate gaming companion',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}