import CloseIcon from '@mui/icons-material/Close';
import {
    Button,
    Dialog,
    Grid2,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from 'react';
import * as Yup from "yup";
import { API_BASE_URL } from "../utils/constants";
import Publish from "./icons/Publish";
import SalaryRange from "./icons/SalaryRange";
import SaveDraft from "./icons/SaveDraft";
import CustomizedSnackbars from './SnackBar';

const postJob = async (jobData) => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
  
    if (!response.ok) {
      throw new Error("Failed to post job");
    }
    
    return response.json();
  };

  
const validationSchema = Yup.object({
  jobTitle: Yup.string().required("Job Title is required"),
  companyName: Yup.string().required("Company Name is required"),
  location: Yup.object().required("Location is required"),
  jobType: Yup.object().required("Job Type is required"),
  salaryFrom: Yup.number()
    .required("Salary range is required")
    .positive("Salary must be positive"),
  salaryTo: Yup.number()
    .required("Salary range is required")
    .positive("Salary must be positive")
    .moreThan(
      Yup.ref("salaryFrom"),
      "Salary To must be greater than Salary From"
    ),
  applicationDeadline: Yup.date().required("Application Deadline is required"),
  jobDescription: Yup.string().required("Job Description is required"),
});

function JobFormDialog({ open, handleClose, jobTypeList, locationList }) {
    const queryClient = useQueryClient();

    const [snackOpen, setSnackOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      companyName: "",
      location: null,
      jobType: null,
      salaryFrom: "",
      salaryTo: "",
      applicationDeadline: "",
      jobDescription: "",
    },
    validationSchema,
    onSubmit: (values,) => {
        const { applicationDeadline, companyName, jobDescription, jobTitle,  jobType, location, salaryFrom, salaryTo } = values
        const requestBody = {
            "jobTitle": jobTitle,
            "companyName": companyName,
            "locationId": location._id,
            "jobTypeId": jobType._id,
            "salaryRange": {
                "min": salaryFrom,
                "max": salaryTo
            },
            "applicationDeadline": new Date(applicationDeadline).toISOString(),
            "jobDescription": jobDescription,
            "saveDraft": false
        }

        mutate(requestBody)
    },
  });

  const handlePopupClose = () => {
    handleClose();
    resetForm();
  }

  const { handleSubmit, setFieldValue, values, resetForm } = formik;
  
  const  { mutate, isPending } = useMutation({
    mutationFn: postJob,
    mutationKey: "postJob",
    onSuccess: (data, variables, context) => {
        // I will fire first
        
        queryClient.invalidateQueries(["jobList"]);
        setSnackOpen(true)
        setTimeout(()=> {
            setSnackOpen(false)
            handlePopupClose()
        }, 2000)

      },
      onError: (error, variables, context) => {
        
      },
      onSettled: (data, error, variables, context) => {
        
      },
});




  return (
    <Dialog
      onClose={handlePopupClose}
      open={open}
      slotProps={{ paper: { sx: { borderRadius: "16px", position: 'relative' } } }}
    >
        <IconButton sx={{ position: 'absolute', top: 16, right: 16 }} onClick={handlePopupClose}>
        <CloseIcon />
        </IconButton>
      <Grid2 container p={4} spacing={2}>
        <Grid2 size={12} container justifyContent={"center"}>
          <Typography variant="h6">Create Job Opening</Typography>
        </Grid2>
        <Grid2 size={6}>
          <TextField
            label="Job Title"
            variant="outlined"
            fullWidth
            required
            {...formik.getFieldProps("jobTitle")}
            error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
            helperText={formik.touched.jobTitle && formik.errors.jobTitle}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            label="Company Name"
            variant="outlined"
            fullWidth
            required
            {...formik.getFieldProps("companyName")}
            error={
              formik.touched.companyName && Boolean(formik.errors.companyName)
            }
            helperText={formik.touched.companyName && formik.errors.companyName}
          />
        </Grid2>
        <Grid2 size={6}>
          <Autocomplete
            disablePortal
            options={locationList}
            getOptionLabel={(option) => option.location}
            fullWidth
            onChange={(e, value) => setFieldValue("location", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Preferred Location"
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
                {...formik.getFieldProps("location")}
                helperText={formik.touched.location && formik.errors.location}
                required
              />
            )}
          />
        </Grid2>
        <Grid2 size={6}>
          <Autocomplete
            disablePortal
            options={jobTypeList}
            getOptionLabel={(option) => option.jobType}
            fullWidth
            onChange={(e, value) => setFieldValue("jobType", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Job Type"
                error={formik.touched.jobType && Boolean(formik.errors.jobType)}
                {...formik.getFieldProps("jobType")}
                helperText={formik.touched.jobType && formik.errors.jobType}
                required
              />
            )}
          />
        </Grid2>

        <Grid2 size={3}>
          <TextField
            variant="outlined"
            label="Salary range from"
            type="number"
            fullWidth
            {...formik.getFieldProps("salaryFrom")}
            error={
              formik.touched.salaryFrom && Boolean(formik.errors.salaryFrom)
            }
            helperText={formik.touched.salaryFrom && formik.errors.salaryFrom}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SalaryRange />
                  </InputAdornment>
                ),
              },
            }}
            required
          />
        </Grid2>
        <Grid2 size={3}>
          <TextField
            variant="outlined"
            label="Salary range to"
            type="number"
            fullWidth
            {...formik.getFieldProps("salaryTo")}
            error={formik.touched.salaryTo && Boolean(formik.errors.salaryTo)}
            helperText={formik.touched.salaryTo && formik.errors.salaryTo}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SalaryRange />
                  </InputAdornment>
                ),
              },
            }}
            required
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            variant="outlined"
            type="date"
            fullWidth
            label="Application Deadline"
            {...formik.getFieldProps("applicationDeadline")}
            error={
              formik.touched.applicationDeadline &&
              Boolean(formik.errors.applicationDeadline)
            }
            helperText={
              formik.touched.applicationDeadline &&
              formik.errors.applicationDeadline
            }
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            label="Job Description"
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            {...formik.getFieldProps("jobDescription")}
            error={
              formik.touched.jobDescription &&
              Boolean(formik.errors.jobDescription)
            }
            helperText={
              formik.touched.jobDescription && formik.errors.jobDescription
            }
            required
          />
        </Grid2>
        <Grid2 size={6}>
          <Button
            sx={{ border: "1px solid", color: "black", px: 5 }}
            endIcon={<SaveDraft />}
          >
            Save Draft
          </Button>
        </Grid2>
        <Grid2 size={6} container justifyContent={"flex-end"}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ px: 5 }}
            endIcon={<Publish />}
            disabled={isPending}
          >
            Publish
          </Button>
        </Grid2>
      </Grid2>
      <CustomizedSnackbars
      open={snackOpen}
      setOpen={setSnackOpen}
      />
    </Dialog>
  );
}

export default JobFormDialog;
