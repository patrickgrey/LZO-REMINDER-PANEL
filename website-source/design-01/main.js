(function () {

  // Get data from page to model? Maybe as can then check
  // Model against incoming data?
  // What is the simplest solution??
  //    No model, just update the page when data received.
  //    https://github.com/thoov/mock-socket

  const reminderWebSocket = `wss://learningzonetest.eurocontrol.int/ilp/customs/Reports/UsingWebSockets/WebSocketsServer.ashx`;
  const reminderAPI = ``;
  let firstDataLoaded = false;

  const svg1 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)");
  const svg2 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)");
  const lzoReminders = document.querySelector("#lzoReminders");
  const lzoLoading = document.querySelector("#lzoLoading");
  const lzoNoReminders = document.querySelector("#lzoNoReminders");
  const isDev = document
    .querySelector(".lzo-panel-reminder")
    .dataset
    .isDev;

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
        buttons.style.top = "0.5rem";
        buttons.style.right = "1rem";
        buttons.style.marginTop = "0";
      }
      else {
        buttons.style.position = "relative";
        buttons.style.marginTop = "0.5rem";
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
    console.log("updateUI: ", data);

    lzoLoading.style.display = "none";
    lzoNoReminders.style.display = "none";
    lzoReminders.classList.add("lzo-list-hide");

    if (data.length === 0) {
      document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)").style.display = "none";
      lzoNoReminders.style.display = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)").style.display = "inline-block";
      return;
    }
    else {
      document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)").style.display = "none";
      document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)").style.display = "inline-block";
    }

    await asyncTimeout(110);
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

    if (!firstDataLoaded && !isDev) {
      firstDataLoaded = true;
      initWebSocket();
    }
  }

  const asyncTimeout = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  async function loadData(devURL) {
    console.log("devURL: ", devURL);

    const errorLabel = document.querySelector("#lzoErrorFeedback");
    const url = isDev ? devURL : reminderAPI;
    try {
      const response = await fetch(url,
        {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
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
      loadData("./data/reminders-2.json");
    }
    else {
      const reminderSocket = new WebSocket(reminderWebSocket, "json");

      console.log("reminderSocket.readyState: ", reminderSocket.readyState);

      reminderSocket.addEventListener('open', (event) => {
        console.log("cocket open:", reminderSocket.readyState);
      });

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



  async function init() {
    if (isDev) {
      await asyncTimeout(500);
      // loadData("./data/reminders-empty.json");
      // loadData("./data/reminders.json");
      await asyncTimeout(500);
      initWebSocket();
    }
    else {
      loadData();
    }
  }

  init();

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
