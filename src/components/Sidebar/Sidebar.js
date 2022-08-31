import React from 'react';
// import PropTypes from "prop-types"
import Box from '@mui/material/Box';
// import Typography from "@mui/material/Typography"
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import NREL from '../../api/nrel';

import * as turf from '@turf/turf';

const Sidebar = ({ drawings }) => {
  const api = new NREL();

  const area = drawings
    ? turf.area(drawings.features[0].geometry).toFixed(2)
    : 'No drawings found.';

  const onClick = async (e) => {
    e.preventDefault();
    const params = {
      system_capacity: '14',
      module_type: 0,
      losses: 0.75,
      array_type: 1,
      tilt: 30,
      azimuth: 120,
      lat: '44.8179668',
      lon: '-72.7592149'
      //   address: ''
    };
    // eslint-disable-next-line no-unused-vars
    const data = await api.getPVData(params);
    debugger;
  };
  return (
    <Grid item xs={12} sm={5} md={5} component={Paper} elevation={6} square>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Area
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                in meters
              </Typography>
              <Typography variant="body2">{area}</Typography>
              <button onClick={onClick}>NREL</button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Grid>
  );
};

Sidebar.propTypes = {
  drawings: {}
};

export default Sidebar;
