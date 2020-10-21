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
          "Update Dept",
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
function addDept() {
  inquirer
    .prompt([
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
