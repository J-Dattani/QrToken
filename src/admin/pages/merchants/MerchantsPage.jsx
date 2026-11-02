
import { useMemo, useState } from "react";
import {
  AddRounded,
  BusinessRounded,
  CheckCircleRounded,
  CloseRounded,
  KeyRounded,
  StorefrontRounded,
  VerifiedUserRounded,
  LaunchRounded,
  QrCode2Rounded,
  SaveRounded,
  // LocationOnRounded,
  ContentCopyRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const initialMerchants = [
  {
    id: "MER-001",
    name: "Shree Krishna Tea Stall",
    owner: "Jaymin Dattani",
    email: "krishna@example.com",
    category: "Food & Beverage",
    location: "Rajkot, Gujarat",
    plan: "Premium",
    status: "Active",
    verification: "Verified",
    joined: "20 Oct 2026",
    slug: "shree-krishna-tea",
    phone: "",
  },
  {
    id: "MER-002",
    name: "Urban Bites Cafe",
    owner: "Aarav Patel",
    email: "urbanbites@example.com",
    category: "Cafe",
    location: "Ahmedabad, Gujarat",
    plan: "Basic",
    status: "Active",
    verification: "Pending",
    joined: "24 Oct 2026",
    slug: "urban-bites-cafe",
    phone: "",
  },
  {
    id: "MER-003",
    name: "The Daily Brew",
    owner: "Riya Shah",
    email: "dailybrew@example.com",
    category: "Cafe",
    location: "Surat, Gujarat",
    plan: "Free",
    status: "Suspended",
    verification: "Verified",
    joined: "25 Oct 2026",
    slug: "the-daily-brew",
    phone: "",
  },
  {
    id: "MER-004",
    name: "Spice Route Kitchen",
    owner: "Dev Mehta",
    email: "spiceroute@example.com",
    category: "Restaurant",
    location: "Vadodara, Gujarat",
    plan: "Premium",
    status: "Active",
    verification: "Pending",
    joined: "27 Oct 2026",
    slug: "spice-route-kitchen",
    phone: "",
  },
  {
    id: "MER-005",
    name: "Green Leaf Snacks",
    owner: "Neha Joshi",
    email: "greenleaf@example.com",
    category: "Quick Service",
    location: "Rajkot, Gujarat",
    plan: "Basic",
    status: "Inactive",
    verification: "Verified",
    joined: "28 Oct 2026",
    slug: "green-leaf-snacks",
    phone: "",
  },
];

const colors = {
  ink: "#29231E",
  muted: "#887767",
  border: "#E9DCCF",
  gold: "#E6A23C",
  cream: "#F8F3ED",
};

const subscriptionPlans = [
  { value: "Free", label: "FREE" },
  { value: "Starter", label: "STARTER" },
  { value: "Growth", label: "GROWTH" },
  { value: "Pro", label: "PRO" },
  { value: "Basic", label: "BASIC" },
  { value: "Premium", label: "PREMIUM" },
];

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function getStorefrontUrl(merchant) {
  const slug = merchant.slug || slugify(merchant.name);

  // Change this route if your customer storefront uses another URL pattern.
  return `https://qrtoken.in/${slug}`;
}

function StatusChip({ label }) {
  const styles = {
    Active: { bg: "#E4F4EC", color: "#18794E" },
    Inactive: { bg: "#F2EEE8", color: "#786B5C" },
    Suspended: { bg: "#FCE8E6", color: "#B93832" },
    Verified: { bg: "#E4F4EC", color: "#18794E" },
    Pending: { bg: "#FFF1D6", color: "#9A6509" },
    Free: { bg: "#F2EEE8", color: "#786B5C" },
    Basic: { bg: "#EAF0FA", color: "#42649A" },
    Starter: { bg: "#EAF0FA", color: "#42649A" },
    Growth: { bg: "#E4F4EC", color: "#18794E" },
    Pro: { bg: "#FFF1D6", color: "#9A6509" },
    Premium: { bg: "#FFF1D6", color: "#9A6509" },
  };

  const style = styles[label] || styles.Inactive;

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 23,
        bgcolor: style.bg,
        color: style.color,
        fontSize: 10.5,
        fontWeight: 700,
        borderRadius: "7px",
      }}
    />
  );
}

