
"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function PhoneVerification() {
    const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
      const getOtp = async () => {
          try {
              const response = await axios.post(`http://localhost:3001/verify-user/send-email-otp`, {},{
                  withCredentials:true
              })
              console.log(response.data);
          } catch (err) {
              console.log(err);
          }
      }
      getOtp();
  }, [resending])
    
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

 
    
  const handleChange = (value: string, index: number) => {
    // Accept only one digit
    const digit = value.replace(/\D/g, "").slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setMessage("");

    // Move to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newOtp = Array(6).fill("");

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setMessage("");

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      setMessage("Please enter all 6 digits.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`http://localhost:3001/verify-user/email-verify`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: enteredOTP }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }
      router.push("/dashboard")
      setMessage(data.message || "Email verified successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setMessage("");

      const response = await fetch(`http://localhost:3001/verify-user/email-verify`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to resend OTP");
      }

      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();

      setMessage("A new verification code has been sent.");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to resend OTP"
      );
      setMessageType("error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="scale-70 w-full max-w-md mx-auto rounded-2xl border border-neutral-800 bg-neutral-950 p-8 text-white">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 text-2xl">
          ✉
        </div>

        <h2 className="text-2xl font-semibold">
          Verify your Phone
        </h2>

        <p className="mt-2 text-sm text-neutral-400">
          Enter the 6-digit verification code sent to your Phone Number.
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            aria-label={`OTP digit ${index + 1}`}
            className="h-12 w-10 rounded-lg border border-neutral-700 bg-neutral-900 text-center text-xl font-semibold outline-none transition focus:border-white sm:h-14 sm:w-12"
          />
        ))}
      </div>

      {message && (
        <p
          role="status"
          className={`mb-4 text-center text-sm ${
            messageType === "success"
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <button
        onClick={handleVerify}
        disabled={loading || otp.some((digit) => !digit)}
        className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Verifying..." : "Verify Phone"}
      </button>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-400">
          Didn't receive the code?
        </p>

        <button
          onClick={handleResend}
          disabled={resending || loading}
          className="mt-2 text-sm font-medium text-white underline underline-offset-4 disabled:opacity-40"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
