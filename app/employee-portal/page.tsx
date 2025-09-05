// This page embeds the Employee Portal (solo-view-main) as an iframe.
// Adjust the src if you deploy the employee portal separately, or use a relative path if built together.

export default function EmployeePortal() {
  return (
    <div style={{ width: '100vw', height: '100vh', border: 'none', padding: 0, margin: 0 }}>
      <iframe
        src="http://localhost:5173" // Change this to the deployed URL or relative path if needed
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Employee Portal"
      />
    </div>
  );
}
