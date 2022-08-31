import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Map from '../Map';
import Sidebar from '../Sidebar';

export default function App() {
  const [drawings, setDrawings] = useState();

  const onDraw = (e, ...props) => {
    console.log(e, props);
    setDrawings(e);
  };
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <MuiAppBar position="absolute">
        <Toolbar>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Solar Planner
          </Typography>
        </Toolbar>
      </MuiAppBar>
      <Grid
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container>
          <Map onDraw={onDraw} />
        </Container>
      </Grid>
      <Sidebar drawings={drawings} />
    </Grid>
  );
}