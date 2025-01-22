import React from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import PetDiaryTodo from "./PetDiaryTodo/TodoMain";
import PetDiaryHealthRecord from "./PetDiaryHealthRecord";
import PetDiaryWalkingRecord from "./PetDiaryWalkingRecord";
import { PetDiaryMainProps } from "../../../types/petDiaryType";
import { RiTodoLine } from "react-icons/ri";
import { PiDogFill } from "react-icons/pi";
import { FaNotesMedical } from "react-icons/fa";

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
export default function PetDiaryContents({ selectedDate }: PetDiaryMainProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#303030",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          variant="fullWidth"
          sx={{
            position: "relative",
          }}
          TabIndicatorProps={{
            style: {
              top: "60px",
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
            icon={<FaNotesMedical />}
            label={<span>&nbsp;오늘할일</span>}
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "60px",
              backgroundColor: "#ff6b6b",
              color: "#fff",
              fontSize: "16px",
            }}
            {...a11yProps(0)}
          />
          <Tab
            icon={<PiDogFill />}
            label={<span>&nbsp;산책기록</span>}
            sx={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#ffa726",
              color: "#ffffff",
              fontSize: "16px",
            }}
            {...a11yProps(1)}
          />
          <Tab
            icon={<RiTodoLine />}
            label={<span>&nbsp;건강기록</span>}
            sx={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#7e57c2",
              color: "#fff",
              fontSize: "16px",
            }}
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <PetDiaryTodo selectedDate={selectedDate} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PetDiaryWalkingRecord selectedDate={selectedDate}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PetDiaryHealthRecord selectedDate={selectedDate}/>
      </TabPanel>
    </Box>
  );
}
