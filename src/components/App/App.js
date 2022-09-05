import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Map from '../Map';
import Sidebar from '../Sidebar';

export default function App() {
  const [drawings, setDrawings] = useState();

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
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
          item
          xs={12}
          sm={6}
          md={8}
          sx={{
            flexGrow: 1,
            height: '100vh'
          }}
        >
          <Toolbar />
          <Map onDraw={(e) => setDrawings(e)} />
        </Grid>
        <Sidebar drawings={drawings} />
      </Grid>
    </ThemeProvider>
  );
}
