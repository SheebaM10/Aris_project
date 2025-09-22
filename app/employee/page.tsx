import { getEmployees } from "../../lib/data";
import { Employee } from "../../lib/types";

export default async function EmployeeListPage() {
  const employees: Employee[] = await getEmployees();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Directory</h1>
      {employees.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-lg font-semibold mb-2">No Employee Data Available</p>
          <p className="text-gray-600">Import your employee data using the Import tab to get started with workforce management.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white shadow rounded-lg p-6 border">
              <h2 className="text-xl font-bold mb-2">{emp.name || "-"}</h2>
              <p className="text-gray-700 mb-1"><span className="font-semibold">ID:</span> {emp.id || "-"}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> {emp.email || "-"}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Department:</span> {emp.department || "-"}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Role:</span> {emp.role || "-"}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Location:</span> {emp.location || "-"}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Availability:</span> {emp.availability || "-"}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Experience:</span> {emp.experience || "-"}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Phone:</span> {emp.phone || "-"}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Current Projects:</span> {emp.current_projects !== undefined ? emp.current_projects : "-"}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Completed Projects:</span> {emp.completed_projects !== undefined ? emp.completed_projects : "-"}</p>
            <p className="text-gray-700 mb-1"><span className="font-semibold">Status:</span> {emp.status || "-"}</p>
              <div className="mb-2">
                <span className="font-semibold">Skills:</span>
                <ul className="list-disc ml-6">
                  {(() => {
                    let skillsArr: any[] = [];
                    const skillsRaw: any = emp.skills;
                    if (!skillsRaw) return <li className="text-gray-500">None</li>;
                    if (Array.isArray(skillsRaw)) {
                      skillsArr = skillsRaw;
                    } else if (typeof skillsRaw === "string" && typeof skillsRaw.trim === "function" && skillsRaw.trim() !== "") {
                      try {
                        skillsArr = JSON.parse(skillsRaw);
                      } catch {
                        skillsArr = skillsRaw.split(",").map((s: string) => ({ name: s.trim() }));
                      }
                    }
                    return skillsArr.length > 0 ? (
                      skillsArr.map((skill: any, idx: number) => (
                        skill && skill.name ? (
                          <li key={idx}>{skill.name}{skill.level ? ` (Level: ${skill.level})` : ""}{skill.last_used ? `, Last Used: ${new Date(skill.last_used).toLocaleDateString()}` : ""}</li>
                        ) : null
                      ))
                    ) : (
                      <li className="text-gray-500">None</li>
                    );
                  })()}
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Certifications:</span>
                <ul className="list-disc ml-6">
                  {(() => {
                    let certArr: any[] = [];
                    const certRaw: any = emp.certifications;
                    if (!certRaw) return <li className="text-gray-500">None</li>;
                    if (Array.isArray(certRaw)) {
                      certArr = certRaw;
                    } else if (typeof certRaw === "string" && typeof certRaw.trim === "function" && certRaw.trim() !== "") {
                      try {
                        certArr = JSON.parse(certRaw);
                      } catch {
                        certArr = certRaw.split(",").map((c: string) => ({ name: c.trim() }));
                      }
                    }
                    return certArr.length > 0 ? (
                      certArr.map((cert: any, idx: number) => (
                        cert && cert.name ? (
                          <li key={idx}>{cert.name}{cert.issuer ? `, Issuer: ${cert.issuer}` : ""}{cert.expires_at ? `, Expires: ${new Date(cert.expires_at).toLocaleDateString()}` : ""}</li>
                        ) : null
                      ))
                    ) : (
                      <li className="text-gray-500">None</li>
                    );
                  })()}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Trainings:</span>
                <ul className="list-disc ml-6">
                  {emp.trainings && Array.isArray(emp.trainings) && emp.trainings.length > 0 ? emp.trainings.map((train: any, idx: number) => (
                    <li key={idx}>{train.program_id || "-"} ({train.status || "-"}, Progress: {train.progress !== undefined ? train.progress : "-"}%)
                      {train.started_at ? `, Started: ${new Date(train.started_at).toLocaleDateString()}` : ""}
                      {train.completed_at ? `, Completed: ${new Date(train.completed_at).toLocaleDateString()}` : ""}
                    </li>
                  )) : <li className="text-gray-500">None</li>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
