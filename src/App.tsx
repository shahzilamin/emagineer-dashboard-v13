import { DashboardProvider, useDashboard } from './contexts/DashboardContext';
import { DashboardLayout } from './components/layout';
import { WellBeforeOperatorDashboard, WellBeforeExecutiveDashboard } from './components/wellbefore';
import { D2CBuildersOperatorDashboard, D2CBuildersExecutiveDashboard } from './components/d2cbuilders';
import { PortfolioDashboard } from './components/portfolio';

function DashboardContent() {
  const { company, view } = useDashboard();

  // Portfolio view ignores operator/executive toggle
  if (company === 'portfolio') {
    return <PortfolioDashboard />;
  }

  // WellBefore dashboards
  if (company === 'wellbefore') {
    return view === 'operator' ? (
      <WellBeforeOperatorDashboard />
    ) : (
      <WellBeforeExecutiveDashboard />
    );
  }

  // D2C Builders dashboards
  if (company === 'd2cbuilders') {
    return view === 'operator' ? (
      <D2CBuildersOperatorDashboard />
    ) : (
      <D2CBuildersExecutiveDashboard />
    );
  }

  return null;
}

function App() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </DashboardProvider>
  );
}

export default App;
