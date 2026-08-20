import { useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Settings2,
  QrCode,
  Store,
  CreditCard,
  FileText,
  Building2,
  ShieldCheck,
  Printer,
  Download,
  Save,
  Check,
  Power,
  ChevronRight,
  SlidersHorizontal,
  Smartphone,
  Banknote,
  CircleCheck,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

const DEFAULT_SETTINGS = {
  storeOpen: true,

  outletName: "Shree Krishna Tea Stall",
  slug: "shree-krishna-tea-stall",
  plan: "STARTER PLAN",
  kycStatus: "APPROVED",

  onlinePayments: true,
  cashPayments: true,

  restaurantName: "Shree Krishna Tea Stall",
  tagline: "",
  contactPhone: "+91 98765 43210",
  whatsappNumber: "+91 98765 43210",
  city: "Rajkot, Gujarat",
  operatingHours: "09:00 AM - 11:00 PM",
  address: "Near Junction Station Road, Rajkot, Gujarat",
  gstin: "24AAACQ1234F1Z0",
  fssai: "10721026000123",
  gstRate: "5",

  tableCount: 10,
  standTitle: "Scan to Order & Pay",
  brandTheme: "Saffron Gold",
};

const THEMES = {
  "Saffron Gold": {
    primary: "#C45A08",
    secondary: "#111111",
    soft: "#F8EBDD",
    label: "Warm & familiar",
  },

  "Emerald Green": {
    primary: "#087F68",
    secondary: "#111111",
    soft: "#E4F3EE",
    label: "Fresh & modern",
  },

  "Royal Blue": {
    primary: "#1D4ED8",
    secondary: "#111111",
    soft: "#E7EEFF",
    label: "Clean & trusted",
  },

  "Deep Purple": {
    primary: "#6D28D9",
    secondary: "#111111",
    soft: "#EEE8FF",
    label: "Premium & bold",
  },

  "Classic Black": {
    primary: "#111111",
    secondary: "#111111",
    soft: "#ECE9E5",
    label: "Minimal & timeless",
  },
};

function SettingsPage() {
  const [activeTab, setActiveTab] =
    useState("general");

  const [settings, setSettings] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            "ownerStoreSettings"
          );

        if (saved) {
          return {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(saved),
          };
        }

        return DEFAULT_SETTINGS;
      } catch {
        return DEFAULT_SETTINGS;
      }
    });

  const [qrTableId, setQrTableId] =
    useState("");

  const [qrSize, setQrSize] =
    useState("400");

  const [generatedQr, setGeneratedQr] =
    useState("");

  const [savedMessage, setSavedMessage] =
    useState("");

  const theme =
    THEMES[settings.brandTheme] ||
    THEMES["Saffron Gold"];

  const updateSetting = (
    key,
    value
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    localStorage.setItem(
      "ownerStoreSettings",
      JSON.stringify(settings)
    );

    setSavedMessage(
      "Changes saved successfully"
    );

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  const resetSettings = () => {
    const confirmed =
      window.confirm(
        "Reset all store settings to their default values?"
      );

    if (!confirmed) return;

    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(
      "ownerStoreSettings"
    );

    setSavedMessage(
      "Settings restored to defaults"
    );

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  const generateQr = () => {
    const table =
      qrTableId.trim();

    const url = table
      ? `${window.location.origin}/order/${settings.slug}?table=${encodeURIComponent(
          table
        )}`
      : `${window.location.origin}/order/${settings.slug}`;

    setGeneratedQr(url);
  };

  const getCurrentQrValue =
    generatedQr ||
    `${window.location.origin}/order/${settings.slug}${
      qrTableId.trim()
        ? `?table=${encodeURIComponent(
            qrTableId.trim()
          )}`
        : ""
    }`;

  const downloadQr = () => {
    const canvas =
      document.getElementById(
        "singleQrCanvas"
      );

    if (!canvas) return;

    const link =
      document.createElement("a");

    link.download = qrTableId
      ? `${settings.slug}-table-${qrTableId}.png`
      : `${settings.slug}-main-qr.png`;

    link.href =
      canvas.toDataURL("image/png");

    link.click();
  };

  const printAllStands = () => {
    window.print();
  };

  const tableNumbers = useMemo(() => {
    return Array.from(
      {
        length:
          Number(
            settings.tableCount
          ) || 1,
      },
      (_, index) =>
        index + 1
    );
  }, [
    settings.tableCount,
  ]);

  return (
    <div className="min-h-full bg-[#F7F3ED] text-[#29251F]">

      {/* =====================================================
          PRINT STYLES
      ===================================================== */}

      <style>
        {`
          @media print {
            body {
              background: white !important;
            }

            body * {
              visibility: hidden;
            }

            .print-area,
            .print-area * {
              visibility: visible;
            }

            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }

            .no-print {
              display: none !important;
            }

            .qr-stand {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>


      {/* =====================================================
          CONTROLLER HEADER
      ===================================================== */}

      <div className="border-b border-[#DED3C7] bg-[#F7F3ED]">

        <div className="px-5 pt-5 lg:px-7">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[#292621] text-[#E6A23C] shadow-[0_4px_12px_rgba(41,38,33,0.10)]">
                <Settings2
                  size={18}
                  strokeWidth={2}
                />
              </div>

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="truncate text-[19px] font-bold tracking-[-0.03em]">
                    Store Control Center
                  </h1>

                  <span className="hidden rounded-full bg-[#E8F5F0] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#287965] sm:inline-flex">
                    Owner controls
                  </span>

                </div>

                <p className="mt-0.5 truncate text-[11px] text-[#81766B]">
                  Configure how your outlet operates, accepts payments and serves QR orders
                </p>

              </div>

            </div>


            {/* Header actions */}

            <div className="flex items-center gap-2">

              {savedMessage && (
                <div className="hidden items-center gap-1.5 rounded-lg border border-[#B9DED2] bg-[#EAF6F2] px-3 py-2 text-[9px] font-bold text-[#287965] sm:flex">

                  <Check
                    size={12}
                  />

                  {savedMessage}

                </div>
              )}

              <button
                type="button"
                onClick={resetSettings}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-[#DCD1C6] bg-white px-3 text-[9px] font-bold text-[#6D645B] transition hover:bg-[#FFFDF9]"
              >
                <RotateCcw
                  size={12}
                />

                <span className="hidden sm:inline">
                  Reset
                </span>
              </button>

              <button
                type="button"
                onClick={saveSettings}
                className="flex h-9 items-center gap-1.5 rounded-lg bg-[#292621] px-3.5 text-[9px] font-bold text-white shadow-sm transition hover:bg-[#1E1C19] hover:shadow-md"
              >
                <Save
                  size={12}
                />

                Save changes
              </button>

            </div>

          </div>


          {/* Controller navigation */}

          <div className="mt-5 flex gap-1 overflow-x-auto">

            <ControllerTab
              active={
                activeTab ===
                "general"
              }
              onClick={() =>
                setActiveTab(
                  "general"
                )
              }
              icon={Settings2}
              title="Store controls"
              subtitle="Operations"
            />

            <ControllerTab
              active={
                activeTab ===
                "qr"
              }
              onClick={() =>
                setActiveTab("qr")
              }
              icon={QrCode}
              title="QR Studio"
              subtitle="Tables & stands"
            />

          </div>

        </div>

      </div>


      {activeTab ===
      "general" ? (
        <GeneralSettings
          settings={settings}
          updateSetting={
            updateSetting
          }
          saveSettings={
            saveSettings
          }
          savedMessage={
            savedMessage
          }
          qrTableId={
            qrTableId
          }
          setQrTableId={
            setQrTableId
          }
          qrSize={qrSize}
          setQrSize={
            setQrSize
          }
          generatedQr={
            generatedQr
          }
          generateQr={
            generateQr
          }
          downloadQr={
            downloadQr
          }
          currentQrValue={
            getCurrentQrValue
          }
        />
      ) : (
        <QrStudio
          settings={settings}
          updateSetting={
            updateSetting
          }
          theme={theme}
          tableNumbers={
            tableNumbers
          }
          printAllStands={
            printAllStands
          }
        />
      )}

    </div>
  );
}


/* =============================================================
   GENERAL SETTINGS
============================================================= */

function GeneralSettings({
  settings,
  updateSetting,
  saveSettings,
  qrTableId,
  setQrTableId,
  qrSize,
  setQrSize,
  generateQr,
  downloadQr,
  currentQrValue,
}) {
  return (
    <main className="mx-auto max-w-[1320px] px-5 pb-10 pt-5 lg:px-7">

      {/* ===================================================
          OPERATION STATUS
      =================================================== */}

      <section
        className={`
          mb-4
          overflow-hidden
          rounded-[15px]
          border
          shadow-[0_3px_12px_rgba(50,40,30,0.035)]
          ${
            settings.storeOpen
              ? "border-[#B9DED2] bg-[#F3FAF7]"
              : "border-[#E6BBB6] bg-[#FFF7F6]"
          }
        `}
      >

        <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">

          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${
                settings.storeOpen
                  ? "bg-[#DFF1EB] text-[#287965]"
                  : "bg-[#F9E2DF] text-[#C44A40]"
              }
            `}
          >
            <Store
              size={16}
            />
          </div>


          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-2">

              <h2
                className={`
                  text-[12px]
                  font-bold
                  ${
                    settings.storeOpen
                      ? "text-[#287965]"
                      : "text-[#C44A40]"
                  }
                `}
              >
                {settings.storeOpen
                  ? "Store is open"
                  : "Store is closed"}
              </h2>

              <span
                className={`
                  rounded-full
                  px-2
                  py-0.5
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  ${
                    settings.storeOpen
                      ? "bg-[#DFF1EB] text-[#287965]"
                      : "bg-[#F9E2DF] text-[#C44A40]"
                  }
                `}
              >
                {settings.storeOpen
                  ? "Accepting orders"
                  : "Orders paused"}
              </span>

            </div>

            <p className="mt-0.5 text-[9px] text-[#81766B]">
              {settings.storeOpen
                ? "Customers can scan tables and place new orders."
                : "New customer orders are currently paused."}
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              updateSetting(
                "storeOpen",
                !settings.storeOpen
              )
            }
            className={`
              flex
              h-8
              items-center
              gap-1.5
              rounded-lg
              px-3
              text-[9px]
              font-bold
              transition
              ${
                settings.storeOpen
                  ? "bg-[#C84B41] text-white hover:bg-[#B63D35]"
                  : "bg-[#287965] text-white hover:bg-[#216955]"
              }
            `}
          >

            <Power
              size={12}
            />

            {settings.storeOpen
              ? "Pause store"
              : "Open store"}

          </button>

        </div>

      </section>


      {/* ===================================================
          QUICK STATUS STRIP
      =================================================== */}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">

        <StatusTile
          icon={Building2}
          label="Outlet"
          value={
            settings.restaurantName
          }
          tone="neutral"
        />

        <StatusTile
          icon={CreditCard}
          label="Payments"
          value={
            settings.onlinePayments &&
            settings.cashPayments
              ? "Digital + Cash"
              : settings.onlinePayments
              ? "Digital only"
              : settings.cashPayments
              ? "Cash only"
              : "Disabled"
          }
          tone="green"
        />

        <StatusTile
          icon={ShieldCheck}
          label="Compliance"
          value={
            settings.kycStatus
          }
          tone="green"
        />

        <StatusTile
          icon={QrCode}
          label="Tables"
          value={`${settings.tableCount} active`}
          tone="amber"
        />

      </div>


      {/* ===================================================
          MAIN CONTROL GRID
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_390px]">


        {/* LEFT COLUMN */}

        <div className="space-y-4">

          {/* PROFILE */}

          <ControlPanel
            icon={Building2}
            eyebrow="IDENTITY"
            title="Outlet profile"
            description="The public information customers see across ordering and receipts."
          >

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

              <PremiumField
                label="Restaurant / Store name"
                value={
                  settings.restaurantName
                }
                onChange={(value) =>
                  updateSetting(
                    "restaurantName",
                    value
                  )
                }
              />

              <PremiumField
                label="Store tagline"
                value={
                  settings.tagline
                }
                placeholder="Authentic tea & snacks since 1998"
                onChange={(value) =>
                  updateSetting(
                    "tagline",
                    value
                  )
                }
              />

              <PremiumField
                label="Contact phone"
                value={
                  settings.contactPhone
                }
                prefix="+"
                onChange={(value) =>
                  updateSetting(
                    "contactPhone",
                    value
                  )
                }
              />

              <PremiumField
                label="WhatsApp alerts"
                value={
                  settings.whatsappNumber
                }
                onChange={(value) =>
                  updateSetting(
                    "whatsappNumber",
                    value
                  )
                }
              />

              <PremiumField
                label="City / region"
                value={
                  settings.city
                }
                onChange={(value) =>
                  updateSetting(
                    "city",
                    value
                  )
                }
              />

              <PremiumField
                label="Operating hours"
                value={
                  settings.operatingHours
                }
                onChange={(value) =>
                  updateSetting(
                    "operatingHours",
                    value
                  )
                }
              />

            </div>


            <div className="mt-3">

              <PremiumTextarea
                label="Full address"
                value={
                  settings.address
                }
                onChange={(value) =>
                  updateSetting(
                    "address",
                    value
                  )
                }
              />

            </div>

          </ControlPanel>


          {/* PAYMENTS */}

          <ControlPanel
            icon={CreditCard}
            eyebrow="PAYMENTS"
            title="Payment modes"
            description="Control which payment options customers can use when placing an order."
          >

            <div className="overflow-hidden rounded-xl border border-[#E8E0D6]">

              <PremiumToggleRow
                icon={
                  Smartphone
                }
                title="Digital payments"
                description="UPI, cards and supported online payment methods."
                checked={
                  settings.onlinePayments
                }
                onChange={() =>
                  updateSetting(
                    "onlinePayments",
                    !settings.onlinePayments
                  )
                }
              />

              <PremiumToggleRow
                icon={
                  Banknote
                }
                title="Cash at counter"
                description="Customers can reserve their token and pay at pickup."
                checked={
                  settings.cashPayments
                }
                onChange={() =>
                  updateSetting(
                    "cashPayments",
                    !settings.cashPayments
                  )
                }
                last
              />

            </div>


            <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#F8F3EB] px-3 py-2.5">

              <AlertCircle
                size={13}
                className="mt-0.5 shrink-0 text-[#B9791B]"
              />

              <p className="text-[8px] leading-3.5 text-[#83776B]">
                Disable a payment mode only when you no longer want it offered during checkout.
              </p>

            </div>

          </ControlPanel>


          {/* BUSINESS / TAX */}

          <ControlPanel
            icon={FileText}
            eyebrow="COMPLIANCE"
            title="Business & tax details"
            description="Legal and billing information used across receipts and business records."
          >

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_120px]">

              <PremiumField
                label="GSTIN"
                value={
                  settings.gstin
                }
                onChange={(value) =>
                  updateSetting(
                    "gstin",
                    value
                  )
                }
              />

              <PremiumField
                label="FSSAI license"
                value={
                  settings.fssai
                }
                onChange={(value) =>
                  updateSetting(
                    "fssai",
                    value
                  )
                }
              />

              <PremiumField
                label="GST rate"
                value={
                  settings.gstRate
                }
                type="number"
                suffix="%"
                onChange={(value) =>
                  updateSetting(
                    "gstRate",
                    value
                  )
                }
              />

            </div>

          </ControlPanel>

        </div>


        {/* RIGHT COLUMN */}

        <div className="space-y-4">


          {/* OUTLET IDENTITY CARD */}

          <section className="overflow-hidden rounded-[15px] bg-[#292621] text-white shadow-[0_8px_22px_rgba(40,35,29,0.11)]">

            <div className="border-b border-white/[0.08] px-4 py-3.5">

              <div className="flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6A23C] text-[#332511]">
                  <Store
                    size={13}
                  />
                </div>

                <div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#948B83]">
                    Outlet identity
                  </p>

                  <h2 className="mt-0.5 text-[12px] font-bold">
                    {settings.outletName}
                  </h2>

                </div>

              </div>

            </div>


            <div className="divide-y divide-white/[0.07]">

              <DarkInfoRow
                label="Store URL"
                value={`qrtoken.in/${settings.slug}`}
              />

              <DarkInfoRow
                label="Plan"
                value={settings.plan}
              />

              <DarkInfoRow
                label="KYC"
                value={settings.kycStatus}
                green
              />

            </div>


            <div className="px-4 py-3">

              <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-2.5">

                <CircleCheck
                  size={13}
                  className="text-[#55C5A6]"
                />

                <p className="text-[8px] leading-3.5 text-[#B0A79F]">
                  Your outlet profile is ready for customer-facing ordering.
                </p>

              </div>

            </div>

          </section>


          {/* QR GENERATOR */}

          <section className="overflow-hidden rounded-[15px] border border-[#DED3C7] bg-white shadow-[0_4px_16px_rgba(54,43,30,0.035)]">

            <div className="border-b border-[#EEE6DC] px-4 py-3.5">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F4E5CD] text-[#C47712]">
                    <QrCode
                      size={13}
                    />
                  </div>

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#988B7E]">
                      Quick access
                    </p>

                    <h2 className="mt-0.5 text-[12px] font-bold text-[#332D27]">
                      Instant QR
                    </h2>

                  </div>

                </div>

                <span className="rounded-full bg-[#F7F1E9] px-2 py-1 text-[7px] font-bold text-[#B97012]">
                  H level
                </span>

              </div>

            </div>


            <div className="p-4">

              {/* Controls */}

              <div className="space-y-2.5">

                <PremiumField
                  label="Table ID / number"
                  value={
                    qrTableId
                  }
                  placeholder="Blank = main outlet QR"
                  onChange={
                    setQrTableId
                  }
                />

                <PremiumSelect
                  label="Download quality"
                  value={qrSize}
                  onChange={
                    setQrSize
                  }
                  options={[
                    [
                      "300",
                      "Small · 300px",
                    ],
                    [
                      "400",
                      "Standard · 400px",
                    ],
                    [
                      "600",
                      "Large · 600px",
                    ],
                    [
                      "1000",
                      "Print quality · 1000px",
                    ],
                  ]}
                />

              </div>


              {/* QR preview */}

              <div className="mt-4 overflow-hidden rounded-[13px] border border-[#E5DDD3] bg-[#FCFAF7]">

                <div className="flex items-center justify-between border-b border-[#EAE2D8] px-3 py-2.5">

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-[0.09em] text-[#988B7E]">
                      Preview
                    </p>

                    <p className="mt-0.5 text-[9px] font-semibold text-[#4B443D]">
                      {qrTableId
                        ? `Table ${qrTableId}`
                        : "Main outlet"}
                    </p>

                  </div>

                  <QrCode
                    size={14}
                    className="text-[#8E8174]"
                  />

                </div>


                {/* FIXED QR PREVIEW AREA
                    The QR never uses qrSize for its CSS footprint.
                    qrSize controls download output only.
                */}

                <div className="flex h-[218px] items-center justify-center p-4">

                  <div className="flex h-[174px] w-[174px] items-center justify-center rounded-[14px] border border-[#E3DBD1] bg-white p-3 shadow-[0_3px_12px_rgba(50,40,30,0.06)]">

                    <QRCodeCanvas
                      id="singleQrCanvas"
                      value={
                        currentQrValue
                      }
                      size={146}
                      level="H"
                      includeMargin
                      bgColor="#FFFFFF"
                      fgColor="#111111"
                    />

                  </div>

                </div>

              </div>


              {/* Generate */}

              <button
                type="button"
                onClick={
                  generateQr
                }
                className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#292621] text-[9px] font-bold text-white transition hover:bg-[#1E1C19]"
              >
                <QrCode
                  size={12}
                />

                Generate QR
              </button>


              <button
                type="button"
                onClick={
                  downloadQr
                }
                className="mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-[#E0D6CA] bg-white text-[9px] font-bold text-[#B97012] transition hover:bg-[#FFF9F0]"
              >
                <Download
                  size={12}
                />

                Download PNG
              </button>

            </div>

          </section>


          {/* SAVE REMINDER */}

          <div className="flex items-start gap-2 rounded-[12px] border border-[#E5D9CB] bg-[#FBF7F1] px-3.5 py-3">

            <Save
              size={13}
              className="mt-0.5 shrink-0 text-[#B97012]"
            />

            <div>

              <p className="text-[9px] font-bold text-[#5D534A]">
                Configuration changes are local
              </p>

              <p className="mt-0.5 text-[8px] leading-3.5 text-[#978B7F]">
                Save your changes after updating the controls above.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* SAVE BAR */}

      <div className="sticky bottom-3 z-20 mt-5">

        <div className="flex items-center justify-between gap-3 rounded-[13px] border border-[#DCD1C6] bg-white/95 px-3.5 py-2.5 shadow-[0_8px_28px_rgba(40,34,27,0.10)] backdrop-blur">

          <div className="flex min-w-0 items-center gap-2">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E8F5F0] text-[#287965]">
              <Check
                size={13}
              />
            </div>

            <p className="truncate text-[9px] font-semibold text-[#665C53]">
              Store controls are ready to save
            </p>

          </div>

          <button
            type="button"
            onClick={
              saveSettings
            }
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#292621] px-3.5 text-[9px] font-bold text-white hover:bg-[#1E1C19]"
          >
            <Save
              size={12}
            />

            Save changes
          </button>

        </div>

      </div>

    </main>
  );
}


