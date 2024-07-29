export function generateNumericOTP(length: number = 6): string {
  // Ensure the length is reasonable
  if (length < 1) {
    throw new Error('OTP length must be at least 1');
  }
  
  // Generate random bytes and convert to a numeric string
  const maxNumber = Math.pow(10, length);
  const randomNumber = Math.floor(Math.random() * maxNumber);
  
  // Pad the number with leading zeros if necessary
  return randomNumber.toString().padStart(length, '0');
}


export function isExpired(timestamp: Date): boolean {
  // Get the current time
  const currentTime = new Date();

  // Calculate expiration time (5 minutes later)
  const expirationTime = new Date(timestamp.getTime() + 5 * 60 * 1000);

  // Check if the current time is past the expiration time
  return currentTime > expirationTime;
}
