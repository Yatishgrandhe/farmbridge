import styles from './loading.module.css'

export default function DashboardLoading() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <div className={styles.titleBar} />
        <div className={styles.grid}>
          <div className={styles.stack}>
            <div className={styles.cardSkeleton} />
            <div className={styles.cardSkeleton} />
          </div>
          <div className={styles.stack}>
            <div className={styles.cardSkeleton} />
            <div className={styles.cardSkeleton} />
          </div>
        </div>
      </div>
    </main>
  )
}
