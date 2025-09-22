import React, { useEffect, useState } from "react";

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  location: string;
  availability: string;
  experience: string;
  phone: string;
  status: string;
}

export default function EmployeeDetailsCard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/import/employees");
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6 border mt-6">
      <h2 className="text-xl font-bold mb-4">Employee Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : employees.length === 0 ? (
        <p>No employee data found.</p>
      ) : (
        <ul className="space-y-4">
          {employees.map((emp) => (
            <li key={emp.id} className="border-b pb-2">
              <span className="font-semibold">{emp.name}</span> ({emp.role})<br />
              <span className="text-gray-700">Email:</span> {emp.email} | <span className="text-gray-700">Dept:</span> {emp.department} | <span className="text-gray-700">Location:</span> {emp.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
