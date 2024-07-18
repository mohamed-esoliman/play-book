'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import styles from "@/styles/Home.module.scss"
import { getGames } from "@/services/apiServices"

const DynamicGameList = dynamic(() => import('../components/GameList'), {
  ssr: false,
})

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [initialGames, setInitialGames] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signIn')
    }
  }, [status, router])

  useEffect(() => {
    const fetchInitialGames = async () => {
      const games = await getGames(1, 40)
      setInitialGames(games)
    }

    fetchInitialGames()
  }, [])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className={styles.container}>
      <DynamicGameList initialGames={initialGames} />
    </div>
  )
}