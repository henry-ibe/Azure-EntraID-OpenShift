const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

const EMPLOYEES_FILE =
  process.env.EMPLOYEES_FILE_PATH ||
  path.join(__dirname, "..", "terraform-entra-id", "employees.json");

const DEPARTMENTS = ["HR", "IT", "ENGINEERING", "ADMIN"];

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

function readEmployees() {
  try {
    const raw = fs.readFileSync(EMPLOYEES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read employees.json:", err.message);
    return [];
  }
}

function writeEmployees(employees) {
  fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(employees, null, 2) + "\n");
}

app.get("/", (req, res) => {
  const employees = readEmployees();
  res.render("index", {
    employees,
    departments: DEPARTMENTS,
    message: req.query.message || null,
    error: req.query.error || null,
  });
});

app.post("/employees/add", (req, res) => {
  const { first_name, last_name, department } = req.body;

  if (!first_name || !last_name || !department) {
    return res.redirect("/?error=" + encodeURIComponent("All fields are required."));
  }

  if (!DEPARTMENTS.includes(department)) {
    return res.redirect("/?error=" + encodeURIComponent("Invalid department selected."));
  }

  const employees = readEmployees();

  const alreadyExists = employees.some(
    (e) =>
      e.first_name.toLowerCase() === first_name.toLowerCase() &&
      e.last_name.toLowerCase() === last_name.toLowerCase()
  );

  if (alreadyExists) {
    return res.redirect(
      "/?error=" + encodeURIComponent(first_name + " " + last_name + " already exists.")
    );
  }

  employees.push({
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    department,
    status: "active",
  });

  writeEmployees(employees);

  res.redirect(
    "/?message=" +
      encodeURIComponent(first_name + " " + last_name + " added to " + department + ". Run terraform apply to provision.")
  );
});

app.post("/employees/offboard", (req, res) => {
  const { first_name, last_name } = req.body;

  const employees = readEmployees();
  const target = employees.find(
    (e) => e.first_name === first_name && e.last_name === last_name
  );

  if (!target) {
    return res.redirect("/?error=" + encodeURIComponent("Employee not found."));
  }

  target.status = "disabled";
  writeEmployees(employees);

  res.redirect(
    "/?message=" +
      encodeURIComponent(first_name + " " + last_name + " marked for offboarding. Run terraform apply to disable.")
  );
});

app.post("/employees/reactivate", (req, res) => {
  const { first_name, last_name } = req.body;

  const employees = readEmployees();
  const target = employees.find(
    (e) => e.first_name === first_name && e.last_name === last_name
  );

  if (!target) {
    return res.redirect("/?error=" + encodeURIComponent("Employee not found."));
  }

  target.status = "active";
  writeEmployees(employees);

  res.redirect(
    "/?message=" + encodeURIComponent(first_name + " " + last_name + " reactivated.")
  );
});

app.listen(PORT, () => {
  console.log("Provisioning UI running at http://localhost:" + PORT);
  console.log("Reading/writing: " + EMPLOYEES_FILE);
});
