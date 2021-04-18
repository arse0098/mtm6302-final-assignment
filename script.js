const $greeting = document.getElementById("greeting");
const $time = document.getElementById("time");
const $ampm = document.getElementById("ampm");

const $settings = document.getElementById("settings");
const $settingsButton = document.getElementById("settingsbutton");
const $setting24h = document.getElementById("setting24h");
const $settingseconds = document.getElementById("settingseconds");

const $more = document.getElementById("more");
const $morebutton = document.getElementById("morebutton");

const $dayofweek = document.getElementById("dayofweek");
const $dayofmonth = document.getElementById("dayofmonth");
const $dayofyear = document.getElementById("dayofyear");
const $weekofyear = document.getElementById("weekofyear");

let format24h = false;
let showSeconds = false;
if (localStorage.length !== 0) {
    format24h = localStorage.getItem("format24h") === "true";
    showSeconds = localStorage.getItem("showSeconds") === "true";

    $setting24h.checked = format24h;
    $settingseconds.checked = showSeconds;
}

function twoDigits(number) {
    if (number < 10) {
        return `0${number}`;
    } else {
        return `${number}`;
    }
}

function getTimeString(currentTime) {
    let hours = currentTime.getHours();
    let am = true;
    if (!format24h && hours > 12) {
        hours -= 12;
        am = false;
    }
    let minutes = currentTime.getMinutes();

    if (showSeconds) {
        let seconds = currentTime.getSeconds();

        if (format24h) {
            $ampm.innerHTML = "";
            return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
        } else {
            $ampm.innerHTML = am ? "AM" : "PM";
            return `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
        }
        
    } else {
    
        if (format24h) {
             $ampm.innerHTML = "";
             return `${twoDigits(hours)}:${twoDigits(minutes)}`;
        } else {
           $ampm.innerHTML = am ? "AM" : "PM";
            return `${hours}:${twoDigits(minutes)}`;
            }
        }
    }

function getGreeting(currentTime) {
    let hours = currentTime.getHours();

    if (hours >= 6 && hours <= 11) {
        return "Good morning!";
    } else if (hours >= 12 && hours <= 18) {
        return "Good afternoon!";
    } else {
        return "Goodnight!";
    }
}

function toggleSettings() {
    $settings.classList.toggle("active");
}

$settingsButton.addEventListener("click", toggleSettings);

function changeSettings() {
    format24h = $setting24h.checked;
    showSeconds = $settingseconds.checked;
    localStorage.setItem("format24h", format24h)
    localStorage.setItem("showSeconds", showSeconds)

    setTime();
}

$setting24h.addEventListener("change", changeSettings);
$settingseconds.addEventListener("change", changeSettings);

function getAPOD() {
    fetch("https://api.nasa.gov/planetary/apod?api_key=oCAm6enYHOigrtIvqc3L9dAhw5dSzDU12KH0oM7h")
    .then(response => response.json())
    .then(data => {
        let imageUrl = data.url;
        document.body.style.backgroundImage = `url(${imageUrl})`;
    });
}

getAPOD();

function toggleMore() {
    $more.classList.toggle("active");
}

$morebutton.addEventListener("click", toggleMore);

const dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDayString(currentTime) {
    const dayIndex = currentTime.getDay();
    
    return dayStrings[dayIndex];
}

function setMoreDetails(currentTime) {
    let startOfYear = new Date(currentTime.getFullYear(), 0)

    let msSinceStartOfYear = currentTime - startOfYear;
    let days = msSinceStartOfYear / 1000 / 60 /60/24;
    let weeks = days / 7;

    let startOfMonth = new Date(currentTime.getFullYear(), currentTime.getMonth());
    let msSinceStartOfMonth = currentTime - startOfMonth;
    let daysThisMonth = msSinceStartOfMonth / 1000 / 60 / 60 / 24;

    $dayofweek.innerHTML = getDayString(currentTime);
    $dayofmonth.innerHTML = Math.floor(daysThisMonth) + 1;
    $dayofyear.innerHTML = Math.floor(days) +1;
    $weekofyear.innerHTML = Math.floor(weeks) + 1;
}

function setTime() {
    let currentTime = new Date(Date.now());


    $time.innerHTML = getTimeString(currentTime);
    $greeting.innerHTML = getGreeting(currentTime);
    setMoreDetails(currentTime);
}

setInterval(setTime, 1000);
setTime();