import SosDashboard from "../../components/sos/SosDashboard";
import departmentApiRequest from "../../utils/departmentApiRequest";

const DepartmentSosPage = () => <SosDashboard api={departmentApiRequest} embedded />;

export default DepartmentSosPage;
