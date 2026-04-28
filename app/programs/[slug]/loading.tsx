import styles from './loading.module.css'

export default function ProgramDetailLoading() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <div className={styles.lineShort} />
        <div className={styles.lineTitle} />
        <div className={styles.lineBody} />
        <div className={styles.lineBodyNarrow} />

        <div className={styles.grid}>
          <div className={styles.stack}>
            <div className={styles.panel} />
            <div className={styles.panel} />
          </div>
          <div className={styles.sidePanel} />
        </div>
      </div>
    </main>
  )
}
