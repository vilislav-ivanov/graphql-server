import { sendMail } from './sendMail';

export const sendConfirmationMail = async (email: string, token: string) =>
  await sendMail({
    email,
    token,
    link: 'http://localhost:3000/confirm-email',
    subject: 'Confirm mail',
    text: 'confirming email... idk',
  });
