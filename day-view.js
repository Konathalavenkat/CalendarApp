import {hourgenerator,create,dateformat,pad,getIndex} from './utils.js';

class Day {
    constructor(date) {
        this.date = new Date(date);
        this.format =  dateformat(this.date)
        if(!Day.objectMap){
            Day.objectMap = {};
        }
        if(!Day.objectMap[this.format]){
            Day.objectMap[this.format] = this
            this.Events = this.getEventJson();
            this.elements = {};
            this.NoOfEvents = Array(49).fill(0);
            this.updateNoofEvents();
            this.rendered = false;
        }
        return Day.objectMap[this.format];
    }
    getEventJson(){
        const data = localStorage.getItem(this.format);
        if(data){
            try{
                return JSON.parse(data);
            }
            catch(e){
                return {}
            }
        }
        return {}
    }
    updateNoofEvents(){
        this.NoOfEvents.fill(0);
        const events = [];
        for (const key in this.Events){
            events.push([1,this.Events[key].startTime,this.Events[key],key])
            events.push([0,this.Events[key].endTime,this.Events[key],key])
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
                this.NoOfEvents[getIndex(event[1])] -= 1;
            }
            else{
                this.NoOfEvents[getIndex(event[1])] += 1;
            }
        }
        for(let i = 1;i<49;i++){
            this.NoOfEvents[i]+=this.NoOfEvents[i-1];
        }
    }
    renderEvents(){
        this.updateNoofEvents();
        for(const hour of hourgenerator()){
            this.elements[hour].innerHTML = ''
        }
        const events = [];
        for (const key in this.Events){
            events.push([1,this.Events[key].startTime,this.Events[key],key])
            events.push([0,this.Events[key].endTime,this.Events[key],key])
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
        const availableevents = [null,null,null,null];
        const slotstaken = {};
        for(const event of events){
            let curr = 0;
            if(event[0] === 0){
                availableevents[slotstaken[event[3]]] = null;
            }
            else{
                let maxevents = 1;
                const {name,startTime,endTime} = event[2];
                for(let ind = getIndex(startTime);ind<getIndex(endTime);ind++){
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
                const eventitem = create('div',{classList: ["eventitem"],innerHTML: `<p>${name}</p><p>${startTime+'-'+endTime}</p>`,draggable:true},{id:event[3],name,startTime,endTime,date:this.format});
                eventitem.addEventListener('dragstart',function(event){
                    eventitem.classList.add('dragging');
                })
                eventitem.addEventListener('dragend',function(event){
                    eventitem.classList.remove('dragging');
                })
                let slots = 0;
                const [starthour,startminute,endhour,endminute] = [Number(startTime.substring(0,2)),Number(startTime.substring(3,5)),Number(endTime.substring(0,2)),Number(endTime.substring(3,5))]
                slots += (endhour-starthour)*2
                if(startminute>endminute){
                    slots-=1;
                }
                else if(endminute>startminute){
                    slots+=1;
                }
                eventitem.style.height = `${slots*60-12}px`;
                eventitem.style.left = `${(100/maxevents)*(curr-1)}%`;
                eventitem.style.width = `calc(${100/maxevents}% - 15px)`;
                eventitem.style.zIndex = curr*5;
                this.elements[startTime].append(eventitem);
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
        this.rendered = true;
        this.renderEvents();
        return fragment;
        
    }
    getEvents(){
        return this.Events;
    }
    addEvent(name,startTime,endTime){
        for(let ind=getIndex(startTime);ind<getIndex(endTime);ind++){
            if(this.NoOfEvents[ind]>=4){
                alert("More than 4 Events are Conflicting.")
                return false;
            }
        }
        for(let ind=getIndex(startTime);ind<getIndex(endTime);ind++){
            this.NoOfEvents[ind]+=1;
        }
        this.Events[Date.now()]= {name,startTime,endTime}; 
        localStorage.setItem(this.format,JSON.stringify(this.Events));
        if(this.rendered) this.renderEvents();
        return true;
    }
    scrolltoview(hour,minute){
        minute=Math.floor(minute/30) * 30;
        this.elements[pad(hour)+':'+pad(minute)].scrollIntoView({block: 'center'});
    }
    deleteEvent(eventid){
        delete this.Events[eventid];
        localStorage.setItem(this.format,JSON.stringify(this.Events));
        if(this.rendered) this.renderEvents();
    }
    editEvent(newName,newDate,newStartTime,newEndTime,eventid){
        const EventDate = new Day(newDate);
        const response = EventDate.addEvent(newName,newStartTime,newEndTime);
        if(response) this.deleteEvent(eventid);
    }

}

export default Day;