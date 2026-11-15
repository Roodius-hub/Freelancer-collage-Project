
import { Request, Response } from "express";
import crypto from "crypto";
import { db } from "../db/db"; // Adjust to your Prisma client path
import { sendVerificationEmail } from "../services/email.service";
import dotenv from "dotenv";

dotenv.config({
  path: "apps/backend/.env",
});

export const sendEmailOTP = async (req: Request, res: Response) => {
  try {
    // 1. Get authenticated user ID
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // 2. Get user's email from database
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.email) {
      return res.status(400).json({
        message: "User email not found",
      });
    }

    if (user.emailVerifiedAt) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    // 3. Generate OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // 4. Hash OTP using server secret
   console.log("OTP_SECRET loaded:", !!process.env.OTP_SECRET);
    const otpHash = crypto
      .createHmac("sha256", process.env.OTP_SECRET!)
      .update(otp)
      .digest("hex");

    // 5. Set expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 6. Save or update verification record
    await db.emailVerification.upsert({
      where: {
        userId_email: {
          userId,
          email: user.email,
        },
      },
      update: {
        otpHash,
        expiresAt,
        attempts: 0,
        createdAt: new Date(),
      },
      create: {
        userId,
        email: user.email,
        otpHash,
        expiresAt,
      },
    });

    // 7. Send OTP email
    await sendVerificationEmail(user.email, otp);

    return res.status(200).json({
      message: "Verification OTP sent successfully",
    });

  } catch (error) {
    console.error("Send email OTP error:", error);

    return res.status(500).json({
      message: "Failed to send verification email",
    });
  }
};


// Verify Email OTP
export const verifyEmailOTP = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { otp } = req.body;

    // 1. Authentication check
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // 2. Validate OTP format
    if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Enter a valid 6-digit OTP",
      });
    }

    // 3. Get user
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      return res.status(404).json({
        message: "User or email not found",
      });
    }

    if (user.emailVerifiedAt) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    // 4. Find OTP record
    const verification = await db.emailVerification.findUnique({
      where: {
        userId_email: {
          userId,
          email: user.email,
        },
      },
    });

    if (!verification) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // 5. Check expiry
    if (verification.expiresAt <= new Date()) {
      await db.emailVerification.delete({
        where: { id: verification.id },
      });

      return res.status(400).json({
        message: "OTP expired. Please request a new one.",
      });
    }

    // 6. Check attempts
    if (verification.attempts >= 5) {
      await db.emailVerification.delete({
        where: { id: verification.id },
      });

      return res.status(429).json({
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    // 7. Hash submitted OTP
    const submittedHash = crypto
      .createHmac("sha256", process.env.OTP_SECRET!)
      .update(otp)
      .digest("hex");

    // 8. Compare hashes safely
    const storedHash = Buffer.from(verification.otpHash, "hex");
    const enteredHash = Buffer.from(submittedHash, "hex");

    const isValid =
      storedHash.length === enteredHash.length &&
      crypto.timingSafeEqual(storedHash, enteredHash);

    if (!isValid) {
      const updated = await db.emailVerification.updateMany({
        where: {
          id: verification.id,
          attempts: { lt: 5 },
          otpHash: verification.otpHash,
          expiresAt: { gt: new Date() },
        },
        data: {
          attempts: { increment: 1 },
        },
      });

      if (updated.count === 0) {
        return res.status(409).json({
          message: "Verification changed. Please request a new OTP.",
        });
      }

      return res.status(400).json({
        message: `Incorrect OTP. ${5 - verification.attempts - 1} attempts remaining.`,
      });
    }

    // 9. Mark email verified and consume OTP atomically
    const result = await db.$transaction(async (tx) => {
      const consumed = await tx.emailVerification.deleteMany({
        where: {
          id: verification.id,
          otpHash: verification.otpHash,
          expiresAt: { gt: new Date() },
          attempts: { lt: 5 },
        },
      });

      if (consumed.count !== 1) {
        throw new Error("OTP is no longer valid");
      }

      return tx.user.update({
        where: { id: userId },
        data: {
          emailVerifiedAt: new Date(),
        },
      });
    });

    return res.status(200).json({
      message: "Email verified successfully",
      emailVerifiedAt: result.emailVerifiedAt,
    });

  } catch (error) {
    console.error("Verify email OTP error:", error);

    return res.status(500).json({
      message: "Email verification failed",
    });
  }
};