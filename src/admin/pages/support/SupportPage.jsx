
import { useMemo, useState } from "react";
import {
  CheckCircleRounded,
  CloseRounded,
  HeadsetMicRounded,
  HourglassTopRounded,
  MarkEmailUnreadRounded,
  SearchRounded,
  VisibilityRounded,
//   WarningAmberRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const COLORS = {
  background: "#F8F3ED",
  paper: "#FFFFFF",
  text: "#2D1F18",
  muted: "#887767",
  primary: "#6F4E37",
  gold: "#E6A23C",
  border: "#E9DCCF",
};

const initialTickets = [
  {
    id: "SUP-1001",
    subject: "Unable to access merchant dashboard",
    merchant: "Shree Krishna Tea Stall",
    merchantId: "MER-001",
    email: "merchant001@example.com",
    category: "Account Access",
    priority: "High",
    status: "Open",
    date: "29 Oct 2026",
    description:
      "The merchant reports that they cannot access their dashboard after attempting to sign in.",
    reply: "",
  },
  {
    id: "SUP-1002",
    subject: "QR code is not opening the menu",
    merchant: "Urban Bites Cafe",
    merchantId: "MER-002",
    email: "merchant002@example.com",
    category: "QR Code",
    priority: "High",
    status: "In Progress",
    date: "28 Oct 2026",
    description:
      "Customers are reporting that the QR code does not open the expected menu page.",
    reply: "",
  },
  {
    id: "SUP-1003",
    subject: "Request to upgrade subscription",
    merchant: "The Daily Brew",
    merchantId: "MER-003",
    email: "merchant003@example.com",
    category: "Subscription",
    priority: "Medium",
    status: "Open",
    date: "28 Oct 2026",
    description:
      "The merchant would like information about upgrading from the Free plan to Starter.",
    reply: "",
  },
  {
    id: "SUP-1004",
    subject: "Payment status not updated",
    merchant: "Spice Route Kitchen",
    merchantId: "MER-004",
    email: "merchant004@example.com",
    category: "Payments",
    priority: "High",
    status: "In Progress",
    date: "27 Oct 2026",
    description:
      "A merchant reports that a payment appears completed but the order status has not updated.",
    reply: "",
  },
  {
    id: "SUP-1005",
    subject: "Update business information",
    merchant: "Green Leaf Snacks",
    merchantId: "MER-005",
    email: "merchant005@example.com",
    category: "Account",
    priority: "Low",
    status: "Resolved",
    date: "26 Oct 2026",
    description:
      "The merchant requested help updating the business information displayed on the storefront.",
    reply: "The request has been marked as resolved in this demo.",
  },
  {
    id: "SUP-1006",
    subject: "Menu items are not displaying correctly",
    merchant: "Urban Bites Cafe",
    merchantId: "MER-002",
    email: "merchant002@example.com",
    category: "Menu",
    priority: "Medium",
    status: "Closed",
    date: "25 Oct 2026",
    description:
      "Some menu items were reported as missing from the customer-facing menu.",
    reply: "This demo ticket has been closed.",
  },
];

const statusStyles = {
  Open: { color: "#A86600", bg: "#FFF0D2" },
  "In Progress": { color: "#3563B8", bg: "#E8EFFB" },
  Resolved: { color: "#087F5B", bg: "#E2F3EB" },
  Closed: { color: "#75665B", bg: "#EEE8E2" },
};

const priorityStyles = {
  High: { color: "#C62828", bg: "#FCE7E5" },
  Medium: { color: "#A86600", bg: "#FFF0D2" },
  Low: { color: "#087F5B", bg: "#E2F3EB" },
};

function StatusChip({ status }) {
  const style = statusStyles[status] || statusStyles.Open;

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        height: 27,
        minWidth: 88,
        color: style.color,
        bgcolor: style.bg,
        fontSize: 11.5,
        fontWeight: 700,
        borderRadius: "8px",
      }}
    />
  );
}

function PriorityChip({ priority }) {
  const style = priorityStyles[priority] || priorityStyles.Medium;

  return (
    <Chip
      label={priority}
      size="small"
      sx={{
        height: 25,
        color: style.color,
        bgcolor: style.bg,
        fontSize: 11.5,
        fontWeight: 700,
        borderRadius: "7px",
      }}
    />
  );
}

function SummaryCard({ icon, title, value, caption, iconBg, iconColor }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        p: 2,
        bgcolor: COLORS.paper,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "14px",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.2}>
        <Box
          sx={{
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "11px",
            bgcolor: iconBg,
            color: iconColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Typography sx={{ fontSize: 12.5, color: COLORS.muted, fontWeight: 600 }}>
          {title}
        </Typography>
      </Stack>

      <Typography
        sx={{
          mt: 1.2,
          fontSize: 27,
          lineHeight: 1.2,
          fontWeight: 800,
          color: COLORS.text,
        }}
      >
        {value}
      </Typography>

      <Typography sx={{ mt: 0.5, fontSize: 11.5, color: COLORS.muted }}>
        {caption}
      </Typography>
    </Box>
  );
}

