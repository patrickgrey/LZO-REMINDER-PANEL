(function () {

  let hasReminders = true;

  const svg1 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)");
  const svg2 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)");
  const ecReminders = document.querySelector("#lzoReminders");
  const ecNoReminders = document.querySelector("#lzoNoReminders");

  function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  function positionButtons() {
    document.querySelectorAll("#lzoReminders > li").forEach(li => {
      const title = li.querySelector("details, h3");
      const buttons = li.querySelector(".lzo-bottom-container");
      // console.log("li: ", li.clientWidth);
      // console.log("title: ", title.clientWidth);
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


  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  const handleResize = debounce((event) => {
    positionButtons();
  }, 20);

  window.addEventListener('resize', handleResize);


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

  document.querySelectorAll(".lzo-button-guidance").forEach(button => {
    button.addEventListener("click", function (event) {
      const li = button.closest("li");
      const guidance = li.querySelector(".lzo-guidance");
      const isBlock = guidance.style.display === "block"
      guidance.style.display = isBlock ? "none" : "block";
    });
  });



})();
