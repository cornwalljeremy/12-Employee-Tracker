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
          "Add Dept",
          "Add Role",
          "Update Employee Role",
          "Delete Employee",
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
        case "Add Dept":
          addDept();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "Delete Employee":
          removeEmployee();
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
  role.salary,
  employee.manager_id
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
    employee.role_id,
    employee.manager_id
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
  connection.query(`SELECT * FROM role`, function (err, res) {
    if (err) throw err;
    console.table(res);
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
          type: "input",
          name: "newRole",
          message: "What is their role ID?",
        },
        {
          type: "input",
          name: "manDept",
          message: "What is your managers ID? (Management = 1 Band = 2",
        },

        {
          type: "input",
          name: "newJob",
          message: "What is their role with the band?",
        },
      ])
      .then((newEmployee) => {
        // let newEmployee.newRole = 0;
        // if (newEmployee.newRole === "Manager") {
        //   newEmployee.newRole = 1;
        //   afterConnection();
        //   console.log("New Employee added");
        // } else if (newEmployee.newRole === "Assistant Manager") {
        //   newEmployee.newRole = 2;
        //   console.log("New Employee added");
        //   afterConnection();
        // } else if (newEmployee.newRole === "Producer") {
        //   newEmployee.newRole = 7;
        //   console.log("New Employee added");
        //   afterConnection();
        // } else if (newEmployee.newRole === "Band Member") {
        //   newEmployee.newRole = 3;
        //   console.log("New Employee added");
        //   afterConnection();
        // } else if (newEmployee.newRole === "None of the options") {
        //   console.log("No Employee added");
        //   return null;
        //   afterConnection();
        // }
        // if (newEmployee.manDept === true) {
        //   console.log(newEmployee.manDept);
        //   newEmployee.manDept = 1;
        // }
        // newEmployee.manDept = 2;

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
            console.table(res);
            afterConnection();
          }
        );
      });
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
function addDept() {
  inquirer
    .prompt({
      type: "input",
      name: "deptInput",
      message: "What dept are you adding?",
    })
    .then((answers) => {
      connection.query(
        `INSERT INTO dept SET ? `,
        {
          name: answers.deptInput,
        },
        function (err, res) {
          if (err) throw err;
          console.table(res);
          afterConnection();
        }
      );
    });
}
function addRole() {
  connection.query(`SELECT * FROM dept`, function (err, res) {
    if (err) throw err;
    console.table(res);

    inquirer
      .prompt([
        {
          type: "input",
          name: "deptId",
          message: "Which Dept are they in?",
        },
        {
          type: "input",
          name: "roleTitle",
          message: "What is the title of the role?",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "What salary does this role earn?",
        },
      ])
      .then((answers) => {
        connection.query(
          `INSERT INTO role SET ?`,
          {
            dept_id: answers.deptId,
            title: answers.roleTitle,
            salary: answers.roleSalary,
          },
          function (err, res) {
            if (err) throw err;
            console.table(res);
            afterConnection();
          }
        );
      });
  });
}
function removeEmployee() {
  connection.query(
    `SELECT 
  employee.id,
  employee.last_name,
  employee.first_name,
  role.title,
  role.salary,
  employee.manager_id
  FROM employee
  INNER JOIN role
  ON employee.id = role.id
  ORDER BY employee.id; `,
    function (err, res) {
      if (err) throw err;
      console.table(res);

      inquirer
        .prompt({
          type: "input",
          name: "delEmploy",
          message:
            "Please type the ID of the employee you would like to delete.",
        })
        .then((answers) => {
          connection.query(`DELETE FROM employee WHERE id = ${answers.delEmploy};`,function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("You have deleted the employee")
            afterConnection();
          });
        });
    }
  );
}
