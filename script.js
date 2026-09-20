const taskForm = document.getElementById("taskForm");

const taskList = document.getElementById("taskList");

const statusFilter = document.getElementById("statusFilter");

const categoryFilter = document.getElementById("categoryFilter");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


function saveTasks() {

    localStorage.setItem("tasks",
        JSON.stringify(tasks)
    );

}

function checkOverdue() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    tasks.forEach(function (task) {

        const deadline =
            new Date(task.deadline + "T00:00:00");


        if (
            deadline < today &&
            task.status !== "Completed"
        ) {

            task.status = "Overdue";

        }

    });


    saveTasks();

}

function displayTasks() {

    taskList.innerHTML = "";


    const selectedStatus =
        statusFilter.value;

    const selectedCategory =
        categoryFilter.value;

    const filteredTasks =
        tasks.filter(function (task) {

            const matchesStatus =
                selectedStatus === "All" ||
                task.status === selectedStatus;


            const matchesCategory =
                selectedCategory === "All" ||
                task.category === selectedCategory;


            return matchesStatus && matchesCategory;

        });

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center">
          Job Applications
        </td>
      </tr>
    `;

        return;

    }


    filteredTasks.forEach(function (task) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

      <td>
        ${task.name}
      </td>

      <td>
        ${task.category}
      </td>

      <td>
        ${task.deadline}
      </td>

      <td>

        <select
          class="form-select"
          onchange="updateStatus(${task.id}, this.value)"
        >

          <option
            value="In Progress"
            ${task.status === "In Progress" ? "selected" : ""}
          >
            In Progress
          </option>

          <option
            value="Completed"
            ${task.status === "Completed" ? "selected" : ""}
          >
            Completed
          </option>

          <option
            value="Overdue"
            ${task.status === "Overdue" ? "selected" : ""}
          >
            Overdue
          </option>

        </select>

      </td>

      <td>

        <button
          class="btn btn-danger btn-sm"
          onclick="deleteTask(${task.id})"
        >
          Delete
        </button>

      </td>

    `;


        taskList.appendChild(row);

    });

}


taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const taskName =
            document.getElementById("taskName").value;

        const category =
            document.getElementById("category").value;

        const deadline =
            document.getElementById("deadline").value;

        const status =
            document.getElementById("status").value;


        const newTask = {

            id: Date.now(),

            name: taskName,

            category: category,

            deadline: deadline,

            status: status

        };


        tasks.push(newTask);


        saveTasks();


        checkOverdue();


        displayTasks();


        taskForm.reset();

    }
);


function updateStatus(id, newStatus) {

    const task =
        tasks.find(function (task) {

            return task.id === id;

        });


    if (task) {

        task.status = newStatus;

        saveTasks();

        checkOverdue();

        displayTasks();

    }

}


function deleteTask(id) {

    tasks =
        tasks.filter(function (task) {

            return task.id !== id;

        });


    saveTasks();

    displayTasks();

}


statusFilter.addEventListener(
    "change",
    displayTasks
);


categoryFilter.addEventListener(
    "change",
    displayTasks
);


checkOverdue();

displayTasks();