/* =============================================================
   QR STUDIO
============================================================= */

function QrStudio({
  settings,
  updateSetting,
  theme,
  tableNumbers,
  printAllStands,
}) {
  return (
    <main className="mx-auto max-w-[1320px] px-5 pb-12 pt-5 lg:px-7">

      {/* HEADER */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-2.5">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#292621] text-[#E6A23C]">
            <QrCode
              size={16}
            />
          </div>

          <div>

            <h2 className="text-[17px] font-bold tracking-[-0.02em]">
              QR Studio
            </h2>

            <p className="mt-0.5 text-[10px] text-[#81766B]">
              Design, preview and prepare table ordering stands
            </p>

          </div>

        </div>


        <button
          type="button"
          onClick={
            printAllStands
          }
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[#287965] px-3.5 text-[9px] font-bold text-white shadow-sm transition hover:bg-[#216955]"
        >
          <Printer
            size={12}
          />

          Print all stands
        </button>

      </div>


      {/* CONFIGURATION */}

      <section className="mb-5 overflow-hidden rounded-[15px] border border-[#DED3C7] bg-white shadow-[0_4px_16px_rgba(54,43,30,0.035)]">

        <div className="border-b border-[#EEE6DC] px-4 py-3.5">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0EAE3] text-[#6C6258]">
              <SlidersHorizontal
                size={13}
              />
            </div>

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#988B7E]">
                Configuration
              </p>

              <h2 className="mt-0.5 text-[12px] font-bold text-[#332D27]">
                Stand settings
              </h2>

            </div>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">

          <PremiumField
            label="Table count"
            value={
              settings.tableCount
            }
            type="number"
            onChange={(value) => {

              let count =
                Number(value);

              if (count < 1)
                count = 1;

              if (count > 20)
                count = 20;

              updateSetting(
                "tableCount",
                count
              );

            }}
          />

          <PremiumField
            label="Stand title"
            value={
              settings.standTitle
            }
            onChange={(value) =>
              updateSetting(
                "standTitle",
                value
              )
            }
          />

          <PremiumSelect
            label="Brand theme"
            value={
              settings.brandTheme
            }
            onChange={(value) =>
              updateSetting(
                "brandTheme",
                value
              )
            }
            options={Object.keys(
              THEMES
            ).map(
              (name) => [
                name,
                name,
              ]
            )}
          />

        </div>

      </section>


      {/* PREVIEW HEADER */}

      <div className="mb-3 flex items-center justify-between">

        <div>

          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#988B7E]">
            Live preview
          </p>

          <h3 className="mt-0.5 text-[13px] font-bold text-[#332D27]">
            {tableNumbers.length} table stands
          </h3>

        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-[#E0D6CA] bg-white px-2.5 py-1.5">

          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor:
                theme.primary,
            }}
          />

          <span className="text-[8px] font-bold text-[#766B61]">
            {settings.brandTheme}
          </span>

        </div>

      </div>


      {/* PRINT AREA */}

      <div className="print-area grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {tableNumbers.map(
          (table) => (
            <TableStand
              key={table}
              table={table}
              settings={
                settings
              }
              theme={theme}
            />
          )
        )}

      </div>

    </main>
  );
}


