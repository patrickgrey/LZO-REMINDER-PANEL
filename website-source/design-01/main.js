(function () {

  let hasReminders = true;
  console.log("hi")

  const svg1 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(1)");
  const svg2 = document.querySelector(".lzo-panel-reminder h2 svg:nth-child(2)");
  const ecReminders = document.querySelector("#lzoReminders");
  const ecNoReminders = document.querySelector("#lzoNoReminders");


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
