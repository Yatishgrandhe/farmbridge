import styles from './loading.module.css'

export default function Loading() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <div className={styles.glowLarge} aria-hidden />
        <div className={styles.glowSmall} aria-hidden />

        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>

        <div className={styles.progressTrack}>
          <span className={styles.progressBar} />
        </div>

        <p className={styles.label}>Loading FarmBridge</p>
      </div>
    </main>
  )
}