/* =============================================================
   TABLE STAND
============================================================= */

function TableStand({
  table,
  settings,
  theme,
}) {
  const qrValue =
    `${window.location.origin}/order/${settings.slug}?table=${table}`;

  const displayName =
    settings.restaurantName
      .trim()
      .toUpperCase();

  return (
    <div
      className="qr-stand overflow-hidden rounded-[18px] bg-white shadow-[0_8px_22px_rgba(40,34,27,0.08)]"
      style={{
        border:
          `1px solid ${theme.primary}35`,
      }}
    >

      {/* BRAND HEADER */}

      <div
        className="px-5 py-5 text-center text-white"
        style={{
          backgroundColor:
            theme.primary,
        }}
      >

        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
          <Store
            size={15}
          />
        </div>

        <h2 className="mt-2 break-words text-[17px] font-extrabold leading-tight tracking-[-0.02em]">
          {displayName}
        </h2>

        <p className="mt-1 text-[9px] font-medium opacity-80">
          {settings.city}
        </p>

      </div>


      {/* BODY */}

      <div className="px-5 py-5 text-center">

        <div
          className="mx-auto mb-4 inline-flex items-center rounded-full px-5 py-2 text-[14px] font-black tracking-[0.18em] text-white"
          style={{
            backgroundColor:
              theme.secondary,
          }}
        >
          TABLE{" "}
          {String(table).padStart(
            2,
            "0"
          )}
        </div>


        {/* FIXED QR CONTAINER */}

        <div className="mx-auto flex h-[194px] w-[194px] items-center justify-center rounded-[15px] border border-[#E1D9CF] bg-white p-3 shadow-[0_4px_15px_rgba(40,34,27,0.07)]">

          <QRCodeCanvas
            value={qrValue}
            size={166}
            level="H"
            includeMargin
            bgColor="#FFFFFF"
            fgColor="#111111"
          />

        </div>


        <h3 className="mt-5 break-words text-[15px] font-bold text-[#29251F]">
          {settings.standTitle}
        </h3>

        <p className="mx-auto mt-2 max-w-[280px] text-[9px] leading-4 text-[#756C63]">
          Scan the QR code → Browse menu → Pay
          via UPI or cash → Pick up when your
          token is called.
        </p>

      </div>


      {/* FOOTER */}

      <div
        className="flex items-center justify-center gap-1.5 px-4 py-3 text-center text-[8px] font-bold text-white"
        style={{
          backgroundColor:
            theme.secondary,
        }}
      >

        <QrCode
          size={10}
        />

        Powered by QRToken.in

      </div>

    </div>
  );
}


