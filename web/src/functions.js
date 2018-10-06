export function table(){
    table = document.createElement('table');
    table.appendChild(tableHeaders());
    table.appendChild(tableContent());
    return table;
}
function tableHeaders(){
    tableHeaders = document.createElement('thead');
    fetchJson("selecao-info.php").then(
        data=>{
            data.forEach( position=>{
                    let header = document.createElement('th');
                    header.innerText = position;
                    tableHeaders.appendChild(header);
                }
            )
            let actions = document.createElement('th');
            actions.innerHTML= ""
            tableHeaders.appendChild(actions);
        }
    )
    return tableHeaders;
}
function tableContent(){
    tableContent = document.createElement('tbody');
    fetchJson("selecao-list.php").then(data => {
       data.forEach(position => {
           let tableRow = document.createElement('tr');
           for(let value in position ){
               let cell = document.createElement('td');
               cell.innerText = position[value];
               cell.contentEditable = true;
               cell.onblur = function(){
                    sendRequest(rowtoJson(deleteButton.parentElement),"selecao-update.php")
               }
               tableRow.appendChild(cell);
           }
           let deleteButton = document.createElement('td');
           deleteButton.innerHTML="<i class='fas fa-minus-circle zoomFont'></i>"
           deleteButton.onclick = function(){
                sendRequest(rowtoJson(deleteButton.parentElement),"selecao-delete.php")
                tableContent.removeChild(deleteButton.parentElement);
           }
           tableRow.appendChild(deleteButton)
           tableContent.appendChild(tableRow);
       });
    }
    );
    return tableContent;
}
export async function fetchJson(file){
    let response = await fetch('/backend/'+file);
    let data = await response.json();
    return data;
}
export function rowtoJson(row){
    let obj = {};
    for( let i = 0 ; i< row.cells.length-1 ; i++){
        if(row.cells[i].innerText != "" && row.cells[i].innerText != "\n"){
            obj[document.getElementsByTagName('thead')[0].childNodes[i].innerText.toLowerCase()] = row.cells[i].innerText.replace('\n','');
        }
        else{
            obj[document.getElementsByTagName('thead')[0].childNodes[i].innerText.toLowerCase()] = null;
        }
    }
    return JSON.stringify(obj);
}
export async function sendRequest(json,file){
    console.log(json);
  
    var myRequest = new Request('/backend/'+ file ,
    {
        method: 'post',
        body: json,
        headers: {
            'Content-Type': 'text/json'
        }
    }
    );
    let response = await fetch(myRequest);
    let data = await response.json();
    if(data['err'] != undefined){
        window.alert(data['err']);
        location.reload();
    } 

    return data;
}
export function addForm(){
    let div = document.createElement('div');
    let formTitle = document.createElement('h3');
    formTitle.align = "center";
    formTitle.innerText = "Formulario de Adesão"
    let form = document.createElement('form');
    div.appendChild(formTitle)
    div.appendChild(form)
    fetchJson("selecao-info.php").then(
        data=>{
            data.forEach( position=>{
                    if( position == "_id") return;
                    let input = document.createElement('input');
                    input.name = position;
                    input.placeholder = position.charAt(0).toUpperCase() + position.slice(1);;
                    input.required = true;
                    form.appendChild(input);
                }
            )
        }
       
    )
    return div;
}
export function formtoJson(form){
    let obj = {};
    for( let i = 0 ; i< form.length ; i++){
            console.log(form[i].value);
            obj[form[i].placeholder.toLowerCase()] = form[i].value;
    }
    return JSON.stringify(obj);
}
export function addButton(){
    let button = document.createElement('button');
    button.innerText = "Adicionar";
    button.className = "zoom";
    button.style = " --zoomSize : 1.2 "
    button.onclick = function(){
        sendRequest(formtoJson(document.getElementsByTagName('form')[0]),"selecao-insert.php").then( done=>location.reload());  
    } 
    button.type = "submit";
    return button;
}
export function filter(){
    let filter = document.createElement('input');
    filter.placeholder = "Filtro";
    filter.id = "filtro"
    filter.oninput = function (e){
        let text = e.target.value;
        let table = document.getElementsByTagName('tbody')[0]
        let rows = table.children;
        for(let i = 0 ; i<rows.length ;i++){
           let find = false;
           for(let j = 0 ; j<rows[i].children.length; j++ ){
               if(rows[i].children[j].innerText.toLowerCase().indexOf(text.toLowerCase()) != -1){
                    find = true;
                    break;
                   
               }
           }
           if(!find){
               rows[i].hidden = true;
           }else{
               rows[i].hidden = false;
           }
        }
    }
    return filter;
}
