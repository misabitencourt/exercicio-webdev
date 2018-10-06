var app = (function () {
'use strict';

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2tlbmQtdGVzdC5qcyhvcmlnaW5hbCkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0JBQWU7O0lBQ00sT0FBTSxLQUFBLENBQU0sc0JBQVo7O1lBQVgsV0FBVztZQUNKLE9BQU0sUUFBQSxDQUFTLElBQVQsR0FBTjs7b0JBQVAsT0FBTztvQkFFYixlQUFPOzs7Ozs7Ozs7O0FBSlgiLCJmaWxlIjoiYmFja2VuZC10ZXN0LmpzKG9yaWdpbmFsKSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYmFja2VuZC9pbmRleC5waHAnKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG59Il19

function table() {
    table = document.createElement('table');
    table.appendChild(tableHeaders());
    table.appendChild(tableContent());
    return table;
}

function tableHeaders() {
    tableHeaders = document.createElement('thead');
    fetchJson("selecao-info.php").then(data => {
        data.forEach(position => {
            let header = document.createElement('th');
            header.innerText = position;
            tableHeaders.appendChild(header);
        });
        let actions = document.createElement('th');
        actions.innerHTML = "";
        tableHeaders.appendChild(actions);
    });
    return tableHeaders;
}

function tableContent() {
    tableContent = document.createElement('tbody');
    fetchJson("selecao-list.php").then(data => {
        data.forEach(position => {
            let tableRow = document.createElement('tr');
            for (let value in position) {
                let cell = document.createElement('td');
                cell.innerText = position[value];
                cell.contentEditable = true;
                cell.onblur = function () {
                    sendRequest(rowtoJson(deleteButton.parentElement), "selecao-update.php");
                };
                tableRow.appendChild(cell);
            }
            let deleteButton = document.createElement('td');
            deleteButton.innerHTML = "<i class='fas fa-minus-circle zoomFont'></i>";
            deleteButton.onclick = function () {
                sendRequest(rowtoJson(deleteButton.parentElement), "selecao-delete.php");
                tableContent.removeChild(deleteButton.parentElement);
            };
            tableRow.appendChild(deleteButton);
            tableContent.appendChild(tableRow);
        });
    });
    return tableContent;
}

function fetchJson(file) {
    return new Promise(function ($return, $error) {
        let response, data;
        return fetch('/backend/' + file).then(function ($await_1) {
            try {
                response = $await_1;
                return response.json().then(function ($await_2) {
                    try {
                        data = $await_2;
                        return $return(data);
                    } catch ($boundEx) {
                        return $error($boundEx);
                    }
                }, $error);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }, $error);
    });
}

function rowtoJson(row) {
    let obj = {};
    for (let i = 0;i < row.cells.length - 1; i++) {
        if (row.cells[i].innerText != "" && row.cells[i].innerText != "\n") {
            obj[document.getElementsByTagName('thead')[0].childNodes[i].innerText.toLowerCase()] = row.cells[i].innerText.replace('\n', '');
        } else {
            obj[document.getElementsByTagName('thead')[0].childNodes[i].innerText.toLowerCase()] = null;
        }
    }
    return JSON.stringify(obj);
}

function sendRequest(json, file) {
    return new Promise(function ($return, $error) {
        var myRequest;
        let response, data;
        console.log(json);
        myRequest = new Request('/backend/' + file, {
            method: 'post',
            body: json,
            headers: {
                'Content-Type': 'text/json'
            }
        });
        return fetch(myRequest).then(function ($await_3) {
            try {
                response = $await_3;
                return response.json().then(function ($await_4) {
                    try {
                        data = $await_4;
                        if (data['err'] != undefined) {
                            window.alert(data['err']);
                            location.reload();
                        }
                        return $return(data);
                    } catch ($boundEx) {
                        return $error($boundEx);
                    }
                }, $error);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }, $error);
    });
}

function addForm() {
    let div = document.createElement('div');
    let formTitle = document.createElement('h3');
    formTitle.align = "center";
    formTitle.innerText = "Formulario de Adesão";
    let form = document.createElement('form');
    div.appendChild(formTitle);
    div.appendChild(form);
    fetchJson("selecao-info.php").then(data => {
        data.forEach(position => {
            if (position == "_id") 
                return;
            let input = document.createElement('input');
            input.name = position;
            input.placeholder = position.charAt(0).toUpperCase() + position.slice(1);
            input.required = true;
            form.appendChild(input);
        });
    });
    return div;
}

function formtoJson(form) {
    let obj = {};
    for (let i = 0;i < form.length; i++) {
        console.log(form[i].value);
        obj[form[i].placeholder.toLowerCase()] = form[i].value;
    }
    return JSON.stringify(obj);
}

function addButton() {
    let button = document.createElement('button');
    button.innerText = "Adicionar";
    button.className = "zoom";
    button.style = " --zoomSize : 1.2 ";
    button.onclick = function () {
        sendRequest(formtoJson(document.getElementsByTagName('form')[0]), "selecao-insert.php").then(done => location.reload());
    };
    button.type = "submit";
    return button;
}

function filter() {
    let filter = document.createElement('input');
    filter.placeholder = "Filtro";
    filter.id = "filtro";
    filter.oninput = function (e) {
        let text = e.target.value;
        let table = document.getElementsByTagName('tbody')[0];
        let rows = table.children;
        for (let i = 0;i < rows.length; i++) {
            let find = false;
            for (let j = 0;j < rows[i].children.length; j++) {
                if (rows[i].children[j].innerText.toLowerCase().indexOf(text.toLowerCase()) != -1) {
                    find = true;
                    break;
                }
            }
            if (!find) {
                rows[i].hidden = true;
            } else {
                rows[i].hidden = false;
            }
        }
    };
    return filter;
}

var index = element => {
    window.onkeypress = (e => {
        if (e.key == "Enter") {
            document.getElementsByTagName('button')[0].onclick();
        }
    });
    element.appendChild(filter());
    element.appendChild(table());
    element.appendChild(addForm());
    element.appendChild(addButton());
}


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzKG9yaWdpbmFsKSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGlCQUFpQjtBQUN4QixRQUFRLFFBQU8sV0FBVSxPQUFNLFdBQVUsV0FBVSxhQUFZLGNBQWM7QUFFN0UsZUFBZSxPQUFBLElBQVc7SUFDdEIsTUFBQSxDQUFPLFVBQVAsQ0FBQSxDQUFBLEVBQW9CLENBQUQsSUFBSztRQUNyQixJQUFHLENBQUEsQ0FBRSxHQUFGLENBQUEsRUFBQSxDQUFTLFNBQVE7WUFDaEIsUUFBQSxDQUFTLG9CQUFULENBQThCLFNBQTlCLENBQXdDLEVBQXhDLENBQTJDLE9BQTNDO1FBQ1g7SUFDQTtJQUNJLE9BQUEsQ0FBUSxXQUFSLENBQW9CLE1BQUE7SUFDcEIsT0FBQSxDQUFRLFdBQVIsQ0FBb0IsS0FBQTtJQUNwQixPQUFBLENBQVEsV0FBUixDQUFvQixPQUFBO0lBQ3BCLE9BQUEsQ0FBUSxXQUFSLENBQW9CLFNBQUE7QUFDeEI7QUFiQSIsImZpbGUiOiJpbmRleC5qcyhvcmlnaW5hbCkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmFja2VuZFRlc3QgZnJvbSAnLi9iYWNrZW5kLXRlc3QuanMnO1xuaW1wb3J0IHtmaWx0ZXIsYWRkQnV0dG9uLHRhYmxlLGZldGNoSnNvbixyb3d0b0pzb24sc2VuZFJlcXVlc3QsYWRkRm9ybX0gZnJvbSAnLi9mdW5jdGlvbnMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBlbGVtZW50ID0+IHtcbiAgICB3aW5kb3cub25rZXlwcmVzcz0gKGUpPT57XG4gICAgICAgaWYoZS5rZXkgPT0gXCJFbnRlclwiKXtcbiAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2J1dHRvbicpWzBdLm9uY2xpY2soKTtcbiAgICAgICB9XG4gICAgfVxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZmlsdGVyKCkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGFibGUoKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChhZGRGb3JtKCkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoYWRkQnV0dG9uKCkpO1xufVxuIl19

return index;

}());
//# sourceMappingURL=bundle.js.map
