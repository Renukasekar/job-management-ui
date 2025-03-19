import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  createTheme,
  Grid2,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Slider from "@mui/material/Slider";
import { ThemeProvider } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import NoData from "./assets/images/no-data.svg";
import AddJob from "./components/AddJob";
import Jobtype from "./components/icons/Jobtype";
import Location from "./components/icons/Location";
import { Logo } from "./components/icons/Logo";
import Search from "./components/icons/Search";
import JobCard from "./components/JobCard";
import { API_BASE_URL } from "./utils/constants";

dayjs.extend(relativeTime);


function App() {
  const [open, setOpen] = useState(false);

  const [filter, setFilter] = useState({
    search: "",
    location: null,
    jobType: null,
    salaryRange: [100000, 1000000],
  })

  const debounceRef = useRef(null);

  const {
    isPending,
    error,
    data: jobList,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["jobList"],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        jobTitle: filter.search,
        locationId: filter.location && filter.location._id || "",
        jobTypeId: filter.jobType && filter.jobType._id || "",
        min: filter.salaryRange[0],
        max: filter.salaryRange[1],
      });
      const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`);
      return await response.json();
    },
  });

  const { data: jobTypeList } = useQuery({
    queryKey: ["jobTypeList"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/job-types`);
      return await response.json();
    },
  });

  const { data: locationList } = useQuery({
    queryKey: ["locationList"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/locations`);
      return await response.json();
    },
  });

  console.log(jobTypeList, "dajobTypeListta");

  const theme = createTheme({
    palette: {
      primary: {
        main: "#00AAFF",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            color: "white",
          },
        },
      },
    },
  });

  const handleChange = (event, newValue) => {
    setFilter({ ...filter, salaryRange: newValue });
  };

  const handleSearch = (event) => {
    setFilter({ ...filter, search: event.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  
    debounceRef.current = setTimeout(() => {
      refetch(); // Fetch data after debounce delay
    }, 500); 

  }, [filter, refetch]);

  return (
    <ThemeProvider theme={theme}>
      <Box px={4} py={3} boxShadow={"0px 0px 14px rgba(198, 191, 191, 0.25)"}>
        <Grid2 container spacing={2} columnSpacing={6}>
          <Grid2 size={12}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              justifySelf={"center"}
              flexWrap={'wrap'}
              gap={6}
              border={"1px solid #FCFCFC"}
              boxShadow={"0px 0px 20px rgba(127, 127, 127, 0.15)"}
              borderRadius={"122px"}
              p={2}
              mb={2}
            >
              <Logo />
              <Typography color={"#303030"}>Home</Typography>
              <Typography color={"#303030"}>Find Jobs</Typography>
              <Typography color={"#303030"}>Find Talents</Typography>
              <Typography color={"#303030"}>About Us</Typography>
              <Typography color={"#303030"}>Testimonials</Typography>
              <Button
                onClick={handleClickOpen}
                sx={{
                  height: "38px",
                  background:
                    "linear-gradient(180deg, #A128FF 0%, #6100AD 113.79%)",
                  color: "white",
                  borderRadius: "30px",
                  padding: "8px 24px",
                  fontSize: "16px",
                }}
              >
                Create Jobs
              </Button>
            </Box>
          </Grid2>
          <Grid2 size={{
            xs: 12,
            md: 6,
            lg: 3
          }}>
            <TextField
              fullWidth
              onChange={handleSearch}
              value={filter.search}
              id="input-with-icon-textfield"
              placeholder="Search By Job Title, Role"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
              variant="standard"
            />
          </Grid2>
          <Grid2 size={{
            xs: 12,
            md: 6,
            lg: 3
          }}>
            <Autocomplete
              disablePortal
              options={locationList}
              fullWidth
              getOptionLabel={(option) => option.location}
              onChange={(e, value) => setFilter({ ...filter, location: value })}
              value={filter.location}
              renderInput={(params) => (
                <TextField
                  {...params}
                  slotProps={{
                    input: {
                      ...params.InputProps,

                      startAdornment: (
                        <InputAdornment position="start">
                          <Location />
                        </InputAdornment>
                      ),
                    },
                  }}
                  placeholder="Preferred Location"
                  variant="standard"
                />
              )}
            />
          </Grid2>

          <Grid2 size={{
            xs: 12,
            md: 6,
            lg: 3
          }}>
            <Autocomplete
              disablePortal
              options={jobTypeList}
              getOptionLabel={(option) => option.jobType}
              onChange={(e, value) => setFilter({ ...filter, jobType: value })}
              value={filter.jobType}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Jobtype />
                        </InputAdornment>
                      ),
                    },
                  }}
                  placeholder="Job type"
                  variant="standard"
                />
              )}
            />
          </Grid2>
          <Grid2 size={{
            xs: 12,
            md: 6,
            lg: 3
          }} mt={-2}>
            <Box display="flex" justifyContent="space-between" mb={1} gap={1}>
              <Typography>Salary Per Annum</Typography>
              <Typography>
                ₹{filter.salaryRange[0] / 100000}L - ₹{filter.salaryRange[1]/100000}L
              </Typography>
            </Box>
            <Slider
              size="small"
              value={filter.salaryRange}
              onChange={handleChange}
              valueLabelDisplay="off"
              min={100000}
              max={5000000}
              step={100000} // Step set to ₹100,000
              sx={{
                color: "black", // Black slider track
                "& .MuiSlider-thumb": {
                  backgroundColor: "black", // Black slider thumb
                  border: "2px solid white",
                },
                "& .MuiSlider-rail": {
                  color: "lightgray", // Light gray inactive part
                },
              }}
            />
          </Grid2>
        </Grid2>
      </Box>

      <Box background={"#FBFBFF"} p={3}>
      <Grid2 container spacing={2}>
  {jobList?.length !== 0 ? (
    jobList?.map((job) => (
      <Grid2 size={{
        xs: 12,
        md: 6,
        lg: 3
      }} key={job._id}>
        <JobCard
          jobDescription={job.jobDescription}
          jobType={job.jobTypeId?.jobType}
          location={job.locationId?.location}
          salaryFrom={job.salaryRange?.min}
          salaryTo={job.salaryRange?.max}
          jobTitle={job.jobTitle}
          createdAt={dayjs(job.createdAt).fromNow()}
        />
      </Grid2>
    ))
  ) : (
    <Grid2 size={12} container justifyContent={"center"} alignItems={"center"} height={'60vh'}>
    <Box height={"300px"} width={'300px'}>
      <img src={NoData} alt="No Data" />
    </Box>
    </Grid2>
  )}
</Grid2>
      </Box>
      <AddJob
        open={open}
        handleClose={handleClose}
        jobTypeList={jobTypeList}
        locationList={locationList}
      />
      <Backdrop
  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
  open={isFetching || isPending}
>
  <CircularProgress color="inherit" />
</Backdrop>
    </ThemeProvider>
  );
}
export default App;
