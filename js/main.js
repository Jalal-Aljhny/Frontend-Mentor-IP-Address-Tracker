let myInput = document.getElementsByTagName("input")[0];
let placeH = myInput.getAttribute("placeholder");
let ipP = document.getElementById("ip");
let LocationP = document.getElementById("Location");
let timezoneP = document.getElementById("timezone");
let ISP = document.getElementById("ISP");
let myBtn = document.querySelector("body header form div");
const ipRegex =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
let markers = [];
//check local storage
if (
  window.localStorage.getItem("lat") != null &&
  window.localStorage.getItem("lng") != null
) {
  var myMap = L.map("map").setView(
    [window.localStorage.getItem("lat"), window.localStorage.getItem("lng")],
    13
  );
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(myMap);
  var marker = L.marker([
    window.localStorage.getItem("lat"),
    window.localStorage.getItem("lng"),
  ]).addTo(myMap);
  ipP.textContent = window.localStorage.getItem("ip");
  ISP.textContent = window.localStorage.getItem("isp");
  LocationP.textContent = window.localStorage.getItem("location");
  timezoneP.textContent = window.localStorage.getItem("timezone");
}
// remove place holder when click
myInput.addEventListener("focus", () => {
  myInput.setAttribute("placeholder", "");
});
myInput.addEventListener("blur", () => {
  myInput.setAttribute("placeholder", placeH);
});
//function to fetch api and set data in fields
async function getLocation(ip) {
  const baseURL =
    " https://geo.ipify.org/api/v2/country,city?apiKey=at_Kuk4GtbCYTaUvukfmjvm6uxL0v27k&ipAddress=";
  const apiURL = baseURL + ip;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log(data);

    ISP.textContent = data.isp;
    LocationP.textContent = data.location.region;
    timezoneP.textContent = data.location.timezone;
    ipP.textContent = ip;
    window.localStorage.setItem("isp", data.isp);
    window.localStorage.setItem("location", data.location.region);
    window.localStorage.setItem("timezone", data.location.timezone);
    window.localStorage.setItem("ip", ip);
    const lat = data.location.lat;
    const lng = data.location.lng;
    window.localStorage.setItem("lat", lat);
    window.localStorage.setItem("lng", lng);
    try {
      var myMap = L.map("map").setView([lat, lng], 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(myMap);
      var marker = L.marker([lat, lng]).addTo(myMap);
    } catch {
      window.location.reload();
    }
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}
myBtn.addEventListener("click", () => {
  if (myInput.value != "" && ipRegex.test(myInput.value)) {
    try {
      getLocation(myInput.value);
    } catch (error) {
      console.error(error);
    }
  }
});
document.forms[0].addEventListener("submit", (e) => {
  e.preventDefault();
  if (myInput.value != "" && ipRegex.test(myInput.value)) {
    try {
      getLocation(myInput.value);
    } catch (error) {
      console.error(error);
    }
  }
});
function onMapDblClick(e) {
  var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(myMap);
}
myMap.on("dblclick", onMapDblClick);
