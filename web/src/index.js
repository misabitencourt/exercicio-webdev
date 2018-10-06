import backendTest from './backend-test.js';
import {filter,addButton,table,fetchJson,rowtoJson,sendRequest,addForm} from './functions.js';

export default element => {
    window.onkeypress= (e)=>{
       if(e.key == "Enter"){
           document.getElementsByTagName('button')[0].onclick();
       }
    }
    element.appendChild(filter());
    element.appendChild(table());
    element.appendChild(addForm());
    element.appendChild(addButton());
}
