const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_DB",
});
connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  afterConnection();
});

afterConnection = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        choices: [
          "View Employees",
          "View Roles",
          "View Dept",
          "Add Employee",
          "Change Dept",
          "Add Role",
          "Update Employee Role",
          "I am Done",
        ],
        message: "What do you want to do?",
      },
    ])
    .then((answers) => {
      switch (answers.choice) {
        case "View Employees":
          viewEmployee();
          break;
        case "View Roles":
          viewRole();
          break;
        case "View Dept":
          viewDept();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Change Dept":
          changeDept();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Employee":
          updateEmployee();
          break;

        default:
          connection.end();
          break;
      }
    });
};

function viewEmployee() {
  connection.query(
    `SELECT 
  employee.id,
  employee.last_name,
  employee.first_name,
  role.title,
  role.salary
  FROM employee
  INNER JOIN role
  ON employee.id = role.id
  ORDER BY employee.id; `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      afterConnection();
    }
  );
}
function viewRole() {
  connection.query(
    `SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    employee.role_id
    FROM employee INNER JOIN role
    ON employee.id = role.id
    ORDER BY employee.id;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      afterConnection();
    }
  );
}
function viewDept() {
  connection.query("SELECT * FROM employee_DB.dept;", function (err, res) {
    if (err) throw err;
    console.table(res);
    afterConnection();
  });
}
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstNewEmploy",
        message: "New Employee first Name:",
      },
      {
        type: "input",
        name: "lastNewEmploy",
        message: "New Employee Last Name:",
      },
      {
        type: "list",
        name: "newRole",
        choices: [
          "Manager",
          "Assistant Manager",
          "Producer",
          "Band Member",
          "None of the options",
        ],
        message: "What do they do?",
      },
      {
        type: "confirm",
        name: "manDept",
        message: "Are they in managment?",
      },
      {
        type: "input",
        name: "newMonie",
        message: "How much do they make?",
      },
      {
        type: "input",
        name: "newJob",
        message: "What is their role with the band?",
      },
    ])
    .then((newEmployee) => {
      // let newEmployee.newRole = 0;
      if (newEmployee.newRole === "Manager") {
        newEmployee.newRole = 1;
        console.log("New Employee added");
      } else if (newEmployee.newRole === "Assistant Manager") {
        newEmployee.newRole = 2;
        console.log("New Employee added");
      } else if (newEmployee.newRole === "Producer") {
        newEmployee.newRole = 7;
        console.log("New Employee added");
      } else if (newEmployee.newRole === "Band Member") {
        newEmployee.newRole = 3;
        console.log("New Employee added");
      } else if (newEmployee.newRole === "None of the options") {
        console.log("No Employee added");
        return null;
      }
      if (newEmployee.manDept === true) {
        console.log(newEmployee.manDept);
        newEmployee.manDept = 1;
      }
      newEmployee.manDept = 2;

      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: newEmployee.firstNewEmploy,
          last_name: newEmployee.lastNewEmploy,
          role_id: newEmployee.newRole,
          manager_id: newEmployee.manDept,
        },

        function (err, res) {
          if (err) throw err;
          // console.table(res);
          // afterConnection();
        }
      );
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: newEmployee.newJob,
          salary: newMonie,
        },
      )
    });
}
async function retriveNames() {
  var nameArray = [];
  connection.query(
    `SELECT first_name, last_name FROM employee_DB.employee;`,
    await function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        nameArray.push(res[i].first_name + " " + res[i].last_name);
      }
      console.log(nameArray);
      return nameArray;
    }
  );
  return nameArray;
}

function changeDept() {
  let tempArray = retriveNames();
  let deptArray = [
    {
      type: "list",
      name: "deptQuery",
      choices: tempArray,
      message: "Which Employee dept would you like to change?",
    },
    {
      name: "deptName",
      type: "input",
      message: "Which Dept?",
    },
  ];
  inquirer.prompt(deptArray).then((answers) => {
    let itemArray = answers["deptQuery"];
    return (
      itemArray,
      connection.query(
        "INSERT INTO dept SET ?",
        [
          {
            name: answers.deptQuery,
          },
          {
            name: answers.deptName,
          },
        ],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          afterConnection();
        }
      )
    );
  });
}
