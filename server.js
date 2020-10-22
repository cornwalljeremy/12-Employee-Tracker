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
  connection.query("SELECT * FROM employee ", function (err, res) {
    if (err) throw err;
    console.table(res);
    afterConnection();
  });
}
function viewRole() {
  connection.query("SELECT * FROM employee_DB.role;", function (err, res) {
    if (err) throw err;
    console.table(res);
    afterConnection();
  });
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
          "Drums",
          "Lead Guitar/VOX",
          "Bass/Guitar/Piano/VOX",
          "Guitar/VOX",
          "none of the options",
        ],
        message: "What do they do?",
      },
    ])
    .then((newEmployee) => {
      const letterToNumb = role_id;
      if(newEmployee === 'manager'){
        letterToNumb = 1;
      } else if {
        (newEmployee === 'Assistant Manager'){
          letterToNumb = 2;
        }
      } else if {

      }
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: newEmployee.firstNewEmploy,
          last_name: newEmployee.lastNewEmploy,
          role_id: newEmployee.newRole,
        },
        function (err, res) {
          if (err) throw err;
          console.table(res);
          afterConnection();
        }
      );
    });
}
function changeDept() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "deptQuery",
        choices: [
          "Jeremy Cornwall",
          "George Cornwall",
          "Ringo Starr",
          "George Harrison",
          "Paul McCartney",
          "John Lennon",
        ],
        message: "Which Employee dept would you like to change?",
      },
      {
        name: "deptName",
        type: "input",
        message: "Which Dept?",
      },
    ])
    .then((answers) => {
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
      );
    });
}
