import crypto from "crypto";


export const GenerateOtp = ():string => {

    return crypto.randomInt(100000, 100000).toString();
  
}

export const hashOTP = (otp: string): string => {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET!)
    .update(otp)
    .digest("hex");
};
