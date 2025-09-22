import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";



export async function GET() {
  try {
    // Adjust the query and fields as per your SQL schema
    const result = await sql`SELECT id, name, email, department, role, location, availability, experience, phone, status FROM employees`;
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Parse form data (Excel file upload)
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
      return NextResponse.json({ success: false, error: "No file uploaded or invalid file type" }, { status: 400 });
    }


    // Read file buffer
    // @ts-ignore
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let employees = [];
    // Try CSV parsing first
    let csvText = buffer.toString('utf-8');
    // Remove BOM if present
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.slice(1);
    }
    // Split lines, ignore empty lines
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length >= 2) {
      const headerLine = lines[0];
      const headers = headerLine.split(',').map(h => h.trim());
      employees = lines.slice(1).map(line => {
        const values = line.split(',');
        const emp: any = {};
        headers.forEach((h, i) => {
          emp[h] = values[i]?.trim() || '';
        });
        return emp;
      });
    }
    // If CSV parsing failed, try Excel
    if (!employees || employees.length === 0) {
      try {
        const xlsx = require("xlsx");
        const workbook = xlsx.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        employees = xlsx.utils.sheet_to_json(sheet);
      } catch (excelError) {
        return NextResponse.json({ success: false, error: "File is not a valid CSV or Excel file." }, { status: 400 });
      }
    }
    if (!employees || employees.length === 0) {
      return NextResponse.json({ success: false, error: "No employee data found in file." }, { status: 400 });
    }

    // Insert employees into database
    let importedRows = 0;
    for (const emp of employees) {
      // Adjust field mapping to match template
      await sql`
        INSERT INTO employees (
          id, name, email, department, role, location, availability, experience, phone, currentProjects, completedProjects, skills, status
        )
        VALUES (
          ${emp.id}, ${emp.name}, ${emp.email}, ${emp.department}, ${emp.role}, ${emp.location}, ${emp.availability}, ${emp.experience}, ${emp.phone}, ${emp.currentProjects}, ${emp.completedProjects}, ${emp.skills}, ${emp.status}
        )
        ON CONFLICT (email) DO UPDATE SET
          id = EXCLUDED.id,
          name = EXCLUDED.name,
          department = EXCLUDED.department,
          role = EXCLUDED.role,
          location = EXCLUDED.location,
          availability = EXCLUDED.availability,
          experience = EXCLUDED.experience,
          phone = EXCLUDED.phone,
          currentProjects = EXCLUDED.currentProjects,
          completedProjects = EXCLUDED.completedProjects,
          skills = EXCLUDED.skills,
          status = EXCLUDED.status;
      `;
      importedRows++;
    }

    return NextResponse.json({ success: true, importedRows, totalRows: employees.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to import employees" }, { status: 500 });
  }
}
