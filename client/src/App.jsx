import AppRoutes from './routes/AppRoutes';

/**
 * App — root component.
 * All routing and the global AuthModal are managed inside AppRoutes.
 * token + user are rehydrated from localStorage via authSlice initialState —
 * no loadUser dispatch needed.
 */
function App() {
  return <AppRoutes />;
}

export default App;
