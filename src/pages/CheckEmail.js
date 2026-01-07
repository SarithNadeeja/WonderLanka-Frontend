import "./CheckEmail.css";

function CheckEmail() {
  return (
    <div className="check-email-page">
      <div className="check-email-card">
        <h2>Check your email 📧</h2>
        <p>
          We’ve sent you a verification link.
          <br />
          Please open your email and click the link to continue.
        </p>

        <p className="check-email-note">
          Didn’t receive it? Check your spam folder.
        </p>
      </div>
    </div>
  );
}

export default CheckEmail;
