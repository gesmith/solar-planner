import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import NREL from '../../api/nrel';
import pvpanels from '../../api/pvpanels';

import * as turf from '@turf/turf';

const Sidebar = ({ drawings }) => {
  const api = new NREL();
  const [areaInMeters, setAreaInMeters] = useState(null);
  const [moduleType, setModuleType] = useState('');
  const [arrayType, setArrayType] = useState('');
  const [panelType, setPanelType] = useState(1);
  const [tilt, setTilt] = useState(20);
  const [azimuth, setAzimuth] = useState(180);
  const [losses, setLosses] = useState(14);
  const [potentialCapacity, setPotentialCapacity] = useState();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get the drawings from mapbox and calculate its area.
    const area = drawings ? turf.area(drawings?.features[0].geometry) : null;
    setAreaInMeters(area);
  }, [drawings]);

  useEffect(() => {
    if (areaInMeters && panelType) {
      // Divide square area by the square meters of the panel, multiply that by the specified wattage to get the system capacity
      const panel = pvpanels.find((panel) => panel.id === panelType);
      // Get the squared meter area of a panel. (convert from millimeters)
      const panelArea = turf.convertArea(
        panel.width * panel.length,
        'millimeters',
        'meters'
      );
      // Calculate how many panels could potentially fit within the installation area. Round down to the nearest whole number (can't install half a panel);
      const numberOfPanels = Math.floor(areaInMeters / panelArea);
      // Multiply the number of potentially possible panels by their specified wattage at ideal conditions. Divide by 1000 to convert to kW
      const potentialCapacity = (numberOfPanels * panel.wattage) / 1000;
      setPotentialCapacity(potentialCapacity.toFixed(2));
    }
  }, [areaInMeters, panelType]);

  const onClick = async (e) => {
    e.preventDefault();
    const polygonPoints = turf.points(
      drawings?.features[0]?.geometry.coordinates[0]
    );
    // Get the lat/lon of the center of the polygon and create the request object for the NREL api
    const center = turf.center(polygonPoints);
    const lon = center.geometry.coordinates[0];
    const lat = center.geometry.coordinates[1];
    const params = {
      system_capacity: potentialCapacity,
      module_type: moduleType,
      losses: losses,
      array_type: arrayType,
      tilt: tilt,
      azimuth: azimuth,
      lat,
      lon
      //address: ''
    };
    // Send request to NREL pvWatts API which will calculate estimated capacity based on location irradiance data, and other factors
    setIsLoading(true);
    const data = await api.getPVData(params);
    setData(data);
    setIsLoading(false);
    console.log(data);
  };

  const pvPanelSelect = () => {
    return pvpanels.map((panel) => (
      <MenuItem value={panel.id} key={`${panel.id}-${panel.title}`}>
        {panel.manufacturer} {panel.title}
      </MenuItem>
    ));
  };

  const buildAnnualProductionTable = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    if (data) {
      return (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Solar Radiation</TableCell>
                <TableCell>AC Power</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {months.map((month, idx) => (
                <TableRow
                  key={month}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {month}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {data?.outputs?.solrad_monthly[idx]?.toFixed(2)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {`${data?.outputs?.ac_monthly[idx]?.toFixed(0)} kWh`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  return (
    <Grid item xs={12} sm={5} md={3} component={Paper} elevation={6} square>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            mt: '15px'
          }}
        >
          <Card sx={{ marginRight: '15px' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Area
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                in square meters
              </Typography>
              <Typography variant="h5">
                {areaInMeters ? areaInMeters.toFixed(2) : 'No drawings found.'}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                System size
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                DC power
              </Typography>
              <Typography variant="h5">
                {potentialCapacity
                  ? `${potentialCapacity} kW`
                  : 'Select a module.'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box
          component="form"
          sx={{
            mt: 3
          }}
        >
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="panelType-label">Module</InputLabel>
              <Select
                labelId="panelType-label"
                id="panelType"
                value={panelType}
                label="Panel"
                onChange={(e) => setPanelType(e.target.value)}
              >
                {pvPanelSelect()}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="moduleType-label">Module Type</InputLabel>
              <Select
                labelId="moduleType-label"
                id="moduleType"
                value={moduleType}
                label="Module Type"
                onChange={(e) => setModuleType(e.target.value)}
              >
                <MenuItem value={0}>Standard</MenuItem>
                <MenuItem value={1}>Premium</MenuItem>
                <MenuItem value={2}>Thin Film</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="arrayType-label">Array Type</InputLabel>
              <Select
                labelId="arrayType-label"
                id="arrayType"
                value={arrayType}
                label="Array Type"
                onChange={(e) => setArrayType(e.target.value)}
              >
                <MenuItem value={0}>Fixed Open Rack</MenuItem>
                <MenuItem value={1}>Fixed - Roof Mounted</MenuItem>
                <MenuItem value={2}>Axis</MenuItem>
                <MenuItem value={3}>Axis Backtracking</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="standard-basic"
              label="Tilt (degrees)"
              variant="filled"
              onChange={(e) => setTilt(e.target.value)}
              value={tilt}
            />
            <TextField
              id="standard-basic"
              label="Azimuth (degrees)"
              variant="filled"
              onChange={(e) => setAzimuth(e.target.value)}
              value={azimuth}
            />
            <TextField
              id="standard-basic"
              label="Losses (%)"
              variant="filled"
              onChange={(e) => setLosses(e.target.value)}
              value={losses}
            />

            <Button
              variant="contained"
              onClick={onClick}
              disabled={
                isLoading ||
                !areaInMeters ||
                moduleType === '' ||
                arrayType === ''
              }
            >
              Calculate
            </Button>
            {data?.outputs?.ac_annual ? (
              <Alert severity="success">
                Annual AC output: {data?.outputs?.ac_annual?.toFixed(2)} kWh
              </Alert>
            ) : null}
            {data?.errors?.length
              ? data?.errors?.map((error) => (
                  <Alert severity="error">{error}</Alert>
                ))
              : buildAnnualProductionTable()}
          </Stack>
        </Box>
      </Box>
    </Grid>
  );
};

Sidebar.propTypes = {
  drawings: propTypes.object
};

export default Sidebar;
