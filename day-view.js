import {hourgenerator,create,dateformat,pad} from './utils.js';

class Day {
    constructor(date) {
        this.date = new Date(date);
        this.format =  dateformat(this.date)
        if(!Day.map){
            Day.map = {};
        }
        if(!Day.map[this.format]){
            Day.map[this.format] = this
            this.Events = this.getEventJson();
            this.elements = {};
            this.NoOfEvents = Array(49).fill(0);
        }
        return Day.map[this.format];
    }
    getEventJson(){
        const data = localStorage.getItem(this.format);
        if(data){
            try{
                return JSON.parse(data);
            }
            catch(e){
                console.log(e);
                return {}
            }
        }
        return {}
    }
    getIndex(time){
        return Number(time.substring(0,2))*2 + Number(time.substring(3,5))/30;
    }
    renderEvents(){
        for(const hour of hourgenerator()){
            this.elements[hour].innerHTML = ''
        }
        this.NoOfEvents.fill(0);
        const events = [];
        for (const key in this.Events){
            events.push([1,this.Events[key].starttime,this.Events[key],key])
            events.push([0,this.Events[key].endtime,this.Events[key],key])
        }
        events.sort((x,y)=>{
            if(x[1]!=y[1]){
                return x[1].localeCompare(y[1]);
            }
            if(x[0]!=y[0]){
                return x[0]-y[0]; 
            }
            return 0;
        })
        for(const event of events){
            if(event[0]==0){
                this.NoOfEvents[this.getIndex(event[1])] -= 1;
            }
            else{
                this.NoOfEvents[this.getIndex(event[1])] += 1;
            }
        }
        for(let i = 1;i<49;i++){
            this.NoOfEvents[i]+=this.NoOfEvents[i-1];
        }
        const availableevents = [null,null,null,null];
        const slotstaken = {};
        for(const event of events){
            let curr = 0;
            console.log(event[0],event[1],availableevents);
            if(event[0] === 0){
                availableevents[slotstaken[event[3]]] = null;
            }
            else{
                let maxevents = 1;
                const {name,starttime,endtime} = event[2];
                for(let ind = this.getIndex(starttime);ind<this.getIndex(endtime);ind++){
                    maxevents = Math.max(maxevents,this.NoOfEvents[ind]);
                }
                for(let ind = 0;ind<4;ind++){
                    if(!availableevents[ind]){
                        availableevents[ind] = maxevents;
                        slotstaken[event[3]] = ind;
                        curr = ind + 1
                        break;
                    }
                }
                for(let ind=0;ind<4;ind++){
                    if(availableevents[ind]) maxevents = Math.max(maxevents,availableevents[ind]);
                }
                const eventitem = create('div',{classList: ["eventitem"],innerHTML: `<p>${name}</p><p>${starttime+'-'+endtime}</p>`});
                let slots = 0;
                const [starthour,startminute,endhour,endminute] = [Number(starttime.substring(0,2)),Number(starttime.substring(3,5)),Number(endtime.substring(0,2)),Number(endtime.substring(3,5))]
                slots += (endhour-starthour)*2
                if(startminute>endminute){
                    slots-=1;
                }
                else if(endminute>startminute){
                    slots+=1;
                }
                // if(maxevents == 3) maxevents =4;
                console.log(starttime,endtime,curr,maxevents);
                eventitem.style.height = `${slots*60-12}px`;
                eventitem.style.left = `${(100/maxevents)*(curr-1)}%`;
                eventitem.style.width = `calc(${100/maxevents}% - 10px)`;
                eventitem.style.zIndex = curr*5;
                // console.log(event[1],curr,eventitem.style.height,eventitem.style.left,eventitem.style.width)
                this.elements[starttime].append(eventitem);
            }
            
        }
    }
    render(){ 
        const fragment = document.createDocumentFragment();
        const heading = create('div',{classList : ["date"], innerHTML: this.format})
        fragment.appendChild(heading);
        for(const time of hourgenerator()){
            const timeitem = create('div',{classList: ["halfhour"] , id: this.format+time},{date: this.format, time})
            this.elements[time] = timeitem;
            fragment.append(timeitem);
        }
        this.renderEvents();
        return fragment;
        
    }
    getEvents(){
        return this.Events;
    }
    addEvent(name,starttime,endtime){
        for(let ind=this.getIndex(starttime);ind<this.getIndex(endtime);ind++){
            if(this.NoOfEvents[ind]>=4){
                alert("More than 4 Events are Conflicting.")
                return;
            }
        }
        this.Events[Date.now()]= {name,starttime,endtime}; 
        localStorage.setItem(this.format,JSON.stringify(this.Events));
        this.renderEvents();
    }
    scrolltoview(hour,minute){
        
        minute=Math.floor(minute/30) * 30;
        console.log(pad(hour)+":"+pad(minute));
        this.elements[pad(hour)+':'+pad(minute)].scrollIntoView({block: 'center'});
    }

}

export default Day;