/* =============================================================
   CONTROLLER TAB
============================================================= */

function ControllerTab({
  active,
  onClick,
  icon: Icon,
  title,
  subtitle,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        flex
        shrink-0
        items-center
        gap-2.5
        rounded-t-[11px]
        px-3.5
        py-2.5
        text-left
        transition
        ${
          active
            ? "bg-white text-[#29251F]"
            : "text-[#80766C] hover:bg-white/60"
        }
      `}
    >

      <div
        className={`
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-lg
          ${
            active
              ? "bg-[#292621] text-[#E6A23C]"
              : "bg-[#EEE8E0] text-[#80766C]"
          }
        `}
      >
        <Icon
          size={13}
        />
      </div>

      <div>

        <p className="text-[9px] font-bold">
          {title}
        </p>

        <p className="mt-0.5 text-[7px] text-[#9A8E82]">
          {subtitle}
        </p>

      </div>

      {active && (
        <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[#D8942E]" />
      )}

    </button>
  );
}


/* =============================================================
   STATUS TILE
============================================================= */

function StatusTile({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const styles = {
    amber:
      "bg-[#F5E8D3] text-[#B97012]",
    green:
      "bg-[#E5F3EE] text-[#287965]",
    neutral:
      "bg-[#F0EAE3] text-[#6C6258]",
  };

  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-[12px] border border-[#DED3C7] bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(50,40,30,0.025)]">

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles[tone]}`}
      >
        <Icon
          size={13}
        />
      </div>

      <div className="min-w-0">

        <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[#988B7E]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[10px] font-bold text-[#4A433C]">
          {value}
        </p>

      </div>

    </div>
  );
}


