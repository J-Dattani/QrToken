import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerOwner } from "../api/authApi";

function OwnerRegister() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    outletName: "",
    ownerName: "",
    phone: "",
    city: "",
    email: "",
    password: "",
    gstin: "",
    fssai: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerOwner(form);

      setSuccess(
        "Owner account created successfully. Please sign in."
      );

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      setError(
        error.message ||
          "Unable to create owner account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F3ED] px-4 py-5 sm:px-6">

      {/* =====================================================
          BACKGROUND ATMOSPHERE
          ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -bottom-48
            -left-40
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#E5EFEB]
            opacity-70
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            -right-48
            -top-48
            h-[440px]
            w-[440px]
            rounded-full
            bg-[#F2DFC0]
            opacity-70
            blur-[100px]
          "
        />

      </div>

      {/* =====================================================
          REGISTER PANEL
          ===================================================== */}

      <main className="relative z-10 w-full max-w-[760px]">

        <div
          className="
            overflow-hidden
            rounded-[20px]
            border
            border-[#E2D7CB]
            bg-[#FFFDFC]
            shadow-[0_22px_65px_rgba(57,45,31,0.12)]
          "
        >

          {/* =================================================
              TOP AREA
              ================================================= */}

          <div className="px-6 pb-5 pt-5 sm:px-8 sm:pt-6">

            <div className="flex items-start justify-between">

              {/* Brand */}

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-[#E3A02C]
                    text-[#211D18]
                    shadow-[0_5px_13px_rgba(194,132,34,0.20)]
                  "
                >
                  <QrCode
                    size={19}
                    strokeWidth={2.2}
                  />
                </div>

                <div>

                  <p className="text-[14px] font-extrabold leading-none tracking-[-0.02em] text-[#211D18]">
                    QRToken.in
                  </p>

                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#80766B]">
                    Owner Portal
                  </p>

                </div>

              </div>

              {/* Secure */}

              <div
                className="
                  hidden
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#DDEBE5]
                  bg-[#F3FAF7]
                  px-2.5
                  py-1.5
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-[#27816D]
                  sm:flex
                "
              >
                <ShieldCheck size={11} />
                Secure setup
              </div>

            </div>

            {/* Title */}

            <div className="mt-5">

              <div className="flex flex-wrap items-center gap-2">

                <h1
                  className="
                    text-[23px]
                    font-extrabold
                    leading-none
                    tracking-[-0.045em]
                    text-[#211D18]
                    sm:text-[25px]
                  "
                >
                  Set up your outlet
                </h1>

                <span
                  className="
                    rounded-full
                    bg-[#F5E8D2]
                    px-2
                    py-[4px]
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.11em]
                    text-[#A66B17]
                  "
                >
                  Get started
                </span>

              </div>

              <p className="mt-2 text-[11px] text-[#80766B] sm:text-[12px]">
                Create your restaurant workspace for QR ordering and counter
                operations.
              </p>

            </div>

          </div>

          {/* =================================================
              FORM
              ================================================= */}

          <form onSubmit={handleSubmit}>

            {/* Error / Success */}

            {error && (
              <div className="mx-6 mb-4 rounded-[10px] border border-[#E7B8B3] bg-[#FFF1EF] px-3.5 py-3 text-[11px] font-semibold text-[#C23F38] sm:mx-8">
                {error}
              </div>
            )}

            {success && (
              <div className="mx-6 mb-4 rounded-[10px] border border-[#B9DED2] bg-[#EFF9F5] px-3.5 py-3 text-[11px] font-semibold text-[#277C68] sm:mx-8">
                {success}
              </div>
            )}

            {/* =================================================
                FORM FIELDS
                ================================================= */}

            <div className="px-6 pb-5 sm:px-8">

              {/* =================================================
                  OUTLET
                  ================================================= */}

              <CompactSection
                number="01"
                title="Outlet details"
              >

                <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">

                  <PremiumField
                    label="Outlet / Restaurant Name"
                    name="outletName"
                    value={form.outletName}
                    onChange={handleChange}
                    placeholder="e.g. Shree Krishna Tea Stall"
                    required
                  />

                  <PremiumField
                    label="Owner Full Name"
                    name="ownerName"
                    value={form.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patel"
                    required
                  />

                  <PremiumField
                    label="Mobile Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    type="tel"
                    required
                  />

                  <PremiumField
                    label="City / Region"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Rajkot, Gujarat"
                    required
                  />

                </div>

              </CompactSection>

              {/* =================================================
                  ACCOUNT
                  ================================================= */}

              <CompactSection
                number="02"
                title="Account access"
              >

                <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">

                  <PremiumField
                    label="Email Address"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="owner@qrtoken.in"
                    type="email"
                    required
                  />

                  <PasswordField
                    value={form.password}
                    onChange={handleChange}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />

                </div>

              </CompactSection>

              {/* =================================================
                  BUSINESS
                  ================================================= */}

              <CompactSection
                number="03"
                title="Business information"
                optional
                last
              >

                <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">

                  <PremiumField
                    label="GSTIN"
                    name="gstin"
                    value={form.gstin}
                    onChange={handleChange}
                    placeholder="e.g. 24AAAAA0000A1Z5"
                  />

                  <PremiumField
                    label="FSSAI License Number"
                    name="fssai"
                    value={form.fssai}
                    onChange={handleChange}
                    placeholder="e.g. 10019021000000"
                  />

                </div>

              </CompactSection>

            </div>

            {/* =================================================
                ACTION BAR
                ================================================= */}

            <div
              className="
                border-t
                border-[#E9E0D7]
                bg-[#FCFAF7]
                px-6
                py-3.5
                sm:px-8
              "
            >

              <div className="flex items-center justify-between gap-4">

                {/* Login */}

                <span className="ml-1 text-[11px] text-[#6D635A]">
                  Already registered?

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="
                      shrink-0
                      rounded-[9px]
                      px-2
                      py-2
                      text-[11px]
                      font-semibold
                      text-[#6D635A]
                      transition
                      hover:text-[#A66B17]
                    "
                  >
                    Sign in
                  </button>
                </span>

                {/* Create */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    flex
                    h-[41px]
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-[10px]
                    bg-[#27231F]
                    px-5
                    text-[11px]
                    font-bold
                    text-white
                    shadow-[0_6px_16px_rgba(38,33,28,0.15)]
                    transition-all
                    duration-150
                    hover:bg-[#332E28]
                    hover:shadow-[0_8px_20px_rgba(38,33,28,0.19)]
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:px-6
                  "
                >
                  {loading
                    ? "Creating account..."
                    : "Create Owner Account"}

                  {!loading && (
                    <ArrowRight
                      size={14}
                      strokeWidth={2.3}
                      className="transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  )}
                </button>

              </div>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

/* =============================================================
   COMPACT SECTION
   ============================================================= */

function CompactSection({
  number,
  title,
  optional = false,
  last = false,
  children,
}) {
  return (
    <section className={last ? "" : "mb-4.5"}>

      <div className="mb-2.5 flex items-center gap-2.5">

        <span
          className="
            flex
            h-[23px]
            min-w-[23px]
            items-center
            justify-center
            rounded-[7px]
            bg-[#F4E9D8]
            px-1.5
            text-[8px]
            font-extrabold
            tracking-[0.03em]
            text-[#AE701C]
          "
        >
          {number}
        </span>

        <div className="flex items-center gap-2">

          <h2
            className="
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.1em]
              text-[#40382F]
            "
          >
            {title}
          </h2>

          {optional && (
            <span
              className="
                rounded-full
                bg-[#F0EBE5]
                px-1.5
                py-[2px]
                text-[7px]
                font-bold
                text-[#91867B]
              "
            >
              Optional
            </span>
          )}

        </div>

      </div>

      {children}

    </section>
  );
}

/* =============================================================
   PREMIUM FIELD
   ============================================================= */

function PremiumField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="
          mb-1
          block
          text-[8px]
          font-bold
          uppercase
          tracking-[0.075em]
          text-[#766B61]
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-[#C47B1C]">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          h-[38px]
          w-full
          rounded-[9px]
          border
          border-[#DED3C7]
          bg-white
          px-3
          text-[11px]
          font-medium
          text-[#29241F]
          outline-none
          shadow-[inset_0_1px_1px_rgba(40,32,24,0.02)]
          transition-all
          placeholder:text-[#AAA096]
          hover:border-[#CFC1B4]
          focus:border-[#D49A48]
          focus:bg-[#FFFDF9]
          focus:ring-[3px]
          focus:ring-[#D49A48]/10
        "
      />

    </div>
  );
}

/* =============================================================
   PASSWORD
   ============================================================= */

function PasswordField({
  value,
  onChange,
  showPassword,
  setShowPassword,
}) {
  return (
    <div>

      <label
        htmlFor="password"
        className="
          mb-1
          block
          text-[8px]
          font-bold
          uppercase
          tracking-[0.075em]
          text-[#766B61]
        "
      >
        Account Password

        <span className="ml-1 text-[#C47B1C]">
          *
        </span>
      </label>

      <div className="relative">

        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Create a secure password"
          required
          className="
            h-[38px]
            w-full
            rounded-[9px]
            border
            border-[#DED3C7]
            bg-white
            px-3
            pr-10
            text-[11px]
            font-medium
            text-[#29241F]
            outline-none
            transition-all
            placeholder:text-[#AAA096]
            hover:border-[#CFC1B4]
            focus:border-[#D49A48]
            focus:bg-[#FFFDF9]
            focus:ring-[3px]
            focus:ring-[#D49A48]/10
          "
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword((previous) => !previous)
          }
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          className="
            absolute
            right-1.5
            top-1/2
            flex
            h-7
            w-7
            -translate-y-1/2
            items-center
            justify-center
            rounded-[7px]
            text-[#8C8176]
            transition
            hover:bg-[#F4EEE7]
            hover:text-[#51483F]
          "
        >
          {showPassword ? (
            <EyeOff size={14} />
          ) : (
            <Eye size={14} />
          )}
        </button>

      </div>

    </div>
  );
}

export default OwnerRegister;