import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./EmailVerificationStatus.css";

function VerifyStatus() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const [status, setStatus] = useState("LOADING");
  // LOADING | SUCCESS | EXPIRED | INVALID

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  /* -------------------------------
     VERIFY TOKEN ON PAGE LOAD
  -------------------------------- */
  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("INVALID");
      return;
    }

    fetch(`http://localhost:8085/api/auth/verify?token=${token}`)
      .then(async (res) => {
        const text = await res.text();
        const lower = text.toLowerCase();

        if (!res.ok) {
          setStatus("INVALID");
          return;
        }

        if (
          lower.includes("successful") ||
          lower.includes("already verified")
        ) {
          setStatus("SUCCESS");
        } else if (lower.includes("expired")) {
          setStatus("EXPIRED");
        } else {
          setStatus("INVALID");
        }
      })
      .catch(() => {
        setStatus("INVALID");
      });
  }, [searchParams]);

  /* -------------------------------
     COOLDOWN TIMER
  -------------------------------- */
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* -------------------------------
     RESEND HANDLER
  -------------------------------- */
  const handleResend = async () => {
    if (!email) {
      setResendMessage("Email not found. Please sign up again.");
      return;
    }

    if (cooldown > 0) return;

    setResending(true);
    setResendMessage("");

    try {
      const res = await fetch(
        "http://localhost:8085/api/auth/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const text = await res.text();

      if (!res.ok) {
        setResendMessage(text);
        setResending(false);
        return;
      }

      setResendMessage(`Verification email sent to ${email}`);
      setCooldown(30); // 🔥 start 30s cooldown
    } catch {
      setResendMessage("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  /* -------------------------------
     RENDER UI
  -------------------------------- */
  const renderContent = () => {
    if (status === "LOADING") {
      return <p>Verifying your email...</p>;
    }

    if (status === "SUCCESS") {
      return (
        <>
          <div className="icon success">✓</div>
          <h2>Email verified successfully 🎉</h2>
          <p>
            Your email has been confirmed.
            <br />
            You can now continue setting up your account.
          </p>
          <button onClick={() => navigate(`/role-selection?email=${encodeURIComponent(email)}`)}>
            Continue
          </button>
        </>
      );
    }

    if (status === "EXPIRED") {
      return (
        <>
          <div className="icon warning">!</div>
          <h2>Verification link expired</h2>
          <p>
            For security reasons, verification links expire after a short time.
          </p>

          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
          >
            {cooldown > 0
              ? `Resend available in ${cooldown}s`
              : resending
              ? "Sending..."
              : "Resend verification email"}
          </button>

          {resendMessage && (
            <p className="resend-message">{resendMessage}</p>
          )}

          <span className="secondary" onClick={() => navigate("/signup")}>
            Back to signup
          </span>
        </>
      );
    }

    // INVALID
    return (
      <>
        <div className="icon error">✕</div>
        <h2>Invalid verification link</h2>
        <p>This link may be invalid or already used.</p>

        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
        >
          {cooldown > 0
            ? `Resend available in ${cooldown}s`
            : resending
            ? "Sending..."
            : "Resend verification email"}
        </button>

        {resendMessage && (
          <p className="resend-message">{resendMessage}</p>
        )}

        <span className="secondary" onClick={() => navigate("/login")}>
          Go to login
        </span>
      </>
    );
  };

  return (
    <div className="verify-page">
      <div className="verify-card">{renderContent()}</div>
    </div>
  );
}

export default VerifyStatus;
