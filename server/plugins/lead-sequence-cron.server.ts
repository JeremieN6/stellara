import cron from 'node-cron'
import { runLeadSequenceBatch } from '../utils/lead-sequence'

let task: cron.ScheduledTask | null = null

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  const enabled = String(config.leadSequenceCronEnabled || '').toLowerCase() === 'true'

  if (!enabled) {
    return
  }

  const schedule = String(config.leadSequenceCronSchedule || '*/15 * * * *').trim()
  const batchLimit = Math.max(1, Number(config.leadSequenceCronBatchLimit || 50))

  if (!cron.validate(schedule)) {
    console.error(`[lead-sequence-cron] Invalid cron expression: ${schedule}`)
    return
  }

  if (task) {
    task.stop()
    task = null
  }

  task = cron.schedule(schedule, async () => {
    try {
      const result = await runLeadSequenceBatch(batchLimit)
      if (result.processed > 0) {
        console.info(
          `[lead-sequence-cron] processed=${result.processed} sent=${result.sent} failed=${result.failed}`,
        )
      }
    } catch (error) {
      console.error('[lead-sequence-cron] batch failed:', error)
    }
  }, {
    timezone: 'Europe/Paris',
  })

  console.info(`[lead-sequence-cron] started with schedule="${schedule}" batchLimit=${batchLimit}`)
})