/* =============================================================
   CONTROL PANEL
============================================================= */

function ControlPanel({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-[15px] border border-[#DED3C7] bg-white shadow-[0_4px_16px_rgba(54,43,30,0.035)]">

      <div className="border-b border-[#EEE6DC] px-4 py-3.5">

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0EAE3] text-[#6C6258]">
            <Icon
              size={14}
            />
          </div>

          <div>

            <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#B07827]">
              {eyebrow}
            </p>

            <h2 className="mt-0.5 text-[12px] font-bold text-[#332D27]">
              {title}
            </h2>

            <p className="mt-0.5 text-[8px] text-[#94897E]">
              {description}
            </p>

          </div>

        </div>

      </div>


      <div className="p-4">
        {children}
      </div>

    </section>
  );
}


/* =============================================================
   PREMIUM FIELD
============================================================= */

function PremiumField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  suffix,
}) {
  return (
    <div className="min-w-0">

      <label className="mb-1.5 block truncate text-[8px] font-bold uppercase tracking-[0.09em] text-[#766B61]">
        {label}
      </label>

      <div className="relative">

        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#81766B]">
            {prefix}
          </span>
        )}

        <input
          type={type}
          min={
            type === "number"
              ? 0
              : undefined
          }
          value={
            value ?? ""
          }
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          className={`
            h-9
            w-full
            rounded-lg
            border
            border-[#DCD1C6]
            bg-white
            ${
              prefix
                ? "pl-7"
                : "pl-3"
            }
            ${
              suffix
                ? "pr-8"
                : "pr-3"
            }
            text-[10px]
            font-semibold
            text-[#39322C]
            outline-none
            transition
            placeholder:text-[#AAA096]
            hover:border-[#CFC1B4]
            focus:border-[#D49A48]
            focus:bg-[#FFFDF9]
            focus:ring-[3px]
            focus:ring-[#D49A48]/10
          `}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#81766B]">
            {suffix}
          </span>
        )}

      </div>

    </div>
  );
}