function SummaryCard({ label, value, icon: Icon, color, bg }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.6,
        minWidth: 0,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.1 }}>
        <Box
          sx={{
            width: 35,
            height: 35,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: "10px",
            bgcolor: bg,
            color,
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 11, color: colors.muted }}>
            {label}
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 22, fontWeight: 800 }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "11px",
    bgcolor: "#FFFFFF",
    fontSize: 13,
    "& fieldset": { borderColor: colors.border },
    "&:hover fieldset": { borderColor: "#C9B39D" },
    "&.Mui-focused fieldset": { borderColor: "#8A6548" },
  },
  "& .MuiInputLabel-root": {
    color: "#65584C",
    fontSize: 13,
  },
};

function FormField({ label, required = false, ...props }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="label"
        sx={{
          display: "block",
          mb: 0.8,
          fontSize: 12,
          fontWeight: 600,
          color: "#493D32",
        }}
      >
        {label}
        {required && (
          <Box component="span" sx={{ color: "#C23B35" }}>
            {" "}*
          </Box>
        )}
      </Typography>

      <TextField
        {...props}
        fullWidth
        size="small"
        required={required}
        sx={fieldSx}
      />
    </Box>
  );
}

function SectionCard({ icon: Icon, title, children, accent = false }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.8, md: 2.5 },
        border: `1px solid ${colors.border}`,
        borderRadius: "13px",
        bgcolor: "#FFFFFF",
        minWidth: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Icon
          sx={{
            fontSize: 21,
            color: accent ? "#C47B1C" : "#765239",
          }}
        />
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 750,
            color: accent ? "#C47B1C" : colors.ink,
          }}
        >
          {title}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2.5, borderColor: "#EFE5DB" }} />

      {children}
    </Paper>
  );
}

