import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DangSitter from "../DangSitter";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { Notice } from "../../../constants/Notice";

export default function FirstComponent() {
  return (
    <>
      <DangSitter providerId={2} />
      <div className="reservatoionContainer">
        <div className="notice">
          <Box>
            <span>주의사항</span>
            <Notice />
            <FormControlLabel
              value="bottom"
              control={<Checkbox />}
              label="약관에 동의합니다."
              labelPlacement="bottom"
            />
          </Box>
        </div>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker />
        <DatePicker />
      </LocalizationProvider>
    </>
  );
}
