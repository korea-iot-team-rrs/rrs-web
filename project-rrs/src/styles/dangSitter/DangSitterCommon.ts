import { styled } from "@mui/material/styles";
import shadows from "@mui/material/styles/shadows";
import Switch, { SwitchProps } from "@mui/material/Switch";

export const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: 4,
};

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 40,
  height: 24,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 20,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(12px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 4,
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "rgb(255, 0, 99)",
        ...theme.applyStyles("dark", {
          backgroundColor: "#177ddc",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 16,
    height: 16,
    borderRadius: 8,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 24 / 2, // track의 둥근 정도 조정
    opacity: 1,
    backgroundColor: "rgb(28, 219, 79)",
    boxSizing: "border-box",
    ...theme.applyStyles("dark", {
      backgroundColor: "rgba(255,255,255,.35)",
    }),
  },
}));