function MerchantOnboardingForm({ merchants, onCancel, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    city: "",
    phone: "",
    plan: "Free",
    email: "",
    password: "",
  });

  const [slugEdited, setSlugEdited] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "name" && !slugEdited) {
        next.slug = slugify(value);
      }

      return next;
    });

    setError("");
  };

  const normalizedSlug = slugify(form.slug);

  const slugExists = merchants.some(
    (merchant) =>
      slugify(merchant.slug || merchant.name) === normalizedSlug
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !normalizedSlug ||
      !form.city.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (slugExists) {
      setError("This storefront URL is already in use. Choose another slug.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    const nextNumber =
      Math.max(
        0,
        ...merchants.map((merchant) =>
          Number(merchant.id.replace("MER-", "")) || 0
        )
      ) + 1;

    onCreate({
      id: `MER-${String(nextNumber).padStart(3, "0")}`,
      name: form.name.trim(),
      owner: "New merchant",
      email: form.email.trim(),
      category: "Food & Beverage",
      location: form.city.trim(),
      plan: form.plan,
      status: "Active",
      verification: "Pending",
      joined: new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
      slug: normalizedSlug,
      phone: form.phone.trim(),
    });
  };

  const storefrontUrl = `https://qrtoken.in/${normalizedSlug || "your-store"}`;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ color: colors.ink }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1.5,
          mb: 2.5,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 21, md: 25 },
              fontWeight: 800,
              letterSpacing: "-0.4px",
            }}
          >
            Onboard New Merchant
          </Typography>
          <Typography sx={{ mt: 0.4, color: colors.muted, fontSize: 13 }}>
            Register a new store outlet and configure its initial owner account.
          </Typography>
        </Box>

        <Button
          type="button"
          variant="outlined"
          startIcon={<CloseRounded />}
          onClick={onCancel}
          sx={{
            borderColor: colors.border,
            color: colors.ink,
            borderRadius: "10px",
            px: 1.6,
            whiteSpace: "nowrap",
          }}
        >
          Cancel
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.15fr) minmax(0, 0.95fr)",
          },
          alignItems: "start",
          gap: 2.5,
        }}
      >
        <SectionCard icon={StorefrontRounded} title="Outlet Specifications">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <FormField
              label="Store / Outlet Name"
              required
              placeholder="e.g. Shree Krishna Tea Stall"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              autoComplete="organization"
            />

            <FormField
              label="Unique URL Path (Slug)"
              required
              placeholder="e.g. shree-krishna-tea"
              value={form.slug}
              onChange={(event) => {
                setSlugEdited(true);
                updateField("slug", event.target.value);
              }}
              helperText={
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    mt: 0.4,
                    overflowWrap: "anywhere",
                    color: colors.muted,
                    fontSize: 11,
                  }}
                >
                  Customer link:{" "}
                  <Box component="strong" sx={{ color: "#765239" }}>
                    {storefrontUrl}
                  </Box>
                </Box>
              }
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.8,
              }}
            >
              <FormField
                label="City Name"
                required
                placeholder="e.g. Rajkot"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
              />

              <FormField
                label="Contact Phone"
                required
                placeholder="e.g. +91 98250 11234"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                slotProps={{ htmlInput: { inputMode: "tel" } }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  mb: 0.8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#493D32",
                }}
              >
                Subscription Tier Plan
              </Typography>

              <Select
                fullWidth
                size="small"
                value={form.plan}
                onChange={(event) => updateField("plan", event.target.value)}
                sx={{
                  borderRadius: "11px",
                  bgcolor: "#FFFFFF",
                  fontSize: 13,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.border,
                  },
                }}
              >
                {subscriptionPlans.map((plan) => (
                  <MenuItem
                    key={plan.value}
                    value={plan.value}
                    sx={{ fontSize: 13 }}
                  >
                    {plan.label} PLAN
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </SectionCard>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <SectionCard icon={KeyRounded} title="Owner Login Account" accent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <FormField
                label="Login Email"
                required
                type="email"
                placeholder="owner@example.com"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
              />

              <FormField
                label="Login Password"
                required
                type="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                autoComplete="new-password"
              />
            </Box>
          </SectionCard>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.8, md: 2.5 },
              border: `1px dashed ${colors.border}`,
              borderRadius: "13px",
              bgcolor: "#FBF8F3",
            }}
          >
            <Typography
              sx={{ color: "#65584C", fontSize: 13, lineHeight: 1.8 }}
            >
              Onboarding preview: the merchant will be added to the local
              merchant list with an active status and pending verification.
              Subscription assignment and account creation are demo-only.
            </Typography>

            {error && (
              <Typography
                role="alert"
                sx={{
                  mt: 1.2,
                  color: "#B93832",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<CheckCircleRounded />}
              sx={{
                mt: 2,
                py: 1.25,
                borderRadius: "10px",
                bgcolor: "#292621",
                color: "#FFFFFF",
                fontSize: 12.5,
                fontWeight: 700,
                boxShadow: "0 5px 12px rgba(41,38,33,0.12)",
                "&:hover": { bgcolor: "#40382D" },
              }}
            >
              Complete Onboarding & Activate Store
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState(initialMerchants);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [planDraft, setPlanDraft] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredMerchants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return merchants.filter((merchant) => {
      const matchesSearch =
        !query ||
        [
          merchant.name,
          merchant.owner,
          merchant.email,
          merchant.id,
          merchant.location,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || merchant.status === statusFilter;

      const matchesVerification =
        verificationFilter === "All" ||
        merchant.verification === verificationFilter;

      return matchesSearch && matchesStatus && matchesVerification;
    });
  }, [merchants, search, statusFilter, verificationFilter]);

  const activeCount = merchants.filter(
    (merchant) => merchant.status === "Active"
  ).length;

  const pendingCount = merchants.filter(
    (merchant) => merchant.verification === "Pending"
  ).length;

  const openMerchantDetails = (merchant) => {
    setSelectedMerchant(merchant);
    setPlanDraft(merchant.plan);
    setCopiedLink(false);
  };

  const createMerchant = (merchant) => {
    setMerchants((current) => [...current, merchant]);
    setShowOnboarding(false);
    setSelectedMerchant(null);
    setSearch("");
    setStatusFilter("All");
    setVerificationFilter("All");
  };

  const saveMerchantPlan = () => {
    if (!selectedMerchant || !planDraft) return;

    setMerchants((current) =>
      current.map((merchant) =>
        merchant.id === selectedMerchant.id
          ? { ...merchant, plan: planDraft }
          : merchant
      )
    );

    setSelectedMerchant((current) =>
      current ? { ...current, plan: planDraft } : current
    );
  };

  const toggleStatus = (id) => {
    setMerchants((current) =>
      current.map((merchant) =>
        merchant.id === id
          ? {
              ...merchant,
              status: merchant.status === "Active" ? "Suspended" : "Active",
            }
          : merchant
      )
    );

    setSelectedMerchant((current) =>
      current?.id === id
        ? {
            ...current,
            status: current.status === "Active" ? "Suspended" : "Active",
          }
        : current
    );
  };

  const verifyMerchant = (id) => {
    setMerchants((current) =>
      current.map((merchant) =>
        merchant.id === id
          ? { ...merchant, verification: "Verified" }
          : merchant
      )
    );

    setSelectedMerchant((current) =>
      current?.id === id
        ? { ...current, verification: "Verified" }
        : current
    );
  };

  const storefrontUrl = selectedMerchant
    ? getStorefrontUrl(selectedMerchant)
    : "";

  const qrImageUrl = selectedMerchant
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
        storefrontUrl
      )}`
    : "";

  const copyStorefrontLink = async () => {
    try {
      await navigator.clipboard.writeText(storefrontUrl);
      setCopiedLink(true);
    } catch {
      window.prompt("Copy the storefront URL:", storefrontUrl);
    }
  };

  return (
    <Box sx={{ color: colors.ink, minWidth: 0 }}>
      {showOnboarding ? (
        <MerchantOnboardingForm
          merchants={merchants}
          onCancel={() => setShowOnboarding(false)}
          onCreate={createMerchant}
        />
      ) : (
        <>
          

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 1.2,
              mb: 1.7,
            }}
          >
            <SummaryCard
              label="Total merchants"
              value={merchants.length}
              icon={StorefrontRounded}
              color="#765239"
              bg="#F4E8DC"
            />
            <SummaryCard
              label="Active merchants"
              value={activeCount}
              icon={CheckCircleRounded}
              color="#18794E"
              bg="#E4F4EC"
            />
            <SummaryCard
              label="Pending verification"
              value={pendingCount}
              icon={VerifiedUserRounded}
              color="#B17A0B"
              bg="#FFF1D4"
            />
            <SummaryCard
              label="Business categories"
              value={new Set(merchants.map((merchant) => merchant.category)).size}
              icon={BusinessRounded}
              color="#42649A"
              bg="#EAF0FA"
            />
          </Box>

          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${colors.border}`,
              borderRadius: "13px",
              bgcolor: "#FFFFFF",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: { xs: "stretch", md: "center" },
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                gap: 1.1,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
                  Registered merchants
                </Typography>
                <Typography sx={{ mt: 0.25, fontSize: 11, color: colors.muted }}>
                  {filteredMerchants.length} of {merchants.length} merchants shown
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.8,
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search merchants..."
                  sx={{
                    width: { xs: "100%", sm: 210 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "9px",
                      fontSize: 12,
                      bgcolor: "#FCFAF7",
                      height: 36,
                    },
                  }}
                />

                <Select
                  size="small"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  sx={{
                    height: 36,
                    minWidth: 120,
                    borderRadius: "9px",
                    fontSize: 12,
                    bgcolor: "#FCFAF7",
                  }}
                >
                  {["All", "Active", "Inactive", "Suspended"].map((value) => (
                    <MenuItem key={value} value={value} sx={{ fontSize: 12 }}>
                      {value === "All" ? "All statuses" : value}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  size="small"
                  value={verificationFilter}
                  onChange={(event) => setVerificationFilter(event.target.value)}
                  sx={{
                    height: 36,
                    minWidth: 140,
                    borderRadius: "9px",
                    fontSize: 12,
                    bgcolor: "#FCFAF7",
                  }}
                >
                  {["All", "Verified", "Pending"].map((value) => (
                    <MenuItem key={value} value={value} sx={{ fontSize: 12 }}>
                      {value === "All" ? "All verification" : value}
                    </MenuItem>
                  ))}
                </Select>
                <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => setShowOnboarding(true)}
              sx={{
                bgcolor: "#292621",
                color: "#FFFFFF",
                borderRadius: "9px",
                px: 1.7,
                py: 0.9,
                fontSize: 12,
                "&:hover": { bgcolor: "#40382D" },
              }}
            >
              Add merchant
            </Button>
              </Box>
            </Box>

            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Box sx={{ minWidth: 800 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(220px, 1.7fr) minmax(130px, 1fr) 105px 105px 100px 52px",
                    gap: 1,
                    px: 1.8,
                    py: 1.1,
                    bgcolor: "#F8F4EF",
                    borderTop: `1px solid ${colors.border}`,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  {["Merchant", "Plan", "Status", "Verification", "Joined", "View"].map(
                    (heading) => (
                      <Typography
                        key={heading}
                        sx={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          color: colors.muted,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {heading}
                      </Typography>
                    )
                  )}
                </Box>

                {filteredMerchants.length === 0 ? (
                  <Box sx={{ py: 6, textAlign: "center" }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      No merchants found
                    </Typography>
                    <Typography sx={{ mt: 0.4, fontSize: 11, color: colors.muted }}>
                      Try changing your search or filters.
                    </Typography>
                  </Box>
                ) : (
                  filteredMerchants.map((merchant, index) => (
                    <Box
                      key={merchant.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "minmax(220px, 1.7fr) minmax(130px, 1fr) 105px 105px 100px 52px",
                        gap: 1,
                        alignItems: "center",
                        px: 1.8,
                        py: 1.25,
                        borderBottom:
                          index === filteredMerchants.length - 1
                            ? 0
                            : "1px solid #F0E7DE",
                        "&:hover": { bgcolor: "#FCFAF7" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: "#F4E8DC",
                            color: "#765239",
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          {merchant.name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 750,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {merchant.name}
                          </Typography>
                          <Typography
                            sx={{
                              mt: 0.25,
                              fontSize: 10.5,
                              color: colors.muted,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {merchant.owner} · {merchant.id}
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <StatusChip label={merchant.plan} />
                        <Typography sx={{ mt: 0.35, fontSize: 10, color: colors.muted }}>
                          {merchant.category}
                        </Typography>
                      </Box>

                      <StatusChip label={merchant.status} />
                      <StatusChip label={merchant.verification} />

                      <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
                        {merchant.joined}
                      </Typography>

                      <Button
                        size="small"
                        onClick={() => openMerchantDetails(merchant)}
                        sx={{
                          minWidth: 0,
                          px: 0.5,
                          color: colors.muted,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  ))
                )}
              </Box>
            </Box>

            <Box
              sx={{
                px: 1.8,
                py: 1.1,
                borderTop: `1px solid ${colors.border}`,
                bgcolor: "#FCFAF7",
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
                Demo data · Frontend preview only
              </Typography>
              <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
                Showing {filteredMerchants.length} records
              </Typography>
            </Box>
          </Paper>

          <Dialog
            open={Boolean(selectedMerchant)}
            onClose={() => setSelectedMerchant(null)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                borderRadius: "15px",
                border: `1px solid ${colors.border}`,
              },
            }}
          >
            {selectedMerchant && (
              <>
                <DialogTitle
                  sx={{
                    px: 2.2,
                    py: 1.8,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  Merchant details
                  <Box sx={{ flex: 1 }} />
                  <IconButton
                    size="small"
                    onClick={() => setSelectedMerchant(null)}
                    aria-label="Close merchant details"
                  >
                    <CloseRounded />
                  </IconButton>
                </DialogTitle>

                <DialogContent
                  dividers
                  sx={{
                    p: 2.2,
                    maxHeight: "75vh",
                    overflowY: "auto",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <Avatar
                        sx={{
                          width: 52,
                          height: 52,
                          bgcolor: "#F4E8DC",
                          color: "#765239",
                          fontWeight: 800,
                          fontSize: 20,
                        }}
                      >
                        {selectedMerchant.name.slice(0, 1)}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 17, fontWeight: 800 }}>
                          {selectedMerchant.name}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: colors.muted }}>
                          {selectedMerchant.id}
                        </Typography>
                      </Box>
                    </Box>

                    {[
                      ["Owner", selectedMerchant.owner],
                      ["Email", selectedMerchant.email],
                      ["Category", selectedMerchant.category],
                      ["Location", selectedMerchant.location],
                      ["Phone", selectedMerchant.phone || "Not provided"],
                      ["Joined", selectedMerchant.joined],
                    ].map(([label, value]) => (
                      <Box
                        key={label}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                          borderBottom: "1px solid #F0E7DE",
                          pb: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: 12, color: colors.muted }}>
                          {label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 650,
                            textAlign: "right",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <StatusChip label={selectedMerchant.status} />
                      <StatusChip label={selectedMerchant.verification} />
                      <StatusChip label={selectedMerchant.plan} />
                    </Box>

                    <Divider sx={{ borderColor: "#EFE5DB" }} />

                    {/* Change subscription plan */}
                    <Box>
                      <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 800 }}>
                        Assign subscription plan
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.8,
                          mb: 1.2,
                        }}
                      >
                        {subscriptionPlans.slice(0, 4).map((plan) => (
                          <Button
                            key={plan.value}
                            onClick={() => setPlanDraft(plan.value)}
                            variant={planDraft === plan.value ? "contained" : "outlined"}
                            sx={{
                              minWidth: 0,
                              px: 1.6,
                              py: 0.65,
                              borderRadius: "22px",
                              fontSize: 11.5,
                              fontWeight: 750,
                              borderColor: colors.border,
                              bgcolor:
                                planDraft === plan.value ? "#292621" : "#FFFFFF",
                              color:
                                planDraft === plan.value ? "#FFFFFF" : "#65584C",
                              "&:hover": {
                                bgcolor:
                                  planDraft === plan.value ? "#40382D" : "#FBF8F3",
                                borderColor: "#C9B39D",
                              },
                            }}
                          >
                            {plan.label}
                          </Button>
                        ))}
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Select
                          size="small"
                          value={planDraft}
                          onChange={(event) => setPlanDraft(event.target.value)}
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            borderRadius: "9px",
                            fontSize: 12,
                          }}
                        >
                          {subscriptionPlans.map((plan) => (
                            <MenuItem key={plan.value} value={plan.value}>
                              {plan.label} PLAN
                            </MenuItem>
                          ))}
                        </Select>

                        <Button
                          variant="contained"
                          startIcon={<SaveRounded />}
                          disabled={planDraft === selectedMerchant.plan}
                          onClick={saveMerchantPlan}
                          sx={{
                            flexShrink: 0,
                            bgcolor: "#292621",
                            borderRadius: "9px",
                            fontSize: 12,
                            "&:hover": { bgcolor: "#40382D" },
                          }}
                        >
                          Save
                        </Button>
                      </Box>

                      <Typography
                        sx={{ mt: 0.8, fontSize: 10.5, color: colors.muted }}
                      >
                        Demo only: the change is stored in this page's local state.
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: "#EFE5DB" }} />

                    {/* Storefront actions */}
                    <Box>
                      <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 800 }}>
                        Storefront & QR code
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<LaunchRounded />}
                          onClick={() =>
                            window.open(
                              storefrontUrl,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                          sx={{
                            bgcolor: "#176F5C",
                            color: "#FFFFFF",
                            borderRadius: "9px",
                            fontSize: 12,
                            "&:hover": { bgcolor: "#125A4B" },
                          }}
                        >
                          Open storefront
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<ContentCopyRounded />}
                          onClick={copyStorefrontLink}
                          sx={{
                            borderColor: colors.border,
                            color: colors.ink,
                            borderRadius: "9px",
                            fontSize: 12,
                          }}
                        >
                          {copiedLink ? "Link copied" : "Copy store link"}
                        </Button>
                      </Box>

                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1.5,
                          border: `1px solid ${colors.border}`,
                          borderRadius: "12px",
                          bgcolor: "#FCFAF7",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.7,
                            alignSelf: "flex-start",
                          }}
                        >
                          <QrCode2Rounded sx={{ color: "#765239" }} />
                          <Typography sx={{ fontSize: 12, fontWeight: 750 }}>
                            Storefront QR code
                          </Typography>
                        </Box>

                        <Box
                          component="img"
                          src={qrImageUrl}
                          alt={`QR code for ${selectedMerchant.name} storefront`}
                          sx={{
                            display: "block",
                            width: 190,
                            height: 190,
                            maxWidth: "100%",
                            objectFit: "contain",
                            bgcolor: "#FFFFFF",
                            border: `1px solid ${colors.border}`,
                            borderRadius: "10px",
                            p: 1,
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 10.5,
                            color: colors.muted,
                            textAlign: "center",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {storefrontUrl}
                        </Typography>

                        <Button
                          component="a"
                          href={qrImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<QrCode2Rounded />}
                          variant="outlined"
                          sx={{
                            borderColor: colors.border,
                            color: colors.ink,
                            borderRadius: "9px",
                            fontSize: 12,
                          }}
                        >
                          Open / download QR
                        </Button>

                        <Typography
                          sx={{
                            fontSize: 10,
                            color: colors.muted,
                            textAlign: "center",
                          }}
                        >
                          QR image is generated by an external service.
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ borderColor: "#EFE5DB" }} />

                    {/* Existing merchant status controls */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => toggleStatus(selectedMerchant.id)}
                        sx={{
                          borderColor: colors.border,
                          color:
                            selectedMerchant.status === "Active"
                              ? "#B93832"
                              : "#18794E",
                          borderRadius: "9px",
                          fontSize: 12,
                        }}
                      >
                        {selectedMerchant.status === "Active"
                          ? "Suspend merchant (demo)"
                          : "Activate merchant (demo)"}
                      </Button>

                      {selectedMerchant.verification === "Pending" && (
                        <Button
                          variant="contained"
                          onClick={() => verifyMerchant(selectedMerchant.id)}
                          sx={{
                            bgcolor: "#292621",
                            borderRadius: "9px",
                            fontSize: 12,
                            "&:hover": { bgcolor: "#40382D" },
                          }}
                        >
                          Mark verified (demo)
                        </Button>
                      )}
                    </Box>

                    <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
                      Demo actions update local page state only. No API requests
                      are made.
                    </Typography>
                  </Box>
                </DialogContent>
              </>
            )}
          </Dialog>
        </>
      )}
    </Box>
  );
}
