import { useState } from "react";
import { loginOwner } from "../api/authApi";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  QrCode,
  ShieldCheck,
  Store,
  UtensilsCrossed,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";


function OwnerLogin() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Enter your email and password to continue."
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginOwner(
        email,
        password
      );

      const { token, user } = result;

      localStorage.setItem(
        "ownerToken",
        token
      );

      localStorage.setItem(
        "ownerUser",
        JSON.stringify(user)
      );

      dispatch(loginSuccess({ user, token }));

      navigate("/owner/orders");

    } catch (error) {
      setError(
        error.message ||
        "Unable to sign in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoAccount = () => {
    setEmail("owner@qrtoken.in");
    setPassword("demo1234");
    setError("");
  };


  return (
    <main className="min-h-screen bg-[#F7F3ED] text-[#29251F]">

      {/* =====================================================
          PAGE SHELL
      ===================================================== */}

      <div className="mx-auto flex min-h-screen w-full max-w-[1380px] flex-col px-5 py-5 sm:px-7 lg:px-10">

        {/* ===================================================
            BRAND HEADER
        =================================================== */}

        <header className="flex items-center justify-between">

          <Link
            to="/"
            className="group flex items-center gap-2.5"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#292621] text-[#E6A23C] shadow-[0_4px_12px_rgba(41,38,33,0.10)] transition group-hover:-translate-y-0.5">
              <QrCode
                size={17}
                strokeWidth={2.2}
              />
            </div>

            <div>

              <p className="text-[16px] font-black tracking-[-0.04em] text-[#29251F]">
                QRToken
                <span className="text-[#C47A18]">
                  .in
                </span>
              </p>

              <p className="mt-[-1px] text-[7px] font-bold uppercase tracking-[0.15em] text-[#93877B]">
                Restaurant operations
              </p>

            </div>

          </Link>


          <div className="hidden items-center gap-2 rounded-full border border-[#E1D7CC] bg-white/70 px-3 py-1.5 sm:flex">

            <span className="h-1.5 w-1.5 rounded-full bg-[#35A982]" />

            <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#756B61]">
              Owner portal
            </span>

          </div>

        </header>


        {/* ===================================================
            MAIN
        =================================================== */}

        <div className="flex flex-1 items-center justify-center py-8 lg:py-10">

          <div className="grid w-full max-w-[1010px] grid-cols-1 overflow-hidden rounded-[22px] border border-[#DED3C7] bg-white shadow-[0_18px_55px_rgba(48,39,29,0.09)] lg:grid-cols-[1fr_0.88fr]">


            {/* =================================================
                LOGIN SIDE
            ================================================= */}

            <section className="px-6 py-8 sm:px-9 sm:py-10 lg:px-11 lg:py-11">

              {/* Eyebrow */}

              <div className="mb-7">

                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F4E5CD] text-[#B97012]">
                  <LockKeyhole
                    size={16}
                  />
                </div>

                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#B07827]">
                  Owner access
                </p>

                <h1 className="mt-1.5 text-[25px] font-black tracking-[-0.04em] text-[#29251F] sm:text-[28px]">
                  Welcome back.
                </h1>

                <p className="mt-1.5 max-w-[410px] text-[12px] leading-5 text-[#81766B]">
                  Sign in to manage your restaurant,
                  orders, payments and daily operations.
                </p>

              </div>


              {/* Error */}

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-[10px] border border-[#E8B9B4] bg-[#FFF5F3] px-3 py-2.5">

                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#D9574D] text-white">
                    <span className="text-[9px] font-black">
                      !
                    </span>
                  </div>

                  <p className="text-[9px] font-semibold leading-4 text-[#B33F37]">
                    {error}
                  </p>

                </div>
              )}


              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                <AuthField
                  label="Email address"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@restaurant.com"
                  autoComplete="email"
                />


                <AuthField
                  label="Password"
                  icon={LockKeyhole}
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) =>
                            !value
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[#8D8277] transition hover:bg-[#F4EFE9] hover:text-[#4C443D]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={14}
                        />
                      ) : (
                        <Eye
                          size={14}
                        />
                      )}
                    </button>
                  }
                />


                {/* Remember / forgot */}

                <div className="flex items-center justify-between gap-3 pt-0.5">

                  <label className="flex cursor-pointer items-center gap-2">

                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={
                        rememberMe
                      }
                      onClick={() =>
                        setRememberMe(
                          (value) =>
                            !value
                        )
                      }
                      className={`
                        flex
                        h-4
                        w-4
                        items-center
                        justify-center
                        rounded-[5px]
                        border
                        transition
                        ${
                          rememberMe
                            ? "border-[#287965] bg-[#287965] text-white"
                            : "border-[#CFC5BA] bg-white"
                        }
                      `}
                    >
                      {rememberMe && (
                        <CheckCircle2
                          size={11}
                          strokeWidth={3}
                        />
                      )}
                    </button>

                    <span className="text-[12px] font-semibold text-[#766B61]">
                      Keep me signed in
                    </span>

                  </label>


                  <button
                    type="button"
                    className="text-[9px] font-bold text-[#B97012] transition hover:text-[#8E570C]"
                    onClick={() =>
                      setError(
                        "Password recovery will be available once authentication is connected."
                      )
                    }
                  >
                    Forgot password?
                  </button>

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    group
                    mt-1
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[10px]
                    bg-[#292621]
                    px-4
                    text-[10px]
                    font-bold
                    text-white
                    shadow-[0_4px_12px_rgba(41,38,33,0.12)]
                    transition
                    hover:-translate-y-0.5
                    hover:bg-[#1E1C19]
                    hover:shadow-[0_7px_18px_rgba(41,38,33,0.15)]
                    active:translate-y-0
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {isLoading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Signing you in...
                    </>
                  ) : (
                    <>
                      Sign in to Owner Console

                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}

                </button>

              </form>


              {/* DEMO */}

              <div className="mt-5 rounded-[11px] border border-[#E8DED3] bg-[#FCFAF7] p-3">

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-start gap-2">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F2E7D7] text-[#B97012]">
                      <SparklesIcon />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[9px] font-bold text-[#514941]">
                        Demo access
                      </p>

                      <p className="mt-0.5 text-[8px] leading-3.5 text-[#93887D]">
                        Explore the owner console with sample restaurant data.
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      useDemoAccount
                    }
                    className="shrink-0 rounded-lg border border-[#E0D3C5] bg-white px-2.5 py-1.5 text-[8px] font-bold text-[#B97012] transition hover:bg-[#FFF8EE]"
                  >
                    Use demo
                  </button>

                </div>

              </div>


              {/* Register */}

              <div className="mt-6 flex items-center justify-center gap-1.5">

                <span className="text-[12px] font-medium text-[#91867B]">
                  New restaurant?
                </span>

                <Link
                  to="/register"
                  className="flex items-center gap-1 text-[12px] font-bold text-[#29251F] transition hover:text-[#B97012]"
                >
                  Register your outlet

                  <ArrowRight
                    size={12}
                  />
                </Link>

              </div>

            </section>


            {/* =================================================
                PRODUCT SIDE
            ================================================= */}

            <aside className="relative hidden overflow-hidden bg-[#292621] lg:block">

              {/* Decorative structure */}

              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/[0.05]" />

              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/[0.04]" />

              <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full border border-[#E6A23C]/[0.08]" />


              <div className="relative flex h-full flex-col justify-between p-8">

                {/* Top */}

                <div>

                  <div className="flex items-center justify-between">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6A23C] text-[#332511]">
                      <Store
                        size={14}
                      />
                    </div>

                    <span className="rounded-full border border-white/[0.09] bg-white/[0.04] px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-[#B9B0A8]">
                      Built for owners
                    </span>

                  </div>


                  <p className="mt-9 text-[8px] font-bold uppercase tracking-[0.15em] text-[#B9AFA5]">
                    Your restaurant control room
                  </p>

                  <h2 className="mt-2 max-w-[320px] text-[25px] font-black leading-[1.08] tracking-[-0.04em] text-white">
                    Everything behind the counter.
                    <span className="text-[#E6A23C]">
                      {" "}
                      One place.
                    </span>
                  </h2>

                  <p className="mt-3 max-w-[315px] text-[10px] leading-5 text-[#A59D95]">
                    Orders, kitchen flow, tables,
                    payments and reports — designed
                    to keep the restaurant moving.
                  </p>

                </div>


                {/* Operational preview */}

                <div className="my-8">

                  <div className="rounded-[15px] border border-white/[0.08] bg-white/[0.045] p-3.5 backdrop-blur-sm">

                    <div className="mb-3 flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6A23C]/15 text-[#E6A23C]">
                          <ActivityIcon />
                        </div>

                        <div>

                          <p className="text-[8px] font-bold text-[#DDD7D0]">
                            Owner Console
                          </p>

                          <p className="text-[7px] text-[#827A73]">
                            Operational overview
                          </p>

                        </div>

                      </div>

                      <span className="flex items-center gap-1 text-[7px] font-bold text-[#55C5A6]">

                        <span className="h-1.5 w-1.5 rounded-full bg-[#55C5A6]" />

                        Ready

                      </span>

                    </div>


                    <div className="grid grid-cols-3 gap-2">

                      <PreviewMetric
                        icon={UtensilsCrossed}
                        label="Orders"
                        value="142"
                      />

                      <PreviewMetric
                        icon={QrCode}
                        label="Tables"
                        value="10"
                      />

                      <PreviewMetric
                        icon={ShieldCheck}
                        label="Status"
                        value="Open"
                        green
                      />

                    </div>

                  </div>

                </div>


                {/* Bottom benefits */}

                <div className="space-y-2.5">

                  <FeatureLine>
                    Live order visibility
                  </FeatureLine>

                  <FeatureLine>
                    Kitchen-first workflows
                  </FeatureLine>

                  <FeatureLine>
                    Payments & cash control
                  </FeatureLine>

                </div>

              </div>

            </aside>

          </div>

        </div>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pb-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-[#A0958A]">

          <span>
            QRToken.in
          </span>

          <span className="h-1 w-1 rounded-full bg-[#CFC4B9]" />

          <span className="flex items-center gap-1 ">
            Owner access
          </span>

         

          <span>
            Secure workspace
          </span>

        </footer>

      </div>

    </main>
  );
}


/* =============================================================
   AUTH FIELD
============================================================= */

function AuthField({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  rightElement,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.09em] text-[#766B61]">
        {label}
      </label>

      <div className="relative">

        <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#9A8E82]">
          <Icon
            size={14}
            strokeWidth={1.9}
          />
        </div>

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          autoComplete={
            autoComplete
          }
          className={`
            h-11
            w-full
            rounded-[10px]
            border
            border-[#DCD1C6]
            bg-white
            pl-10
            ${
              rightElement
                ? "pr-11"
                : "pr-3"
            }
            text-[11px]
            font-semibold
            text-[#39322C]
            outline-none
            shadow-[inset_0_1px_1px_rgba(40,32,24,0.02)]
            transition
            placeholder:text-[#AAA096]
            hover:border-[#CFC1B4]
            focus:border-[#D49A48]
            focus:bg-[#FFFDF9]
            focus:ring-[3px]
            focus:ring-[#D49A48]/10
          `}
        />

        {rightElement && (
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}

      </div>

    </div>
  );
}


/* =============================================================
   PREVIEW METRIC
============================================================= */

function PreviewMetric({
  icon: Icon,
  label,
  value,
  green = false,
}) {
  return (
    <div className="rounded-[9px] border border-white/[0.06] bg-black/[0.10] px-2.5 py-2">

      <Icon
        size={11}
        className={
          green
            ? "text-[#55C5A6]"
            : "text-[#E6A23C]"
        }
      />

      <p className="mt-2 text-[7px] font-semibold text-[#847C75]">
        {label}
      </p>

      <p
        className={`mt-0.5 text-[10px] font-bold ${
          green
            ? "text-[#55C5A6]"
            : "text-[#E4DED7]"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* =============================================================
   FEATURE LINE
============================================================= */

function FeatureLine({
  children,
}) {
  return (
    <div className="flex items-center gap-2">

      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#55C5A6]/10 text-[#55C5A6]">
        <CheckCircle2
          size={11}
        />
      </div>

      <span className="text-[8px] font-semibold text-[#B6AEA7]">
        {children}
      </span>

    </div>
  );
}


/* =============================================================
   SMALL ICON HELPERS
============================================================= */

function SparklesIcon() {
  return (
    <Sparkles
      size={13}
    />
  );
}

function ActivityIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function Sparkles({
  size = 13,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5L12 3Z" />
      <path d="m19 14-.8 2.2L16 17l2.2.8L19 20l.8-2.2L22 17l-2.2-.8L19 14Z" />
      <path d="m5 3-.6 1.6L3 5l1.4.4L5 7l.6-1.6L7 5l-1.4-.4L5 3Z" />
    </svg>
  );
}

export default OwnerLogin;