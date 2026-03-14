import cron from 'node-cron'
import Task from '../models/Task.js'

export const startDeadlineChecker = async() => {
    cron.schedule('0 0 * * *', async() => {
        try {
            const today = new Date()
            const res = await Task.updateMany({
                deadline : {$lt : today},
                status : {$ne : 'completed'}
            },
            {
                $set : {status : 'deadlineMissed'}
            }
        )
        } catch (error) {
        }
    }) 
}