/* =============================================================
   PREMIUM SELECT
============================================================= */

function PremiumSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="min-w-0">

      <label className="mb-1.5 block truncate text-[8px] font-bold uppercase tracking-[0.09em] text-[#766B61]">
        {label}
      </label>

      <div className="relative">

        <select
          value={
            value ?? ""
          }
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="
            h-9
            w-full
            appearance-none
            rounded-lg
            border
            border-[#DCD1C6]
            bg-white
            px-3
            pr-8
            text-[10px]
            font-semibold
            text-[#39322C]
            outline-none
            transition
            hover:border-[#CFC1B4]
            focus:border-[#D49A48]
            focus:bg-[#FFFDF9]
            focus:ring-[3px]
            focus:ring-[#D49A48]/10
          "
        >

          {options.map(
            ([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            )
          )}

        </select>

        <ChevronRight
          size={12}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-[#81766B]"
        />

      </div>

    </div>
  );
}


/* =============================================================
   PREMIUM TEXTAREA
============================================================= */

function PremiumTextarea({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[8px] font-bold uppercase tracking-[0.09em] text-[#766B61]">
        {label}
      </label>

      <textarea
        rows={3}
        value={
          value ?? ""
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          w-full
          resize-none
          rounded-lg
          border
          border-[#DCD1C6]
          bg-white
          px-3
          py-2.5
          text-[10px]
          font-semibold
          leading-4
          text-[#39322C]
          outline-none
          transition
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
   PREMIUM TOGGLE ROW
============================================================= */

function PremiumToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  last = false,
}) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-3
        px-3
        py-3
        ${
          !last
            ? "border-b border-[#EEE6DC]"
            : ""
        }
      `}
    >

      <div className="flex min-w-0 items-center gap-2.5">

        <div
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${
              checked
                ? "bg-[#E5F3EE] text-[#287965]"
                : "bg-[#F0EAE3] text-[#958A7F]"
            }
          `}
        >
          <Icon
            size={13}
          />
        </div>

        <div className="min-w-0">

          <p className="truncate text-[10px] font-bold text-[#403931]">
            {title}
          </p>

          <p className="mt-0.5 truncate text-[8px] text-[#958A7F]">
            {description}
          </p>

        </div>

      </div>


      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`
          relative
          h-6
          w-10
          shrink-0
          rounded-full
          transition
          ${
            checked
              ? "bg-[#287965]"
              : "bg-[#C9C1B8]"
          }
        `}
      >

        <span
          className={`
            absolute
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow-[0_1px_3px_rgba(0,0,0,0.18)]
            transition-all
            ${
              checked
                ? "left-5"
                : "left-1"
            }
          `}
        />

      </button>

    </div>
  );
}


/* =============================================================
   DARK INFO ROW
============================================================= */

function DarkInfoRow({
  label,
  value,
  green = false,
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">

      <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#817870]">
        {label}
      </span>

      <span
        className={`truncate text-right text-[9px] font-bold ${
          green
            ? "text-[#55C5A6]"
            : "text-[#D7D0C8]"
        }`}
      >
        {value}
      </span>

    </div>
  );
}


export default SettingsPage;