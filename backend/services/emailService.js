import transporter from "../config/email.js"

export const sendEmail = async(to, subject, html) => {
    try {
       const info = await transporter.sendMail({
        from : `"My App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
       })
       console.log('email sent', info.messageId)
    } catch (error) {
        console.log('failed to send email', error)
    }
}