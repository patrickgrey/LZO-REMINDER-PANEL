(function () {

  // Get data from page to model? Maybe as can then check
  // Model against incoming data?
  // What is the simplest solution??
  //    No model, just update the page when data received.
  //    https://github.com/thoov/mock-socket

  const reminderWebSocket = "wss://learningzone.eurocontrol.int/ilp/customs/Reports/reminderWebSocket";


  const devData = [
    {
      "person_ID": 12345,
      "task_ID": 1,
      "task_priority": "high",
      "task_title": "Course attendance input outstanding a bit longer",
      "task_items": [
        {
          "item_title": "Item detail 1"
        },
        {
          "item_title": "Item detail 2"
        },
        {
          "item_title": "Item detail 3"
        }
      ],
      "task_deadline": "18th Nov 2022",
      "task_guidance": "You need to complete all the fields required for publication, i.e. those needed in the catalogue, and send this course for approval, so it can be added to the catalogue.",
      "task_help_link": "http://localhost:8080/design-01/",
      "task_link": "http://localhost:8080/design-01/"
    },
    {
      "person_ID": 12345,
      "task_ID": 2,
      "task_priority": "medium",
      "task_title": "Course attendance input outstanding",
      "task_items": [],
      "task_deadline": "18th Nov 2022",
      "task_guidance": "You need to complete all the fields required for publication, i.e. those needed in the catalogue.",
      "task_help_link": "",
      "task_link": "http://localhost:8080/design-01/"
    },
    {
      "person_ID": 12345,
      "task_ID": 3,
      "task_priority": "",
      "task_title": "Course attendance input outstanding a bit longer",
      "task_items": [],
      "task_deadline": "18th Nov 2022",
      "task_guidance": "",
      "task_help_link": "http://localhost:8080/design-01/",
      "task_link": "http://localhost:8080/design-01/"
    },
    {
      "person_ID": 12345,
      "task_ID": 4,
      "task_priority": "",
      "task_title": "Course attendance input outstanding very long reminder title very long reminder title very long reminder title very long reminder title title very long reminder title",
      "task_items": [],
      "task_deadline": "",
      "task_guidance": "",
      "task_help_link": "http://localhost:8080/design-01/",
      "task_link": "http://localhost:8080/design-01/"
    }
  ];

  const svg1 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)");
  const svg2 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)");
  const lzoReminders = document.querySelector("#lzoReminders");
  const lzoNoReminders = document.querySelector("#lzoNoReminders");
  const isDev = document.body.dataset.isDev;

  function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  function positionButtons() {
    document.querySelectorAll("#lzoReminders > li").forEach(li => {
      const title = li.querySelector("details, h3");
      const buttons = li.querySelector(".lzo-bottom-container");
      if ((title.clientWidth + buttons.clientWidth + convertRemToPixels(7) < li.clientWidth) && window.innerWidth > 800) {
        buttons.style.position = "absolute";
        buttons.style.top = "1rem";
        buttons.style.right = "1rem";
        buttons.style.marginTop = "0";
      }
      else {
        buttons.style.position = "relative";
        buttons.style.marginTop = "1rem";
        buttons.style.top = "0";
        buttons.style.right = "0";
      }
    });
  }

  positionButtons();


  const handleResize = debounce((event) => {
    positionButtons();
  }, 20);

  window.addEventListener('resize', handleResize);


  async function updateUI(data) {
    lzoReminders.classList.add("lzo-list-hide");
    await asyncTimeout(110);

    if (data.length === 0) {
      lzoNoReminders.style.display = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)").style.display = "inline-block";
      return;
    }
    document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)").style.display = "inline-block";

    lzoReminders.innerHTML = "";

    const lzoCloneDaddy = document.querySelector("#lzoCloneDaddy");

    for (let index = 0; index < data.length; index++) {
      const liObject = data[index];
      const clone = lzoCloneDaddy.querySelector("li").cloneNode(true);
      const h3 = clone.querySelector("h3");
      const taskContainer = clone.querySelector(".lzo-task-container");
      const details = clone.querySelector("details");
      const summary = clone.querySelector("summary");
      const taskList = clone.querySelector("details > ul");
      const span = clone.querySelector("h3 > span");
      const deadline = clone.querySelector(".lzo-deadline");
      const buttonGuidance = clone.querySelector(".lzo-button-guidance");
      const guidance = clone.querySelector(".lzo-guidance");
      const buttonHelp = clone.querySelector(".lzo-button-help");
      const buttonTask = clone.querySelector(".lzo-button-tasks");

      clone.dataset.taskId = liObject.task_ID;

      if (liObject.task_priority != "") {
        taskContainer.classList.add(`lzo-priority-${liObject.task_priority}`);
      }

      if (liObject.task_items.length > 0) {
        span.textContent = liObject.task_items.length.toString();
        summary.appendChild(h3);
        for (let indexDetail = 0; indexDetail < liObject.task_items.length; indexDetail++) {
          const li = document.createElement("li");
          li.textContent = liObject.task_items[indexDetail].item_title;
          taskList.appendChild(li);
        }
      }
      else {
        span.textContent = "1";
        details.remove();
      }

      const task_title = document.createTextNode(liObject.task_title);
      h3.appendChild(task_title);
      lzoReminders.appendChild(clone);

      if (liObject.task_deadline != "") {
        const task_deadline = document.createTextNode(liObject.task_deadline);
        deadline.appendChild(task_deadline);
      }
      else {
        deadline.remove();
      }

      if (liObject.task_guidance != "") {
        guidance.textContent = liObject.task_guidance;
      }
      else {
        buttonGuidance.remove();
        guidance.remove();
      }

      if (liObject.task_help_link != "") {
        buttonHelp.href = liObject.task_help_link;
      }
      else {
        buttonHelp.remove();
      }

      if (liObject.task_link != "") {
        buttonTask.href = liObject.task_link;
      }
      else {
        buttonTask.remove();
      }
    }

    positionButtons();

    document.querySelectorAll(".lzo-button-guidance").forEach(button => {
      button.addEventListener("click", function (event) {
        const li = button.closest("li");
        const guidance = li.querySelector(".lzo-guidance");
        const isBlock = guidance.style.display === "block"
        guidance.style.display = isBlock ? "none" : "block";
      });
    });

    await asyncTimeout(300);
    lzoReminders.classList.remove("lzo-list-hide");
  }

  const asyncTimeout = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  async function loadDevData() {
    const errorLabel = document.querySelector("#lzoErrorFeedback");
    try {
      const response = await fetch("./data/reminders.json",
        {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ person_ID: "123" })
        });
      const data = await response.json();
      if (response.ok) {
        updateUI(data);
      }
      else {
        errorLabel.textContent = "Error: " + (data && data.message) || response.status;
        errorLabel.style.display = "block";
      }
    }
    catch (error) {
      errorLabel.textContent = "Error: " + error;
    }
  }

  async function initWebSocket() {
    if (isDev) {
      await asyncTimeout(1500);
      loadDevData();
    }
    else {
      const reminderSocket = new WebSocket(reminderWebSocket, "json");

      reminderSocket.addEventListener('message', (event) => {
        var data = JSON.parse(event.data);
        loadData(data);
      });

      reminderSocket.addEventListener('error', (event) => {
        console.log('WebSocket error: ', event);
      });

      window.onbeforeunload = function () {
        reminderSocket.onclose = function () { }; // disable onclose handler first
        reminderSocket.close();
      };
    }
  }

  initWebSocket();

  // Two options: 
  // 1: web socket sends message to say tasks have been updated
  // then we fetch the data from the API.
  // 2: web socket returns the new data, having called the API itself.
  function initTitle() {
    if (document.querySelector("#lzoReminders").childElementCount
      === 0) {
      lzoNoReminders.style.display = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)").style.display = "inline-block";
    } else {
      document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)").style.display = "inline-block";
    }
  }
  initTitle();

  // DEV ONLY
  let hasReminders = true;

  document.querySelector("#lzoAddReminders")?.addEventListener("click", function (event) {
    hasReminders = !hasReminders;
    svg1.style.display = hasReminders ? "inline-block" : "none";
    svg2.style.display = !hasReminders ? "inline-block" : "none";
    lzoReminders.style.display = hasReminders ? "block" : "none";
    lzoNoReminders.style.display = !hasReminders ? "block" : "none";
  });

  document.querySelector("#lzoToggleStylesheet")?.addEventListener("click", function (event) {
    const lzoGuideCSS = document.querySelector("#lzoGuideCSS");
    console.log(lzoGuideCSS);
    lzoGuideCSS.disabled = !lzoGuideCSS.disabled;
  });



})();
