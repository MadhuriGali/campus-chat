export const generateOtp=(): { otp: number; otpExpiresAt: Date }=> {
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Set expiration for 1 day
  
    return { otp, otpExpiresAt };
  }