let hasReminders = true;

const svg1 = document.querySelector(".lzo-container h2 svg:nth-child(1)");
const svg2 = document.querySelector(".lzo-container h2 svg:nth-child(2)");
const ecReminders = document.querySelector("#lzoReminders");
const ecNoReminders = document.querySelector("#lzoNoReminders");


document.querySelector("#lzoAddReminders").addEventListener("click", function (event) {
  hasReminders = !hasReminders;
  svg1.style.display = hasReminders ? "inline-block" : "none";
  svg2.style.display = !hasReminders ? "inline-block" : "none";
  ecReminders.style.display = hasReminders ? "block" : "none";
  ecNoReminders.style.display = !hasReminders ? "block" : "none";
})
