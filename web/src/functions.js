export function table(){
    table = document.createElement('table');
    table.appendChild(tableHeaders());
    table.appendChild(tableContent());
    return table;
}
function tableHeaders(){
    tableHeaders = document.createElement('thead');
    fetchJson("selecao-info.php").then( 
        data => {
            data.forEach( 
                position => {
                    let header = document.createElement('th');
                    header.innerText = position;
                    tableHeaders.appendChild(header);
                }
            )
            tableHeaders.appendChild(document.createElement('th'));
        }
    )
    return tableHeaders;
}
function tableContent(){
    tableContent = document.createElement('tbody');
    fetchJson("selecao-list.php").then(
        data => {
            data.forEach(json => {
                tableContent.appendChild(tableRow(json));
                }
            );
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
    let tableHeaders = document.getElementsByTagName('thead')[0].childNodes;
    for( let i = 0 ; i< row.cells.length-1 ; i++){
        if(row.cells[i].innerText != "" && row.cells[i].innerText != "\n"){
            obj[tableHeaders[i].innerText.toLowerCase()] = row.cells[i].innerText.replace('\n','');
        }
        else{
            obj[tableHeaders[i].innerText.toLowerCase()] = null;
        }
    }
    return JSON.stringify(obj);
}
export async function sendRequest(json,file){
    let request = new Request('/backend/'+ file ,
        {
            method: 'post',
            body: json,
            headers: {
                'Content-Type': 'text/json'
            }
        }
    );
    let response = await fetch(request);
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
        data => {
            data.forEach( value => {
                if( value == "_id") return;
                form.appendChild(formInput(value));
                }
            )
        }
    )
    return div;
}
export function formToJson(form){
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
        sendRequest(formToJson(document.getElementsByTagName('form')[0]),"selecao-insert.php").then( done=>location.reload());  
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
function cell(value){
    let cell = document.createElement('td');
    cell.innerText = value;
    cell.contentEditable = true;
    cell.onblur = function(){
        sendRequest(rowtoJson(this.parentElement),"selecao-update.php")
    }
    return cell;
}
function deleteButton(){
    let deleteButton = document.createElement('td');
    deleteButton.innerHTML="<i class='fas fa-minus-circle zoomFont'></i>"
    deleteButton.onclick = function(){
            sendRequest(rowtoJson(deleteButton.parentElement),"selecao-delete.php")
            tableContent.removeChild(deleteButton.parentElement);
    }
    return deleteButton;
}
function tableRow(json){
    let tableRow = document.createElement('tr');
    for(let value in json ){
        tableRow.appendChild(cell(json[value]));
    }
    tableRow.appendChild(deleteButton())
    return tableRow;
}
function formInput(value){
    let input = document.createElement('input');
    input.name = value;
    input.placeholder = value.charAt(0).toUpperCase() + value.slice(1);;
    input.required = true;
    return input;
}