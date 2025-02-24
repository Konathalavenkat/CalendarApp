import { DayView } from "./index.js";
import { create,months,dateformat } from "./utils.js";
import Day from "./day-view.js";
export default class Month{
    constructor(date){
        this.date = new Date(date);
        this.month = this.date.getMonth();
        this.year = this.date.getFullYear();
        this.noofdays = new Date(this.year,this.month+1,0).getDate();
    }
    render(){
        const fragement = document.createDocumentFragment();
        const heading = create('h1',{innerText:`${months[this.month]} ${this.year}`})
        fragement.append(heading);
        const container = create('div',{classList:['monthview']})
        const emptydivs = new Date(this.year,this.month,1).getDay();
        for(let i=0;i<emptydivs;i++){
            container.append(create('div',{classList:['monthview__dayitem']}));
        }
        const currday = new Date(this.year,this.month,1);
        for(let day=1;day<=this.noofdays;day++){
            const dayobj = new Day(currday);
            const events = dayobj.getEventJson();
            const dayitem = create('div',{classList:['monthview__dayitem']},{date:currday.toDateString()});
            if(dateformat(currday) === dateformat(new Date())){
                dayitem.classList.add('monthview__dayitem--today')
            }
            const dayheading = create('h3',{classList:['dayheading'],innerText:dateformat(currday)});
            dayitem.append(dayheading);
            let cnt = 0;
            for(const key in events){
                const eventitem = create('div',{classList: ['month_day_item'],innerHTML:`${events[key].name}<br>${events[key].startTime}-${events[key].endTime}`});
                dayitem.append(eventitem);
            }
            dayitem.addEventListener('click',(event)=>{document.getElementById('view-selector').value='day';DayView(dayitem.getAttribute('date'))});
            container.append(dayitem);
            currday.setDate(currday.getDate()+1);
        }
        fragement.append(container)
        return fragement;
    }
}