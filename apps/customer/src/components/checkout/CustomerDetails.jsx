import { TextField } from "@mui/material";

function CustomerDetails({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes,
}) {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold text-[#4B2E1F]">
        Customer Details
      </h3>

      {/* Name */}
      <div className="mb-5">
        <TextField
          fullWidth
          label="Full Name"
          placeholder="Enter your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#FFFDFC",

              "& fieldset": {
                borderColor: "#E7D8C7",
              },

              "&:hover fieldset": {
                borderColor: "#C8A98D",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#8B5E3C",
                borderWidth: "1.5px",
              },
            },

            "& .MuiInputLabel-root": {
              color: "#5E4632",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#8B5E3C",
            },
          }}
        />
      </div>

      {/* Phone */}
      <div className="mb-5">
        <TextField
          fullWidth
          label="Phone Number"
          placeholder="9876543210"
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          slotProps={{
            htmlInput: {
              maxLength: 10,
              inputMode: "numeric",
            },
          }}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#FFFDFC",

              "& fieldset": {
                borderColor: "#E7D8C7",
              },

              "&:hover fieldset": {
                borderColor: "#C8A98D",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#8B5E3C",
                borderWidth: "1.5px",
              },
            },

            "& .MuiInputLabel-root": {
              color: "#5E4632",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#8B5E3C",
            },
          }}
        />
      </div>

      {/* Notes */}
      <div>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notes (Optional)"
          placeholder="Any special instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#FFFDFC",

              "& fieldset": {
                borderColor: "#E7D8C7",
              },

              "&:hover fieldset": {
                borderColor: "#C8A98D",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#8B5E3C",
                borderWidth: "1.5px",
              },
            },

            "& .MuiInputLabel-root": {
              color: "#5E4632",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#8B5E3C",
            },
          }}
        />
      </div>
    </div>
  );
}

export default CustomerDetails;