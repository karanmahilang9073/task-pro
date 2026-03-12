import { getTransporter } from "../config/email.js"

export const sendEmail = async(to, subject, html) => {
    try {
       const transporter = getTransporter()
       const info = await transporter.sendMail({
        from : `"My App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
       })
       console.log('email sent', info.messageId)
       return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('failed to send email:', error)
        throw new Error(`Email sending failed: ${error.message}`)
    }
}