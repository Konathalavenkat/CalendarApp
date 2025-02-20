export const hourgenerator = function*(){
    for(let i = 0;i<24;i++){
        const prefix = `${i<10 ? '0' : ''}${i}`
        yield prefix+':00'
        yield prefix+':30'
    }
}

export const dateformat = (date) => {
    return `${date.getDate()}-${date.getMonth() < 10? '0' : ''}${date.getMonth()+1}-${date.getFullYear()}`
}

export var create = function(element, properties,attributes) {
    var elmt = document.createElement(element);
    for (var prop in properties) {
        elmt[prop] = properties[prop];
    }
    for(let attribute in attributes){
        const  a = document.createAttribute(attribute);
        a.value = attributes[attribute];
        elmt.setAttributeNode(a);
    }
    return elmt;
}

export var pad = (number) => {
    return (''+number).padStart(2,"0");
}

export var getIndex=(time)=>{
    return Number(time.substring(0,2))*2 + Number(time.substring(3,5))/30;
}

export var indexToTime =(index) => {
    return pad(Math.floor(index/2))+':'+pad(30*(index%2));
}

export var ddmmyyyyToyyyymmdd = (date) => {
    const [year,month,d] = [Number(date.substring(6,10)),Number(date.substring(3,5)),Number(date.substring(0,2))]
    return year+'-'+(''+month).padStart(2,'0')+"-"+(''+d).padStart(2,'0');
}