export default function SupportPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState("");

  const counts = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "Open").length,
      progress: tickets.filter((ticket) => ticket.status === "In Progress").length,
      resolved: tickets.filter(
        (ticket) =>
          ticket.status === "Resolved" || ticket.status === "Closed"
      ).length,
    }),
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !query ||
        ticket.id.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.merchant.toLowerCase().includes(query) ||
        ticket.merchantId.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All statuses" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All priorities" ||
        ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const updateTicket = (ticketId, updates) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      )
    );

    setSelectedTicket((current) =>
      current?.id === ticketId ? { ...current, ...updates } : current
    );
  };

  const handleReplySave = () => {
    if (!selectedTicket || !reply.trim()) return;

    updateTicket(selectedTicket.id, {
      reply: reply.trim(),
      status:
        selectedTicket.status === "Open"
          ? "In Progress"
          : selectedTicket.status,
    });

    setReply("");
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      height: 44,
      borderRadius: "10px",
      bgcolor: "#FCFAF8",
      fontSize: 12.5,
      "& fieldset": { borderColor: COLORS.border },
      "&:hover fieldset": { borderColor: "#CDB8A5" },
      "&.Mui-focused fieldset": { borderColor: COLORS.primary },
    },
  };

  return (
    <Box sx={{ minWidth: 0, width: "100%", color: COLORS.text }}>
      {/* Summary */}
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
          icon={<HeadsetMicRounded />}
          title="Total tickets"
          value={counts.total}
          caption="All support requests"
          iconBg="#F5E8DA"
          iconColor={COLORS.primary}
        />
        <SummaryCard
          icon={<MarkEmailUnreadRounded />}
          title="Open tickets"
          value={counts.open}
          caption="Awaiting attention"
          iconBg="#FFF0D2"
          iconColor="#A86600"
        />
        <SummaryCard
          icon={<HourglassTopRounded />}
          title="In progress"
          value={counts.progress}
          caption="Currently being handled"
          iconBg="#E8EFFB"
          iconColor="#3563B8"
        />
        <SummaryCard
          icon={<CheckCircleRounded />}
          title="Resolved / closed"
          value={counts.resolved}
          caption="Completed requests"
          iconBg="#E2F3EB"
          iconColor="#087F5B"
        />
      </Box>

      {/* Tickets table */}
      <Box
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: "15px",
          overflow: "hidden",
          bgcolor: COLORS.paper,
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: { xs: "stretch", lg: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", lg: "row" },
            gap: 1.5,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 800 }}>
              Support tickets
            </Typography>
            <Typography sx={{ mt: 0.4, fontSize: 12, color: COLORS.muted }}>
              {filteredTickets.length} of {tickets.length} tickets shown
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ width: { xs: "100%", lg: "auto" } }}
          >
            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tickets..."
              size="small"
              sx={{ ...inputSx, width: { xs: "100%", sm: 245 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded sx={{ fontSize: 20, color: COLORS.muted }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <FormControl size="small" sx={{ ...inputSx, minWidth: 145 }}>
              <Select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter ticket status"
              >
                <MenuItem value="All statuses">All statuses</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ ...inputSx, minWidth: 145 }}>
              <Select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                aria-label="Filter ticket priority"
              >
                <MenuItem value="All priorities">All priorities</MenuItem>
                <MenuItem value="High">High priority</MenuItem>
                <MenuItem value="Medium">Medium priority</MenuItem>
                <MenuItem value="Low">Low priority</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table
            size="small"
            sx={{
              minWidth: 1000,
              "& .MuiTableCell-root": {
                px: 2,
                borderBottom: "1px solid #F0E5DB",
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#F8F4EF",
                  "& .MuiTableCell-root": {
                    py: 1.5,
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: COLORS.muted,
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <TableCell>TICKET</TableCell>
                <TableCell>MERCHANT</TableCell>
                <TableCell>CATEGORY</TableCell>
                <TableCell>PRIORITY</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>CREATED</TableCell>
                <TableCell align="center">ACTION</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  hover
                  sx={{
                    "&:hover": { bgcolor: "#FCF8F3" },
                    "& .MuiTableCell-root": { py: 1.5, verticalAlign: "middle" },
                  }}
                >
                  <TableCell sx={{ minWidth: 235 }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>
                      {ticket.id}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.4,
                        fontSize: 12,
                        color: COLORS.muted,
                        maxWidth: 260,
                      }}
                    >
                      {ticket.subject}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ minWidth: 190 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: "#F5E8DA",
                          color: COLORS.primary,
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {ticket.merchant
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                          {ticket.merchant}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: COLORS.muted }}>
                          {ticket.merchantId}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
                      {ticket.category}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <PriorityChip priority={ticket.priority} />
                  </TableCell>

                  <TableCell>
                    <StatusChip status={ticket.status} />
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
                      {ticket.date}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setReply("");
                      }}
                      aria-label={`View ${ticket.id}`}
                      sx={{
                        minWidth: 34,
                        width: 34,
                        height: 34,
                        p: 0,
                        color: COLORS.muted,
                        borderRadius: "50%",
                        "&:hover": {
                          bgcolor: "#F5E8DA",
                          color: COLORS.primary,
                        },
                      }}
                    >
                      <VisibilityRounded sx={{ fontSize: 20 }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <HeadsetMicRounded
                      sx={{ fontSize: 36, color: "#B8A28E", mb: 1 }}
                    />
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      No support tickets found
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 12, color: COLORS.muted }}>
                      Try another search term or filter.
                    </Typography>
                    <Button
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All statuses");
                        setPriorityFilter("All priorities");
                      }}
                      sx={{
                        mt: 1,
                        color: COLORS.primary,
                        textTransform: "none",
                      }}
                    >
                      Clear filters
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            px: 2,
            py: 1.3,
            borderTop: `1px solid ${COLORS.border}`,
            bgcolor: "#FFFEFC",
          }}
        >
          <Typography sx={{ fontSize: 11.5, color: COLORS.muted }}>
            Demo support records · Status changes are not yet saved to the server.
          </Typography>
        </Box>
      </Box>

      {/* Ticket details dialog */}
      <Dialog
        open={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "17px" } }}
      >
        {selectedTicket && (
          <>
            <DialogTitle sx={{ pb: 1.5 }}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    bgcolor: "#F5E8DA",
                    color: COLORS.primary,
                  }}
                >
                  <HeadsetMicRounded />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 17, fontWeight: 800 }}>
                    Ticket details
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: COLORS.muted }}>
                    {selectedTicket.id}
                  </Typography>
                </Box>

                <Button
                  onClick={() => setSelectedTicket(null)}
                  sx={{ minWidth: 34, color: COLORS.muted }}
                  aria-label="Close ticket details"
                >
                  <CloseRounded />
                </Button>
              </Stack>
            </DialogTitle>

            <DialogContent>
              <Typography sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}>
                {selectedTicket.subject}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 2 }}
              >
                <StatusChip status={selectedTicket.status} />
                <PriorityChip priority={selectedTicket.priority} />
              </Stack>

              <Box
                sx={{
                  p: 1.8,
                  bgcolor: "#F8F4EF",
                  borderRadius: "12px",
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: 12, color: COLORS.muted, mb: 0.7 }}>
                  Issue description
                </Typography>
                <Typography sx={{ fontSize: 13, lineHeight: 1.7 }}>
                  {selectedTicket.description}
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                {[
                  ["Merchant", selectedTicket.merchant],
                  ["Merchant ID", selectedTicket.merchantId],
                  ["Contact email", selectedTicket.email],
                  ["Category", selectedTicket.category],
                  ["Created", selectedTicket.date],
                ].map(([label, value]) => (
                  <Stack
                    key={label}
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography sx={{ fontSize: 12.5, color: COLORS.muted }}>
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        textAlign: "right",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 2, borderColor: COLORS.border }} />

              <Typography sx={{ fontSize: 13, fontWeight: 800, mb: 1 }}>
                Update status
              </Typography>

              <FormControl fullWidth size="small" sx={{ ...inputSx, mb: 2 }}>
                <Select
                  value={selectedTicket.status}
                  onChange={(event) =>
                    updateTicket(selectedTicket.id, {
                      status: event.target.value,
                    })
                  }
                  aria-label="Update ticket status"
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>

              {selectedTicket.reply && (
                <Box
                  sx={{
                    p: 1.5,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "10px",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 0.5 }}>
                    Latest demo reply
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: COLORS.muted }}>
                    {selectedTicket.reply}
                  </Typography>
                </Box>
              )}

              <Typography sx={{ fontSize: 13, fontWeight: 800, mb: 1 }}>
                Internal response / note
              </Typography>

              <TextField
                multiline
                minRows={3}
                fullWidth
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Write a response or support note..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: 13,
                    bgcolor: "#FCFAF8",
                    "& fieldset": { borderColor: COLORS.border },
                    "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                  },
                }}
              />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
              <Button
                onClick={() => setSelectedTicket(null)}
                sx={{ color: COLORS.muted, textTransform: "none" }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                disabled={!reply.trim()}
                onClick={handleReplySave}
                sx={{
                  textTransform: "none",
                  borderRadius: "9px",
                  bgcolor: COLORS.primary,
                  "&:hover": { bgcolor: "#563A29" },
                }}
              >
                Save note
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
