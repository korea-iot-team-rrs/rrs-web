import React from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import PetDiaryTodo from "./PetDiaryTodo";
import PetDiaryHealthRecord from "./PetDiaryHealthRecord";
import PetDiaryWalkingRecord from "./PetDiaryWalkingRecord";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
      <AppBar position="static"
        style={{
          borderTopRightRadius: "10px",
          backgroundColor: "#333333"
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          variant="fullWidth"
          sx={{
            borderTopRightRadius: "10px",
            position: "relative", // 부모 컨테이너를 relative로 설정
          }}
          TabIndicatorProps={{
            style: {
              top: "50px", // 상단에서의 거리 (탭 아래로 이동)
              left: "0px",
              position: "absolute",
              height: "50px",
              width: "1000px",
              backgroundColor:
                value === 0 ? "#ff6b6b" : value === 1 ? "#ffa726" : "#7e57c2",
            },
          }}
        >
          <Tab
            label="오늘할일"
            sx={{
              height: "70px",
              borderTopRightRadius: "10px",
              backgroundColor: "#ff6b6b",
              color: "#fff"
            }}
            {...a11yProps(0)}
          />
          <Tab
            label="산책기록"
            sx={{
              borderTopRightRadius: "10px",
              backgroundColor: "#ffa726",
              color: "#fff"
            }}
            {...a11yProps(1)}
          />
          <Tab
            label="건강기록"
            sx={{
              borderTopRightRadius: "10px",
              backgroundColor: "#7e57c2",
              color: "#fff"
            }}
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <PetDiaryTodo />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PetDiaryHealthRecord />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PetDiaryWalkingRecord />
      </TabPanel>
    </Box>
  );
}
