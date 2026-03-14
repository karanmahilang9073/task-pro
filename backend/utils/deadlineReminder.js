import cron from 'node-cron'
import Task from '../models/Task.js'
import { sendEmail } from '../services/emailService.js'
import { deadlineReminderTemplate } from './emailTemplates.js'
import Notification from '../models/Notification.js'


export const deadlineReminder = async() => {
    cron.schedule('0 8 * * *', async() => {
        try {
            const now = new Date()
            const tasks = await Task.find({
                status : {$ne : 'completed'}
            }).populate('assignedTo')
            let reminderCount = 0;
            for(const task of tasks){
                const deadline = new Date(task.deadline)
                const diffInDays = (deadline - now) / (1000 * 60 * 60 * 24)
                if(diffInDays >= 0.5 && diffInDays <= 1.5){
                    const userEmail = task.assignedTo?.email
                    if(!userEmail) continue;

                    try {
                        await sendEmail(userEmail, 'task deadline reminder', deadlineReminderTemplate(task.title, task.deadline, diffInDays))
                    } catch (emailError) {
                        console.error('Failed to send deadline reminder email:', emailError.message)
                    }

                    await Notification.create({
                        recipient : task.assignedTo._id,
                        message : `reminder: task "${task.title}" deadline is tomorrow`
                    })
                    reminderCount++;
                }  
            }
        } catch (error) {
        }
    })
}