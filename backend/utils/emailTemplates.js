
export const taskAssignmentTemplate = (title, description, deadline) => {
    return `
    <html>
        <body>
            <div class="container">
                <div class="header">📌 New Task Assigned</div>

                    <div class="task-box">
                        <div class="value">
                            <span class="label">Task Title:</span> ${title}
                        </div>

                        <div class="value">
                            <span class="label">Description:</span><br/>
                            ${description}
                        </div>

                        <div class="value">
                            <span class="label">Deadline:</span> ${deadline}
                        </div>
                    </div>

                    <div class="footer">
                        Please make sure to complete the task before the deadline.<br/>
                        If you have any questions, contact the person who assigned it.
                </div>
            </div>
        </body>
    </html>`
}

export const deadlineReminderTemplate = (title,deadline,  daysLeft) => {
    return `
    <html>
        <body>
            <div class="container">
            <div class="header">⚠️  task deadline approaching</div>

            <div class="task-box">
                <div class="value">
                <span class="label">Task Title:</span> ${title}
                </div>

                <div class="value">
                <span class="label">Deadline:</span> ${deadline}
                </div>

                <div class="value">
                <span class="label">dayleft: </span> ${daysLeft}
                </div>
            </div>

            <div class="footer">
                Please make sure to complete the task before the deadline.<br/>
                If you have any questions, contact the person who assigned it.
            </div>
        </div>
    </body>
  </html>`
}