import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import React from 'react';
import Amazon from "../assets/images/amazon.png";
import Cardjobtype from "../assets/images/cardjobtype.png";
import Location from "../assets/images/location.png";
import Salary from "../assets/images/salary.png";
import Swiggy from "../assets/images/swiggy.png";
import Tesla from "../assets/images/tesla.png";

const companies = [Amazon, Swiggy, Tesla];

function JobCard({
    jobTitle,
    location,
    jobType,
    salaryFrom,
    salaryTo,
    jobDescription,
    createdAt,
}) {
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    return (
        <Box display={'flex'} flexDirection={'column'} height={'360px'} sx={{ border: '1px solid #FFFFFF', boxShadow: "0px 0px 10.25px rgba(148, 148, 148, 0.25)", borderRadius: '13.1786px', padding: '20px', gap: '14px', wordWrap: 'break-word' }}>

            <Box display={'flex'} justifyContent={'space-between'}>
                <Box sx={{ background: ' linear-gradient(180deg, #FEFEFD 0%, #F1F1F1 100%)', border: '1px solid #FFFFFF', boxShadow: "0px 0px 10.25px rgba(148, 148, 148, 0.25)", borderRadius: '13.1786px' }} p={"3px"}>
                    <img src={randomCompany} width={'66px'} height={'66px'} /></Box>
                <Chip label={createdAt} sx={{ backgroundColor: "#B0D9FF", fontWeight: 400, fontFamily: "sans-serif" }} />
            </Box>
            <Typography variant="h6"  >
                {jobTitle}
            </Typography>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box display="flex" alignItems="center" gap={1}><img src={Location} /><Typography color='textSecondary' variant='subtitle2'>{location}</Typography></Box>
                <Box display="flex" alignItems="center" gap={1}><img src={Cardjobtype} /><Typography color='textSecondary' variant='subtitle2'>{jobType}</Typography></Box>
                <Box display="flex" alignItems="center" gap={1}><img src={Salary} /><Typography color='textSecondary' variant='subtitle2'>
                    {`${(salaryFrom / 100000)} - ${(salaryTo / 100000)}LPA`}

                </Typography></Box>

            </Box>
            <Typography color='textSecondary' fontSize={'14px'} flexGrow={'1'}
                sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3, // Limits text to 3 lines
                    WebkitBoxOrient: "vertical",
                    wordBreak: "break-word", // Ensures words wrap properly
                }}

            >
                {jobDescription}
            </Typography>
            <Button variant='contained'>Apply Now</Button>
        </Box>
    )
}

export default JobCard