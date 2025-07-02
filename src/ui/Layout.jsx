import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
    return (
        <div className="dashboard-container">
            <Sidebar/>

            <div className="main-content">
                <Outlet/>
            </div>
        </div>
    );
}

export default Layout;

