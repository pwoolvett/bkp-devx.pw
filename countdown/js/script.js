const NUM_2_DAY = {
  5: "friday",
  6: "saturday",
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
}
const DAY_2_NUM = {
  "sunday": 0,
  "monday": 1,
  "tuesday": 2,
  "wednesday": 3,
  "thursday": 4,
  "friday": 5,
  "saturday": 6,
}

function getDayDelta(now, dayStr) {
  let todayNum = now.getDay();
  let dayNum = DAY_2_NUM[dayStr.toLowerCase()];
  let delta = (7 + dayNum - todayNum) % 7;
  return delta;
}

function createEventDay(now, delta) {
  let clone = new Date(now.getTime());
  clone.setDate(clone.getDate() + delta);
  return clone;
}

function createFinalDate(now, delta, hour, minutes) {
  let eventDay = new Date(now.getTime());
  eventDay.setDate(eventDay.getDate() + delta);
  let eventDate = new Date(eventDay.getTime());
  let offset = Math.floor(
    eventDay.getTimezoneOffset() / 60
  );
  let hourDelta = hour + offset;
  // if (hourDelta > 24){
  //   hourDelta -= 24;
  //   eventDate.setDate(eventDate.getDate()-1);
  // }
  eventDate.setUTCHours(hourDelta, minutes, 0, 0);
  if (eventDate-now <0 ){
    eventDate.setDate(eventDate.getDate()+7);
  }
  return eventDate
}

class TimeOver extends Error {
  constructor() {
    super("Time over");
  }
}

function dateDiffToDetailed(a, b) {
  diff = b-a;
  ms = diff % 1000;
  diff = (diff - ms) / 1000
  ss = diff % 60;
  diff = (diff - ss) / 60
  mm = diff % 60;
  diff = (diff - mm) / 60
  hh = diff % 24;
  days = (diff - hh) / 24

  if ([days, hh, mm, ss].every(element => element <= 0)) {
    throw new TimeOver();
  }
  return {
    day: days,
    hour: hh,
    minute: mm,
    second: ss,
  }
}

function  addFadeIn( newDiv, box, speed ) {
  var seconds = speed/1000;
  newDiv.style.opacity = 0;
  
  newDiv.style.transition = `opacity ${seconds}s ease`;
  setTimeout(
    function() {
      box.appendChild(newDiv);
    },
    speed
  );
}

function  removeFadeOut( el, speed ) {
  var seconds = speed/1000;
  el.style.transition = `"opacity ${seconds}s ease`;

  el.style.opacity = 0;
  setTimeout(
    function() {
      let parent = el.parentNode
      if (!parent){
        return
      }
      parent.removeChild(el);
    },
    speed
  );
}

function updateClockWithData(now, eventDate, clock_ids) {
  for (
    let [type, number] of Object.entries(
      dateDiffToDetailed(now, eventDate)
    )
  ) {
    let div = document.getElementById(clock_ids[type])
    if (!div){
      continue
    }
    div.innerHTML = String(number).padStart(2, '0');
  }
}

function addText(box, text){
  const newDiv = document.createElement("div");
  newDiv.setAttribute("class", "clock");
  newDiv.innerHTML = text[0];
  newDiv.style['font-size'] = text[1];
  addFadeIn(newDiv, box, 2000)
}
function finishClock(clock_ids, text) {
  for (
    let id of Object.values(clock_ids)
  ) {
    let div = document.getElementById(id);
    if (!div){
      continue
    }
    div.innerHTML = "0".padStart(2, '0');
  }
  let clock = document.getElementsByClassName("clock")[0];
  addText(clock.parentElement, text);
  removeFadeOut(clock, 2000);
  clearInterval(timer);
  return
}

function lowerVolume(slider){

  slider.value = Math.min(slider.value, 10);
  slider.oninput();
  // youtubePlayer.setVolume(min(youtubePlayer.getVolume(), 10));
}

function updateClock(day, hour, minutes, clock_ids, slider, text) {
  let now = new Date();
  // now.setMinutes(59);
  // now.setSeconds()
  let delta = getDayDelta(now, day);
  // let eventDay = createEventDay(now, delta);
  let eventDate = createFinalDate(now, delta, hour, minutes)

  try {
    updateClockWithData(now, eventDate, clock_ids);
  } catch (e) {
    if (e instanceof TimeOver) {
      finishClock(clock_ids, text);
      lowerVolume(slider);
    } else {
      throw e; // re-throw the error unchanged
    }
  }


}

function setupClock(day, hour, minutes, clock_ids, slider, text) {
  const bound = () => updateClock(day, hour, minutes, clock_ids, slider, text);
  bound();
  return setInterval(bound, 1000);
}

function setupSlider(id, volume) {
  slider = document.getElementById(id);
  slider.oninput = () => {
    try {
      youtubePlayer.setVolume(slider.value)
    }
    catch (e){
      if (e instanceof TypeError) {
        pendingSliderChange = slider.value;
      } else {
        throw e; // re-throw the error unchanged
      }
    }
  };
  slider.value = volume;
  slider.oninput()
  return slider
}

function parseTime(time){
  splat = time.split(":");
  if (splat.length == 1){
    hour = parseInt(time);
    minutes = 0;
  } else {
    hour = parseInt(splat[0]);
    minutes = parseInt(splat[1]);
  }
  return [hour, minutes]
}

function main() {
  const CLOCK_IDS = {
    day: "day",
    hour: "hour",
    minute: "minute",
    second: "second",
  }
  const SLIDER_ID = "volumeControl";

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const day = params.day || "thursday";
  const time = params.time || "19:00";
  const text = params.text || "La sesión comenzará en breve...";
  const textSize = parseInt(params.textSize) || "7vw";
  const volume = parseInt(params.volume) || 50;

  const textData = [text, textSize];

  const [hour, minutes] = parseTime(time);
  slider = setupSlider(SLIDER_ID, volume);
  interval = setupClock(day, hour, minutes, CLOCK_IDS, slider, textData);

  return interval
}

var pendingSliderChange;
var timer = main();
