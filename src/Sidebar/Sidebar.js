import React from 'react';
// import PropTypes from "prop-types"
import Box from '@mui/material/Box';
// import Typography from "@mui/material/Typography"
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
// import * as turf from "@turf/turf"

const Sidebar = () => {
  return (
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box component="form" noValidate sx={{ mt: 1 }}></Box>
      </Box>
    </Grid>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
