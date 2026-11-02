
import { useMemo, useState } from "react";

import {
  CheckCircleRounded,
  CloseRounded,
  DescriptionRounded,
  SearchRounded,
  ShieldRounded,
  VisibilityRounded,
  HourglassTopRounded,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const colors = {
  ink: "#29231E",
  muted: "#887767",
  border: "#E9DCCF",
};

const initialRequests = [
  {
    id: "VER-001",
    merchantId: "MER-002",
    merchant: "Urban Bites Cafe",
    owner: "Aarav Patel",
    email: "urbanbites@example.com",
    category: "Cafe",
    location: "Ahmedabad, Gujarat",
    phone: "+91 98765 43210",
    documents: ["Business registration", "Identity proof"],
    submitted: "24 Oct 2026",
    status: "Pending",
    note: "",
  },
  {
    id: "VER-002",
    merchantId: "MER-004",
    merchant: "Spice Route Kitchen",
    owner: "Dev Mehta",
    email: "spiceroute@example.com",
    category: "Restaurant",
    location: "Vadodara, Gujarat",
    phone: "+91 98765 12345",
    documents: [
      "Business registration",
      "Identity proof",
      "Address proof",
    ],
    submitted: "27 Oct 2026",
    status: "Pending",
    note: "",
  },
  {
    id: "VER-003",
    merchantId: "MER-001",
    merchant: "Shree Krishna Tea Stall",
    owner: "Jaymin Dattani",
    email: "krishna@example.com",
    category: "Food & Beverage",
    location: "Rajkot, Gujarat",
    phone: "+91 98250 11234",
    documents: ["Business registration", "Identity proof"],
    submitted: "20 Oct 2026",
    status: "Verified",
    note: "Documents approved.",
  },
  {
    id: "VER-004",
    merchantId: "MER-005",
    merchant: "Green Leaf Snacks",
    owner: "Neha Joshi",
    email: "greenleaf@example.com",
    category: "Quick Service",
    location: "Rajkot, Gujarat",
    phone: "+91 98765 56789",
    documents: ["Identity proof", "Address proof"],
    submitted: "28 Oct 2026",
    status: "Verified",
    note: "Documents approved.",
  },
];

function StatusChip({ status }) {
  const styles = {
    Pending: { bg: "#FFF1D6", color: "#9A6509" },
    Verified: { bg: "#E4F4EC", color: "#18794E" },
    Rejected: { bg: "#FCE8E6", color: "#B93832" },
  };

  const style = styles[status] || styles.Pending;

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        height: 25,
        bgcolor: style.bg,
        color: style.color,
        fontSize: 11,
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
        p: 1.7,
        minWidth: 0,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: "10px",
            bgcolor: bg,
            color,
          }}
        >
          <Icon sx={{ fontSize: 21 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 11, color: colors.muted }}>
            {label}
          </Typography>

          <Typography sx={{ mt: 0.25, fontSize: 23, fontWeight: 800 }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function DetailRow({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 2,
        py: 1.25,
        borderBottom: "1px solid #F0E7DE",
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
          maxWidth: "65%",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
}

export default function VerificationPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionError, setActionError] = useState("");

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        [
          request.merchant,
          request.owner,
          request.email,
          request.merchantId,
          request.id,
          request.location,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const verifiedCount = requests.filter(
    (request) => request.status === "Verified"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "Rejected"
  ).length;

  const openReview = (request) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setActionError("");
  };

  const updateRequest = (status) => {
    if (!selectedRequest) return;

    if (status === "Rejected" && !rejectionReason.trim()) {
      setActionError(
        "Please enter a reason before rejecting this request."
      );
      return;
    }

    const updatedRequest = {
      ...selectedRequest,
      status,
      note:
        status === "Verified"
          ? "Documents approved."
          : rejectionReason.trim(),
    };

    setRequests((current) =>
      current.map((request) =>
        request.id === selectedRequest.id ? updatedRequest : request
      )
    );

    setSelectedRequest(null);
    setRejectionReason("");
    setActionError("");
  };

  return (
    <Box sx={{ minWidth: 0, color: colors.ink }}>
      {/* Summary cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        <SummaryCard
          label="Total requests"
          value={requests.length}
          icon={DescriptionRounded}
          color="#765239"
          bg="#F4E8DC"
        />

        <SummaryCard
          label="Pending review"
          value={pendingCount}
          icon={HourglassTopRounded}
          color="#B17A0B"
          bg="#FFF1D4"
        />

        <SummaryCard
          label="Verified merchants"
          value={verifiedCount}
          icon={CheckCircleRounded}
          color="#18794E"
          bg="#E4F4EC"
        />

        <SummaryCard
          label="Rejected requests"
          value={rejectedCount}
          icon={ShieldRounded}
          color="#B93832"
          bg="#FCE8E6"
        />
      </Box>

      {/* Verification table */}
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
            p: 1.7,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 1.5,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 800 }}>
              Merchant verification
            </Typography>

            <Typography sx={{ mt: 0.3, fontSize: 11, color: colors.muted }}>
              {filteredRequests.length} of {requests.length} requests shown
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <TextField
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search merchants..."
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchRounded
                      sx={{ color: colors.muted, mr: 1, fontSize: 19 }}
                    />
                  ),
                },
              }}
              sx={{
                width: { xs: "100%", sm: 220 },
                "& .MuiOutlinedInput-root": {
                  height: 38,
                  borderRadius: "9px",
                  bgcolor: "#FCFAF7",
                  fontSize: 12,
                },
              }}
            />

            <Select
              size="small"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              sx={{
                height: 38,
                minWidth: 145,
                borderRadius: "9px",
                bgcolor: "#FCFAF7",
                fontSize: 12,
              }}
            >
              {["All", "Pending", "Verified", "Rejected"].map((status) => (
                <MenuItem key={status} value={status} sx={{ fontSize: 12 }}>
                  {status === "All" ? "All statuses" : status}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: 850 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(220px, 1.6fr) minmax(180px, 1.2fr) 115px 115px 95px",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1.2,
                bgcolor: "#F8F4EF",
                borderTop: `1px solid ${colors.border}`,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              {["Merchant", "Documents", "Status", "Submitted", "Action"].map(
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

            {filteredRequests.length === 0 ? (
              <Box sx={{ py: 7, textAlign: "center" }}>
                <DescriptionRounded
                  sx={{ fontSize: 30, color: "#B7A594" }}
                />

                <Typography sx={{ mt: 1, fontSize: 13, fontWeight: 750 }}>
                  No verification requests found
                </Typography>

                <Typography sx={{ mt: 0.5, fontSize: 11, color: colors.muted }}>
                  Try another search term or status filter.
                </Typography>
              </Box>
            ) : (
              filteredRequests.map((request, index) => (
                <Box
                  key={request.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(220px, 1.6fr) minmax(180px, 1.2fr) 115px 115px 95px",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.5,
                    borderBottom:
                      index === filteredRequests.length - 1
                        ? 0
                        : "1px solid #F0E7DE",
                    "&:hover": { bgcolor: "#FCFAF7" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "#F4E8DC",
                        color: "#765239",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {request.merchant
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
                        {request.merchant}
                      </Typography>

                      <Typography
                        sx={{ mt: 0.25, fontSize: 10.5, color: colors.muted }}
                      >
                        {request.owner} · {request.merchantId}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 650 }}>
                      {request.documents.length} documents
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.3,
                        fontSize: 10,
                        color: colors.muted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {request.documents.join(", ")}
                    </Typography>
                  </Box>

                  <StatusChip status={request.status} />

                  <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
                    {request.submitted}
                  </Typography>

                  <Button
                    size="small"
                    startIcon={<VisibilityRounded sx={{ fontSize: 16 }} />}
                    onClick={() => openReview(request)}
                    sx={{
                      minWidth: 0,
                      justifyContent: "flex-start",
                      color: "#765239",
                      fontSize: 11,
                      fontWeight: 750,
                      textTransform: "none",
                    }}
                  >
                    Review
                  </Button>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1.2,
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            bgcolor: "#FCFAF7",
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
            Demo data · Frontend preview only
          </Typography>

          <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
            Showing {filteredRequests.length} records
          </Typography>
        </Box>
      </Paper>

      {/* Review dialog */}
      <Dialog
        open={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            border: `1px solid ${colors.border}`,
          },
        }}
      >
        {selectedRequest && (
          <>
            <DialogTitle
              sx={{
                px: 2.5,
                py: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: 17,
                fontWeight: 800,
              }}
            >
              Review verification

              <Box sx={{ flex: 1 }} />

              <IconButton
                size="small"
                onClick={() => setSelectedRequest(null)}
                aria-label="Close"
              >
                <CloseRounded />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.3,
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#F4E8DC",
                    color: "#765239",
                    fontWeight: 800,
                  }}
                >
                  {selectedRequest.merchant.slice(0, 1)}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 800 }}>
                    {selectedRequest.merchant}
                  </Typography>

                  <Typography sx={{ fontSize: 11, color: colors.muted }}>
                    {selectedRequest.merchantId} · {selectedRequest.id}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }} />

                <StatusChip status={selectedRequest.status} />
              </Box>

              <DetailRow label="Owner" value={selectedRequest.owner} />
              <DetailRow label="Email" value={selectedRequest.email} />
              <DetailRow label="Phone" value={selectedRequest.phone} />
              <DetailRow label="Category" value={selectedRequest.category} />
              <DetailRow label="Location" value={selectedRequest.location} />
              <DetailRow label="Submitted" value={selectedRequest.submitted} />

              <Typography
                sx={{ mt: 2.2, mb: 1, fontSize: 13, fontWeight: 800 }}
              >
                Submitted documents
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {selectedRequest.documents.map((document) => (
                  <Paper
                    key={document}
                    elevation={0}
                    sx={{
                      p: 1.2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "9px",
                    }}
                  >
                    <DescriptionRounded
                      sx={{ color: "#765239", fontSize: 20 }}
                    />

                    <Typography sx={{ flex: 1, fontSize: 12, fontWeight: 600 }}>
                      {document}
                    </Typography>

                    <Chip
                      size="small"
                      label="Listed"
                      sx={{
                        height: 22,
                        fontSize: 10,
                        bgcolor: "#F2EEE8",
                        color: "#786B5C",
                      }}
                    />
                  </Paper>
                ))}
              </Box>

              <Typography sx={{ mt: 1, fontSize: 10.5, color: colors.muted }}>
                Demo document entries only. Actual files are not attached.
              </Typography>

              {selectedRequest.status === "Rejected" && (
                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: "9px",
                    bgcolor: "#FCE8E6",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 11, fontWeight: 800, color: "#B93832" }}
                  >
                    Rejection reason
                  </Typography>

                  <Typography sx={{ mt: 0.5, fontSize: 12, color: "#7E2925" }}>
                    {selectedRequest.note || "No reason supplied."}
                  </Typography>
                </Paper>
              )}

              {selectedRequest.status === "Pending" && (
                <>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={rejectionReason}
                    onChange={(event) => {
                      setRejectionReason(event.target.value);
                      setActionError("");
                    }}
                    placeholder="Reason for rejection (required only when rejecting)"
                    sx={{
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "9px",
                        fontSize: 12,
                      },
                    }}
                  />

                  {actionError && (
                    <Typography
                      role="alert"
                      sx={{ mt: 0.8, color: "#B93832", fontSize: 11 }}
                    >
                      {actionError}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => updateRequest("Rejected")}
                      sx={{
                        borderColor: "#E6B8B4",
                        color: "#B93832",
                        borderRadius: "9px",
                        fontSize: 12,
                        textTransform: "none",
                      }}
                    >
                      Reject request
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<CheckCircleRounded />}
                      onClick={() => updateRequest("Verified")}
                      sx={{
                        bgcolor: "#18794E",
                        borderRadius: "9px",
                        fontSize: 12,
                        textTransform: "none",
                        "&:hover": { bgcolor: "#12633F" },
                      }}
                    >
                      Approve merchant
                    </Button>
                  </Box>
                </>
              )}

              {selectedRequest.status !== "Pending" && (
                <Typography sx={{ mt: 2, fontSize: 10.5, color: colors.muted }}>
                  This request has already been reviewed. Demo actions are stored
                  only in this page's local state.
                </Typography>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
