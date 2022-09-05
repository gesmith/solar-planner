import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
  getByRole
} from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';

// Mock a polygon coming from the mapbox-gl component.
const drawings = {
  features: [
    {
      geometry: {
        coordinates: [
          [
            [-72.75693552592773, 44.81837825882428],
            [-72.7568749198431, 44.81836802296533],
            [-72.75691243789461, 44.8183209379917],
            [-72.75697689198523, 44.81831479646954],
            [-72.75693552592773, 44.81837825882428]
          ]
        ],
        type: 'Polygon'
      }
    }
  ]
};

test("get's the surface area of a polygon and displays it on the screen", async () => {
  render(<Sidebar drawings={drawings} />);
  // area = 31.09 size = 6.38 kW
  // AC =7446.06 kWh
  const areaInMeters = screen.getByTestId('areaInMeters');
  expect(areaInMeters).toHaveTextContent(31.09);
});

test("get's the potential capacity of the area and displays it on the screen", async () => {
  render(<Sidebar drawings={drawings} />);
  const potentialCapacity = screen.getByTestId('potentialCapacity');
  expect(potentialCapacity).toHaveTextContent('6.00 kW');
});

test('can submit the form', async () => {
  render(<Sidebar drawings={drawings} />);

  // Select a PV panel
  // Since Material UI's Select component uses a bunch of different elements, we have to get creative with how our tests interact with it.
  // https://stackoverflow.com/questions/55184037/react-testing-library-on-change-for-material-ui-select-component
  const pvPanel = screen.getByTestId('panelType');
  UserEvent.click(getByRole(pvPanel, 'button'));
  await waitFor(() => UserEvent.click(screen.getByTestId('panelType-1')));
  expect(pvPanel).toHaveTextContent(/Q-CELLS Q.PEAK DUO BLK ML-G10+/i);

  const selectLabel = /Module Type/i;
  const selectEl = await screen.findByLabelText(selectLabel);

  expect(selectEl).toBeInTheDocument();

  UserEvent.click(selectEl);

  // Locate the corresponding popup (`listbox`) of options.
  const optionsPopupEl = await screen.findByRole('listbox', {
    name: selectLabel
  });

  // Click an option in the popup.
  UserEvent.click(within(optionsPopupEl).getByText(/Premium/i));

  // Confirm the outcome.
  expect(within(optionsPopupEl).getByText(/Premium/i)).toBeInTheDocument();

  // Select a Array type
  const arrayLabel = /Array Type/i;
  const arrayElement = await screen.findByLabelText(arrayLabel);

  expect(arrayElement).toBeInTheDocument();

  UserEvent.click(arrayElement);

  // Locate the corresponding popup (`listbox`) of options.
  const arrayOptions = await screen.findByRole('listbox', {
    name: arrayLabel
  });

  // Click an option in the popup.
  UserEvent.click(within(arrayOptions).getByText(/Fixed - Roof Mounted/i));

  // Confirm the outcome.
  expect(
    within(arrayOptions).getByText(/Fixed - Roof Mounted/i)
  ).toBeInTheDocument();

  // Click submit button and send request to NREL pvwatts API
  const submitButton = screen.getByTestId('submit');
  fireEvent.click(submitButton);
  await waitFor(() =>
    expect(screen.getByTestId('ac_annual')).toHaveTextContent(
      'Annual AC output: 7002.56 kWh'
    )
  );
});
