/**
 * LeadsPage (route entry point) — /dashboard/leads
 * Delegates to the feature-level LeadsPage which owns all lead management logic.
 */
import LeadsPageFeature from '../features/leads/LeadsPage';

const LeadsPage = () => <LeadsPageFeature />;

export default LeadsPage;
