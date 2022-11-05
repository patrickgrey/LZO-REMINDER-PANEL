(function () {

  const svg1 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)");
  const svg2 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)");
  const ecReminders = document.querySelector("#lzoReminders");
  const ecNoReminders = document.querySelector("#lzoNoReminders");
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
      console.log(convertRemToPixels(10));
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

  document.querySelectorAll(".lzo-button-guidance").forEach(button => {
    button.addEventListener("click", function (event) {
      const li = button.closest("li");
      const guidance = li.querySelector(".lzo-guidance");
      const isBlock = guidance.style.display === "block"
      guidance.style.display = isBlock ? "none" : "block";
    });
  });

  function initUI(data) {
    console.log(data);
    if (data.length === 0) {
      ecNoReminders.style.display = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)").style.display = "inline-block";
      return;
    }
    document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)").style.display = "inline-block";

    for (let index = 0; index < data.length; index++) {
      // const liObject = data[index];
      // const li = document.createElement("li");
      // ecReminders.appendChild(li);

      // Clone a hidden object like MUAC CV
    }

  }

  async function loadData(person_ID) {
    const errorLabel = document.querySelector("#lzoErrorFeedback");
    const data = { person_ID };
    const url = isDev ? "./data/reminders.json" : "API here";
    try {
      const response = await fetch(url,
        {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      const responseData = await response.json();
      document.querySelector("#lzoLoading").style.display = "none";
      if (response.ok) {
        initUI(responseData);
      }
      else {
        console.log(response);
        errorLabel.textContent = "Error: " + (responseData && responseData.message) || response.status;
        errorLabel.style.display = "block";
      }
    }
    catch (error) {
      errorLabel.textContent = "Error: " + error;
    }
  }

  loadData();

  // DEV ONLY
  let hasReminders = true;

  document.querySelector("#lzoAddReminders")?.addEventListener("click", function (event) {
    hasReminders = !hasReminders;
    svg1.style.display = hasReminders ? "inline-block" : "none";
    svg2.style.display = !hasReminders ? "inline-block" : "none";
    ecReminders.style.display = hasReminders ? "block" : "none";
    ecNoReminders.style.display = !hasReminders ? "block" : "none";
  });

  document.querySelector("#lzoToggleStylesheet")?.addEventListener("click", function (event) {
    const lzoGuideCSS = document.querySelector("#lzoGuideCSS");
    console.log(lzoGuideCSS);
    lzoGuideCSS.disabled = !lzoGuideCSS.disabled;
  });



})();
