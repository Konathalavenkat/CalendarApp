import Day from "./day-view.js";
import {hourgenerator,create} from './utils.js';
import Week from "./week-view.js";
const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const sideBar = document.getElementById('sidebar');
const AddEvent = document.getElementById('Add-Event');
const ViewSelector = document.getElementById('view-selector');
const Events = document.getElementById('Events');


let selectedDate = new Date();
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

document.getElementById('hideSideBar').addEventListener('click',hideSideBar);

function renderCalendar(month, year) {
    const calendarFragment = document.createDocumentFragment();
    monthYear.textContent = `${months[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      calendarFragment.appendChild(blank);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement('div');
      day.setAttribute('date',`${year}-${(''+(month+1)).padStart(2,'0')}-${i}`);
      day.textContent = i;
      day.addEventListener('click',function(event){
        selectedDate = new Date(day.getAttribute('date'));
        Render()
      })
      if(new Date(day.getAttribute('date')).toDateString().split("T+")[0] === new Date().toDateString().split("T+")[0]){
        day.className = 'TodayDate';
      }
      calendarFragment.appendChild(day);
    }
    calendarDates.innerHTML = '';
    calendarDates.appendChild(calendarFragment);
  }

renderCalendar(currentMonth, currentYear);

prevMonthBtn.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

function hideSideBar(){
  if(sideBar.style.display == "none"){
    sideBar.style.display = 'block';
  }
  else{
    sideBar.style.display = "none"
  }
}

function createPopUp(name,date,time){
  const container = create('div',{classList: ['popup-container']});
  const popupelement = create('div',{classList: ['popup']});
  const label_eventnameinput = create('label',{for: "popupinput",innerHTML: "Enter Event Name<br>"});
  const eventnameinput = create('input',{classList: ['popupinput'],id: "popupinput"});
  if(name){
    eventnameinput.value = name;
  }
  const label_dateinput = create('label',{for: "inputdate",innerHTML: "Enter Date of the Event<br>"});
  const dateinput = create('input',{type: 'date', name:"inputdate", id: "inputdate"});
  if(date){
    const [year,month,d] = [Number(date.substring(6,10)),Number(date.substring(3,5)),Number(date.substring(0,2))]
    const formatteddate = year+'-'+(''+month).padStart(2,'0')+"-"+(''+d).padStart(2,'0');
    dateinput.value = formatteddate;
  }
  console.log(dateinput.value)
  const label_starttimeinput = create('label',{for: "inputtime",innerHTML: "Enter Time of the Event<br>"});
  const starttimeinput = create('select',{name:"inputtime",id:"inputtime"});
  starttimeinput.innerHTML += '<option value=""> --Select Time-- </option>'
  for(const time of hourgenerator()){
    starttimeinput.innerHTML += `<option value="${time}"> ${time} </option>`;
  }
  if(time){
    starttimeinput.value = time;
  }
  const label_endtimeinput = create('label',{for: "endtimeinput",innerHTML: "Enter End Time of the Event<br>"});
  const endtimeinput = create('select',{name:"endtimeinput",id:"endtimeinput"});
  endtimeinput.innerHTML += '<option value=""> --Select Time-- </option>'
  for(const time of hourgenerator()){
    endtimeinput.innerHTML += `<option value="${time}"> ${time} </option>`;
  }
  const submit = create('button',{innerHTML: 'submit'});
  const exit = create('div',{innerText:"X",classList:["popup-cross"]});


  popupelement.appendChild(label_eventnameinput);
  popupelement.appendChild(eventnameinput);
  popupelement.appendChild(label_dateinput);
  popupelement.appendChild(dateinput);
  popupelement.appendChild(label_starttimeinput);
  popupelement.appendChild(starttimeinput);
  popupelement.appendChild(label_endtimeinput);
  popupelement.appendChild(endtimeinput);
  popupelement.appendChild(submit);
  popupelement.appendChild(exit);
  container.append(popupelement)
  addElement(container);
  // popupelement.addEventListener('click',(e)=>{
    
  // })
  container.addEventListener('click',(event)=>{
    if(event.target === event.currentTarget) removeElement(container);
  })
  exit.addEventListener('click',()=>{
    removeElement(container);
  })
  submit.addEventListener('click',function(event){
    event.preventDefault();
    const eventname = eventnameinput.value;
    
    const date = dateinput.value;
    
    const time = starttimeinput.value;
    
    const endtime = endtimeinput.value;

    if(!eventname.trim() || !date || !time || !endtime){
      alert("Please Fill all fields");
      return;
    }

    console.log(time.localeCompare(endtime));
    if(time.localeCompare(endtime) >= 0){
      alert("Start Time cannot be after End Time");
      return;
    }

    const DayObject = new Day(date);
    DayObject.addEvent(eventname,time,endtime);
    removeElement(container);
  })
}

Events.addEventListener('click',function(event){
  if(event.target.className === 'halfhour'){
    createPopUp('',event.target.getAttribute('date'),event.target.getAttribute('time'));
  }
})

document.getElementById('switch').addEventListener('change',function(event){
  if(this.checked){
    const root = document.querySelector(':root');
    root.style.setProperty('--bg','rgb(255,255,255)');
    root.style.setProperty('--hover','rgb(200,200,200)');
    root.style.setProperty('--inv','rgb(30,30,30');
    root.style.setProperty('--semi-transparent','rgba(0,0,0,0.4)')
  }
  else{
    const root = document.querySelector(':root');
    root.style.setProperty('--bg','rgb(20,20,20)');
    root.style.setProperty('--hover','rgb(50,50,50)');
    root.style.setProperty('--inv','rgb(255,255,255)');
    root.style.setProperty('--semi-transparent','rgba(125,125,125,0.4');
  }
})

function DayView(date){
  const View = new Day(date);
  document.getElementById('Events').innerHTML = '';
  document.getElementById('Events').append(View.render());
  View.scrolltoview(new Date().getHours(),new Date().getMinutes());
}

function WeekView(date){
  const weekView = new Week(date);
  document.getElementById('Events').innerHTML = '';
  document.getElementById('Events').append(weekView.render());
}

function addElement(ele){
  document.body.appendChild(ele);
}

function removeElement(ele){
  document.body.removeChild(ele);
}

AddEvent.addEventListener('click',function(event){
  createPopUp();
});

function Render(){
  if(ViewSelector.value == 'day'){
    DayView(selectedDate);
  }
  else if(ViewSelector.value == 'week'){
    WeekView(selectedDate);
  }
}

ViewSelector.addEventListener('change',Render);

Render();
