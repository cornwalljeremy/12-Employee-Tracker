const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
        case "Update Employee Role":
          updateEmplyRole();
          break;

        default:
          console.log("Thanks For Playing!");
          connection.end();
          break;
      }
    });
};

function viewEmployee() {
  connection.query(
    `SELECT 
    e.id,
    e.first_name,
    e.last_name,
    e.role_id,
    role.title,
    role.salary,
    role.id AS 'The Role',
    CONCAT(manager.first_name," ", manager.last_name) AS mgr,
    dept.name
    FROM employee e
    LEFT JOIN role
    ON role.id = e.role_id
    LEFT JOIN dept
    ON dept.id = role.dept_id
    LEFT JOIN employee AS manager
    ON manager.id = e.manager_id
    ORDER BY e.id; `,
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
    role.id,
    role.title,
    role.salary,
    dept.name
    FROM role
    INNER JOIN dept
    ON role.dept_id = dept.id
    ORDER BY role.id;`,
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
          message: "What is the name of the role?",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < res.length; i++) {
              choiceArray.push(res[i].title);
            }
            return choiceArray;
          },
        },
        {
          type: "input",
          name: "manDept",
          message: "What is your managers ID? (Management = 1 Other = 2",
        },

        
      ])
      .then((newEmployee) => {
        let chosenRole;

        for (let i = 0; i < res.length; i++) {
          if (res[i].title === newEmployee.newRole) {
            chosenRole = res[i];
            // console.log(chosenRole);
          }
        }
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: newEmployee.firstNewEmploy,
            last_name: newEmployee.lastNewEmploy,
            role_id: chosenRole.id,
            manager_id: newEmployee.manDept,
          },

          function (err, res) {
            if (err) throw err;
            // console.table(res);

            afterConnection();
          }
        );
      });
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
          // console.table(res);
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
  employee.role_id,
  role.title,
  role.salary,
  employee.manager_id
  FROM employee
  LEFT JOIN role
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
          connection.query(
            `DELETE FROM employee WHERE id = ${answers.delEmploy};`,
            function (err, res) {
              if (err) throw err;
              console.table(res);
              console.log("You have deleted the employee");
              afterConnection();
            }
          );
        });
    }
  );
}
function updateEmplyRole() {
  connection.query(
    `SELECT 
  e.id,
  CONCAT(e.first_name, " ", e.last_name) AS name,
  role.title,
  role.salary,
  role.id AS 'The Role',
  e.manager_id
  FROM employee e
  LEFT JOIN role
  ON role.id = e.id
  ORDER BY e.id; `,
    function (err, employeeList) {
      if (err) throw err;
      console.table(employeeList);

      inquirer
        .prompt([
          {
            type: "input",
            name: "wichEmploy",
            message: "Which employee would you like to update? ",
            // choices: employeeList
          },
        ])
        .then((employeeChoice) => {
          connection.query(`SELECT id, title AS name FROM role;`, function (
            err,
            roleList
          ) {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "newRole",
                  message: "What is their new role?",
                  choices: roleList,
                },
              ])
              .then((answers) => {
                connection.query(
                  `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = '${answers.newRole}') WHERE id = ${employeeChoice.wichEmploy};`,
                  {
                    id: answers.newRole,
                  },
                  function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    afterConnection();
                  }
                );
              });
          });
        });
    }
  );
}
