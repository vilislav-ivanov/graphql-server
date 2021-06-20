import { sendMail } from './sendMail';

export const sendResetPasswordMail = async (email: string, token: string) =>
  await sendMail({
    email,
    token,
    link: 'http://localhost:3000/reset-password',
    subject: 'Reset password',
    text: 'Reset password... idk',
  });
