import { useMemo, useState } from "react";
import {
  AccountBalanceWalletRounded,
  CheckCircleRounded,
  CloseRounded,
  CurrencyRupeeRounded,
  ErrorOutlineRounded,
  ReceiptLongRounded,
  SearchRounded,
  VisibilityRounded,
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
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const initialTransactions = [
  {
    id: "TXN-20261029-001",
    merchant: "Shree Krishna Tea Stall",
    merchantId: "MER-001",
    orderId: "ORD-1024",
    amount: 1250,
    method: "UPI",
    status: "Success",
    date: "29 Oct 2026",
    time: "10:42 AM",
    reference: "UPI-REF-845210",
    fee: 25,
  },
  {
    id: "TXN-20261029-002",
    merchant: "Urban Bites Cafe",
    merchantId: "MER-002",
    orderId: "ORD-1025",
    amount: 850,
    method: "Card",
    status: "Success",
    date: "29 Oct 2026",
    time: "11:05 AM",
    reference: "CARD-REF-845211",
    fee: 17,
  },
  {
    id: "TXN-20261029-003",
    merchant: "The Daily Brew",
    merchantId: "MER-003",
    orderId: "ORD-1026",
    amount: 420,
    method: "UPI",
    status: "Failed",
    date: "29 Oct 2026",
    time: "11:18 AM",
    reference: "UPI-REF-845212",
    fee: 0,
  },
  {
    id: "TXN-20261028-004",
    merchant: "Spice Route Kitchen",
    merchantId: "MER-004",
    orderId: "ORD-1020",
    amount: 2100,
    method: "Net Banking",
    status: "Success",
    date: "28 Oct 2026",
    time: "07:35 PM",
    reference: "NB-REF-845213",
    fee: 42,
  },
  {
    id: "TXN-20261028-005",
    merchant: "Green Leaf Snacks",
    merchantId: "MER-005",
    orderId: "ORD-1021",
    amount: 650,
    method: "Cash",
    status: "Pending",
    date: "28 Oct 2026",
    time: "08:12 PM",
    reference: "CASH-REF-845214",
    fee: 0,
  },
  {
    id: "TXN-20261027-006",
    merchant: "Urban Bites Cafe",
    merchantId: "MER-002",
    orderId: "ORD-1018",
    amount: 980,
    method: "UPI",
    status: "Refunded",
    date: "27 Oct 2026",
    time: "02:26 PM",
    reference: "UPI-REF-845215",
    fee: 0,
  },
  {
    id: "TXN-20261027-007",
    merchant: "Shree Krishna Tea Stall",
    merchantId: "MER-001",
    orderId: "ORD-1017",
    amount: 1750,
    method: "Card",
    status: "Success",
    date: "27 Oct 2026",
    time: "01:15 PM",
    reference: "CARD-REF-845216",
    fee: 35,
  },
  {
    id: "TXN-20261026-008",
    merchant: "Spice Route Kitchen",
    merchantId: "MER-004",
    orderId: "ORD-1012",
    amount: 560,
    method: "UPI",
    status: "Failed",
    date: "26 Oct 2026",
    time: "09:40 AM",
    reference: "UPI-REF-845217",
    fee: 0,
  },
];

const colors = {
  ink: "#29231E",
  muted: "#887767",
  border: "#E9DCCF",
  gold: "#E6A23C",
  cream: "#F8F3ED",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

function StatusChip({ label }) {
  const styles = {
    Success: { bg: "#E4F4EC", color: "#18794E" },
    Failed: { bg: "#FCE8E6", color: "#B93832" },
    Pending: { bg: "#FFF1D6", color: "#9A6509" },
    Refunded: { bg: "#EAF0FA", color: "#42649A" },
  };

  const style = styles[label] || {
    bg: "#F2EEE8",
    color: "#786B5C",
  };

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

function SummaryCard({ label, value, icon: Icon, color, bg, note }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        minWidth: 0,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: "9px",
            bgcolor: bg,
            color,
          }}
        >
          <Icon sx={{ fontSize: 19 }} />
        </Box>

        <Typography
          sx={{
            minWidth: 0,
            flex: 1,
            fontSize: 11,
            lineHeight: 1.4,
            color: colors.muted,
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        sx={{
          mt: 1,
          fontSize: { xs: 19, md: 22 },
          fontWeight: 800,
          lineHeight: 1.25,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>

      <Typography sx={{ mt: 0.4, fontSize: 10.5, color: colors.muted }}>
        {note}
      </Typography>
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
        pb: 1.1,
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
        {value}
      </Typography>
    </Box>
  );
}

export default function TransactionsPage() {
  const [transactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        [
          transaction.id,
          transaction.merchant,
          transaction.merchantId,
          transaction.orderId,
          transaction.reference,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || transaction.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || transaction.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [transactions, search, statusFilter, methodFilter]);

  const successfulTransactions = transactions.filter(
    (transaction) => transaction.status === "Success"
  );

  const totalRevenue = successfulTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const successfulCount = successfulTransactions.length;

  const failedCount = transactions.filter(
    (transaction) => transaction.status === "Failed"
  ).length;

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
          gap: 1.2,
          mb: 1.6,
        }}
      >
        <SummaryCard
          label="Total transactions"
          value={transactions.length}
          note="All recorded transactions"
          icon={ReceiptLongRounded}
          color="#765239"
          bg="#F4E8DC"
        />

        <SummaryCard
          label="Successful revenue"
          value={formatCurrency(totalRevenue)}
          note="Successful demo payments"
          icon={CurrencyRupeeRounded}
          color="#18794E"
          bg="#E4F4EC"
        />

        <SummaryCard
          label="Successful payments"
          value={successfulCount}
          note={`${Math.round(
            (successfulCount / transactions.length) * 100
          )}% of demo transactions`}
          icon={CheckCircleRounded}
          color="#42649A"
          bg="#EAF0FA"
        />

        <SummaryCard
          label="Failed payments"
          value={failedCount}
          note="Require monitoring"
          icon={ErrorOutlineRounded}
          color="#B93832"
          bg="#FCE8E6"
        />
      </Box>

      {/* Transactions table */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${colors.border}`,
          borderRadius: "13px",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Table heading and filters */}
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: { xs: "stretch", lg: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", lg: "row" },
            gap: 1.2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
              Platform transactions
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: 11, color: colors.muted }}>
              {filteredTransactions.length} of {transactions.length} transactions
              shown
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0.8,
            }}
          >
            <TextField
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions..."
              sx={{
                width: { xs: "100%", sm: 210 },
                "& .MuiOutlinedInput-root": {
                  height: 36,
                  borderRadius: "9px",
                  fontSize: 12,
                  bgcolor: "#FCFAF7",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.border,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchRounded
                      sx={{ mr: 0.8, color: colors.muted, fontSize: 19 }}
                    />
                  ),
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
              {["All", "Success", "Pending", "Failed", "Refunded"].map(
                (status) => (
                  <MenuItem
                    key={status}
                    value={status}
                    sx={{ fontSize: 12 }}
                  >
                    {status === "All" ? "All statuses" : status}
                  </MenuItem>
                )
              )}
            </Select>

            <Select
              size="small"
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              sx={{
                height: 36,
                minWidth: 125,
                borderRadius: "9px",
                fontSize: 12,
                bgcolor: "#FCFAF7",
              }}
            >
              {["All", "UPI", "Card", "Net Banking", "Cash"].map((method) => (
                <MenuItem
                  key={method}
                  value={method}
                  sx={{ fontSize: 12 }}
                >
                  {method === "All" ? "All methods" : method}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <Divider sx={{ borderColor: colors.border }} />

        {/* Responsive table */}
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: 900 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(205px, 1.5fr) minmax(145px, 1fr) 100px 110px 105px 95px 42px",
                alignItems: "center",
                gap: 1,
                px: 1.8,
                py: 1.15,
                bgcolor: "#F8F4EF",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              {[
                "Transaction",
                "Merchant",
                "Amount",
                "Method",
                "Status",
                "Date",
                "",
              ].map((heading, index) => (
                <Typography
                  key={`${heading}-${index}`}
                  sx={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: colors.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {heading}
                </Typography>
              ))}
            </Box>

            {filteredTransactions.length === 0 ? (
              <Box sx={{ py: 5, textAlign: "center" }}>
                <SearchRounded sx={{ color: "#B7A594", fontSize: 27 }} />
                <Typography sx={{ mt: 0.8, fontSize: 13, fontWeight: 700 }}>
                  No transactions found
                </Typography>
                <Typography sx={{ mt: 0.3, fontSize: 11, color: colors.muted }}>
                  Try changing your search or filters.
                </Typography>
              </Box>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <Box
                  key={transaction.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(205px, 1.5fr) minmax(145px, 1fr) 100px 110px 105px 95px 42px",
                    alignItems: "center",
                    gap: 1,
                    px: 1.8,
                    py: 1.25,
                    borderBottom:
                      index === filteredTransactions.length - 1
                        ? 0
                        : "1px solid #F0E7DE",
                    "&:hover": { bgcolor: "#FCFAF7" },
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        fontWeight: 750,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction.id}
                    </Typography>
                    <Typography sx={{ mt: 0.25, fontSize: 10, color: colors.muted }}>
                      Order: {transaction.orderId}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, minWidth: 0 }}>
                    <Avatar
                      sx={{
                        width: 29,
                        height: 29,
                        bgcolor: "#F4E8DC",
                        color: "#765239",
                        fontSize: 10,
                        fontWeight: 800,
                      }}
                    >
                      {transaction.merchant
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 650,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {transaction.merchant}
                      </Typography>
                      <Typography sx={{ mt: 0.2, fontSize: 9.5, color: colors.muted }}>
                        {transaction.merchantId}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: 11.5, fontWeight: 750 }}>
                    {formatCurrency(transaction.amount)}
                  </Typography>

                  <Typography sx={{ fontSize: 11, color: "#65584C" }}>
                    {transaction.method}
                  </Typography>

                  <StatusChip label={transaction.status} />

                  <Box>
                    <Typography sx={{ fontSize: 10.5, color: colors.ink }}>
                      {transaction.date}
                    </Typography>
                    <Typography sx={{ mt: 0.2, fontSize: 9.5, color: colors.muted }}>
                      {transaction.time}
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    aria-label={`View ${transaction.id}`}
                    onClick={() => setSelectedTransaction(transaction)}
                    sx={{
                      minWidth: 32,
                      width: 32,
                      height: 32,
                      p: 0,
                      color: colors.muted,
                    }}
                  >
                    <VisibilityRounded sx={{ fontSize: 17 }} />
                  </Button>
                </Box>
              ))
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 1.8,
            py: 1.1,
            borderTop: `1px solid ${colors.border}`,
            bgcolor: "#FCFAF7",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
            Demo data · Frontend preview only
          </Typography>
          <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
            Showing {filteredTransactions.length} records
          </Typography>
        </Box>
      </Paper>

      {/* Transaction details dialog */}
      <Dialog
        open={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "15px",
            border: `1px solid ${colors.border}`,
          },
        }}
      >
        {selectedTransaction && (
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
              Transaction details
              <Box sx={{ flex: 1 }} />
              <Button
                size="small"
                onClick={() => setSelectedTransaction(null)}
                sx={{ minWidth: 0, color: colors.muted }}
                aria-label="Close transaction details"
              >
                <CloseRounded />
              </Button>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 2.2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.6 }}>
                <Box
                  sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    bgcolor: "#FBF8F3",
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "#F4E8DC",
                      color: "#765239",
                    }}
                  >
                    <AccountBalanceWalletRounded />
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 11, color: colors.muted }}>
                      Transaction amount
                    </Typography>
                    <Typography sx={{ mt: 0.2, fontSize: 23, fontWeight: 800 }}>
                      {formatCurrency(selectedTransaction.amount)}
                    </Typography>
                  </Box>

                  <StatusChip label={selectedTransaction.status} />
                </Box>

                <DetailRow label="Transaction ID" value={selectedTransaction.id} />
                <DetailRow label="Order ID" value={selectedTransaction.orderId} />
                <DetailRow label="Merchant" value={selectedTransaction.merchant} />
                <DetailRow label="Merchant ID" value={selectedTransaction.merchantId} />
                <DetailRow label="Payment method" value={selectedTransaction.method} />
                <DetailRow label="Payment reference" value={selectedTransaction.reference} />
                <DetailRow label="Transaction date" value={`${selectedTransaction.date}, ${selectedTransaction.time}`} />
                <DetailRow label="Platform fee (demo)" value={formatCurrency(selectedTransaction.fee)} />

                <Typography sx={{ fontSize: 10.5, color: colors.muted }}>
                  These are sample records for UI preview only. Payment status,
                  amounts, and fees are not retrieved from a payment gateway.
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
