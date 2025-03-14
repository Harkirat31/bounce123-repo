import sgMail from "@sendgrid/mail"

const SEND_GRID_API = process.env.SEND_GRID_API


sgMail.setApiKey(SEND_GRID_API!)


export const sendDriverCreationEmail = async (toEmail:string,password:string,companyName:string)=>{
    const msg = {
            to: toEmail, // Change to your recipient
            from: 'info@easeyourtasks.com', // Change to your verified sender
            subject: 'Credentials Created for Deliveries for Drivers',
            html: `<p>Hi </br>   </p> <p> Your credentials have been created for ${companyName} with username ${toEmail}. Password is ${password} . If you already have credentials,please ignore new password </p>`,
          }
          try{
            await sgMail.send(msg)
            return true
          }
          catch(error){
            return false
          }
}