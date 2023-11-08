'use client'

import Link from 'next/link'

import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Link href="3d">3D</Link>
    </main>
  )
}
