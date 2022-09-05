# Solar Planner

There are lots of things that I could improve/add to this, but I think it's a decent start to a Solar Planner.

To get the estimated power generation capacity for a drawn polygon area, I calculated the square meters of a panel and then divided the polygon area by the panel area to get the max amount of panels (rounded down to the nearest whole number), and then multipled that number by the panel's wattage. This is probably not the best way to do it since solar panels usually aren't a perfect square, and it doesn't account for other obstructions, spacing between columns/rows, or other considerations, but it's a decent estimate.

The Sidebar component has most of the logic so I focused my tests around that. I also had issues with WebGL running in tests and was unable to fully test the creation of polygons, but I mocked the geometry and was able to create a decent e2e test in `Sidebar.test.js`.

## Assumptions/Details

[NREL PVWatts API](https://developer.nrel.gov/docs/solar/pvwatts/v6/) Details:

- Calculate the hourly plane-of-array (POA) solar irradiance from the horizontal irradiance, latitude, longitude, and time in the solar resource data, and from the array type, tilt and azimuth inputs.
- Calculate the effective POA irradiance to account for reflective losses from the module cover depending on the solar incidence angle.
- Calculate the cell temperature based on the array type, POA irradiance, wind speed, and ambient temperature. The cell temperature model assumes a module height of 5 meters above the ground and an installed nominal operating cell temperature (INOCT) of 49°C for the fixed roof mount option (appropriate for approximately 4 inch standoffs), and of 45°C for the other array type options.
- Calculate the array's DC output from DC system size at a reference POA irradiance of 1,000 W/m², and the calculated cell temperature, assuming a reference cell temperature of 25°C, and temperature coefficient of power of -0.47%/°C for the standard module type, -0.35%/°C for the premium type, or -0.20%/°C for the thin film type.
- Calculate the system's AC output from the calculated DC output and system losses and nominal inverter efficiency input (96% by default) with a part-load inverter efficiency adjustment derived from empirical measurements of inverter performance.
- Losses use the following defaults/assumptions (would want to add inputs for these in the future):
  - Soiling: 2%
  - Shading: 3%
  - Snow: 0
  - Mismatch: 2%
  - Wiring: 2%
  - Connections: 0.5%
  - Light-induced Degradation: 1.5%
  - Nameplate Rating: 1%
  - Age: 0
  - Availability: 3%
  - DC to AC Size Ratio: 1.2
  - Inverter efficiency: 96%
  - Ground Coverage Ratio: 0.4

## Package explanations

- Used CRA to bootstrap project.
- Mapbox-GL for the map components.
- Used Material-UI & Emotion to give me a quicker start on layout/styling.
- Turf.js for calculating area and converting units.
- ESLint/Prettier for code styling and linting.
- Jest/React-testing-library for testing.
- Used w/ Node v16.16.0

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
