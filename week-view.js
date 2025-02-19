import Day from "./day-view.js";
import { create } from "./utils.js";
class Week{
    constructor(date){
        this.date = new Date(date);
        this.date.setDate(this.date.getDate()-this.date.getDay());
        console.log(date);
    }
    render(){
        const weekview = document.createDocumentFragment();
        const maincontainer = create('div',{classList : ['week-view']})
        for(let i = 0;i<7;i++){
            const container = create('div',{classList: ["day-container"]})
            container.appendChild(new Day(this.date).render());
            // console.log(new Day(this.date).render())
            maincontainer.appendChild(container)
            this.date.setDate(this.date.getDate()+1)
        }
        weekview.append(maincontainer);
        return weekview;
    }
}

export default Week;