import Body from "../../components/Body/Body";
import Sidebar from "../../components/SideBar/SideBar";


export default function AdminPage() {
  return (
    <div style={{ display: "flex",padding:"15px",backgroundColor:"#111827"}}>
    {/* Left Sidebar */}
    <Sidebar />

    {/* Right Content Area with Gradient Background */}
    <Body>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Page!</p>

      {/* Your real admin content goes here */}
    </Body>
  </div>
  )
}
