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
        tableHeaders.appendChild(document.createElement('th'));
    });
    return tableHeaders;
}

function tableContent() {
    tableContent = document.createElement('tbody');
    fetchJson("selecao-list.php").then(data => {
        data.forEach(json => {
            tableContent.appendChild(tableRow(json));
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
    let tableHeaders = document.getElementsByTagName('thead')[0].childNodes;
    for (let i = 0;i < row.cells.length - 1; i++) {
        if (row.cells[i].innerText != "" && row.cells[i].innerText != "\n") {
            obj[tableHeaders[i].innerText.toLowerCase()] = row.cells[i].innerText.replace('\n', '');
        } else {
            obj[tableHeaders[i].innerText.toLowerCase()] = null;
        }
    }
    return JSON.stringify(obj);
}

function sendRequest(json, file) {
    return new Promise(function ($return, $error) {
        let request, response, data;
        request = new Request('/backend/' + file, {
            method: 'post',
            body: json,
            headers: {
                'Content-Type': 'text/json'
            }
        });
        return fetch(request).then(function ($await_3) {
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
        data.forEach(value => {
            if (value == "_id") 
                return;
            form.appendChild(formInput(value));
        });
    });
    return div;
}

function formToJson(form) {
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
        sendRequest(formToJson(document.getElementsByTagName('form')[0]), "selecao-insert.php").then(done => location.reload());
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

function cell(value) {
    let cell = document.createElement('td');
    cell.innerText = value;
    cell.contentEditable = true;
    cell.onblur = function () {
        sendRequest(rowtoJson(this.parentElement), "selecao-update.php");
    };
    return cell;
}

function deleteButton() {
    let deleteButton = document.createElement('td');
    deleteButton.innerHTML = "<i class='fas fa-minus-circle zoomFont'></i>";
    deleteButton.onclick = function () {
        sendRequest(rowtoJson(deleteButton.parentElement), "selecao-delete.php");
        tableContent.removeChild(deleteButton.parentElement);
    };
    return deleteButton;
}

function tableRow(json) {
    let tableRow = document.createElement('tr');
    for (let value in json) {
        tableRow.appendChild(cell(json[value]));
    }
    tableRow.appendChild(deleteButton());
    return tableRow;
}

function formInput(value) {
    let input = document.createElement('input');
    input.name = value;
    input.placeholder = value.charAt(0).toUpperCase() + value.slice(1);
    input.required = true;
    return input;
}



//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZ1bmN0aW9ucy5qcyhvcmlnaW5hbCkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLFFBQU87SUFDbkIsS0FBQSxDQUFBLENBQUEsQ0FBUSxRQUFBLENBQVMsYUFBVCxDQUF1QjtJQUMvQixLQUFBLENBQU0sV0FBTixDQUFrQixZQUFBO0lBQ2xCLEtBQUEsQ0FBTSxXQUFOLENBQWtCLFlBQUE7SUFDbEIsT0FBTztBQUNYOztBQUNBLFNBQVMsZUFBYztJQUNuQixZQUFBLENBQUEsQ0FBQSxDQUFlLFFBQUEsQ0FBUyxhQUFULENBQXVCO0lBQ3RDLFNBQUEsQ0FBVSxtQkFBVixDQUE4QixJQUE5QixDQUNJLElBQUEsSUFBUTtRQUNKLElBQUEsQ0FBSyxPQUFMLENBQ0ksUUFBQSxJQUFZO1lBQ1IsR0FBQSxDQUFJLFNBQVMsUUFBQSxDQUFTLGFBQVQsQ0FBdUI7WUFDcEMsTUFBQSxDQUFPLFNBQVAsQ0FBQSxDQUFBLENBQW1CO1lBQ25CLFlBQUEsQ0FBYSxXQUFiLENBQXlCO1FBQzdDO1FBRVksWUFBQSxDQUFhLFdBQWIsQ0FBeUIsUUFBQSxDQUFTLGFBQVQsQ0FBdUI7SUFDNUQ7SUFFSSxPQUFPO0FBQ1g7O0FBQ0EsU0FBUyxlQUFjO0lBQ25CLFlBQUEsQ0FBQSxDQUFBLENBQWUsUUFBQSxDQUFTLGFBQVQsQ0FBdUI7SUFDdEMsU0FBQSxDQUFVLG1CQUFWLENBQThCLElBQTlCLENBQ0ksSUFBQSxJQUFRO1FBQ0osSUFBQSxDQUFLLE9BQUwsQ0FBYSxJQUFBLElBQVE7WUFDakIsWUFBQSxDQUFhLFdBQWIsQ0FBeUIsUUFBQSxDQUFTO1FBQ2xEO0lBRUE7SUFFSSxPQUFPO0FBQ1g7O0FBQ0EsT0FBTyxTQUFlLFVBQVU7SUFBekI7O1FBQ1ksT0FBTSxLQUFBLENBQU0sV0FBQSxDQUFBLENBQUEsQ0FBWSxNQUF4Qjs7Z0JBQVgsV0FBVztnQkFDSixPQUFNLFFBQUEsQ0FBUyxJQUFULEdBQU47O3dCQUFQLE9BQU87d0JBQ1gsZUFBTzs7Ozs7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QUssSUFBQSxDQUFLO0lBQ3ZDO0lBQ0ksUUFBQSxDQUFTLFdBQVQsQ0FBcUIsWUFBQTtJQUNyQixPQUFPO0FBQ1g7O0FBQ0EsU0FBUyxVQUFVLE9BQU07SUFDckIsR0FBQSxDQUFJLFFBQVEsUUFBQSxDQUFTLGFBQVQsQ0FBdUI7SUFDbkMsS0FBQSxDQUFNLElBQU4sQ0FBQSxDQUFBLENBQWE7SUFDYixLQUFBLENBQU0sV0FBTixDQUFBLENBQUEsQ0FBb0IsS0FBQSxDQUFNLE1BQU4sQ0FBYSxFQUFiLENBQWdCLFdBQWhCLEVBQUEsQ0FBQSxDQUFBLENBQWdDLEtBQUEsQ0FBTSxLQUFOLENBQVk7SUFBRztJQUNuRSxLQUFBLENBQU0sUUFBTixDQUFBLENBQUEsQ0FBaUI7SUFDakIsT0FBTztBQUNYOztBQXRLQSIsImZpbGUiOiJmdW5jdGlvbnMuanMob3JpZ2luYWwpIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHRhYmxlKCl7XG4gICAgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xuICAgIHRhYmxlLmFwcGVuZENoaWxkKHRhYmxlSGVhZGVycygpKTtcbiAgICB0YWJsZS5hcHBlbmRDaGlsZCh0YWJsZUNvbnRlbnQoKSk7XG4gICAgcmV0dXJuIHRhYmxlO1xufVxuZnVuY3Rpb24gdGFibGVIZWFkZXJzKCl7XG4gICAgdGFibGVIZWFkZXJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGhlYWQnKTtcbiAgICBmZXRjaEpzb24oXCJzZWxlY2FvLWluZm8ucGhwXCIpLnRoZW4oIFxuICAgICAgICBkYXRhID0+IHtcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaCggXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLmlubmVyVGV4dCA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICB0YWJsZUhlYWRlcnMuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgICAgICB0YWJsZUhlYWRlcnMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKSk7XG4gICAgICAgIH1cbiAgICApXG4gICAgcmV0dXJuIHRhYmxlSGVhZGVycztcbn1cbmZ1bmN0aW9uIHRhYmxlQ29udGVudCgpe1xuICAgIHRhYmxlQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5Jyk7XG4gICAgZmV0Y2hKc29uKFwic2VsZWNhby1saXN0LnBocFwiKS50aGVuKFxuICAgICAgICBkYXRhID0+IHtcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaChqc29uID0+IHtcbiAgICAgICAgICAgICAgICB0YWJsZUNvbnRlbnQuYXBwZW5kQ2hpbGQodGFibGVSb3coanNvbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiB0YWJsZUNvbnRlbnQ7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hKc29uKGZpbGUpe1xuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYmFja2VuZC8nK2ZpbGUpO1xuICAgIGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiBkYXRhO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJvd3RvSnNvbihyb3cpe1xuICAgIGxldCBvYmogPSB7fTtcbiAgICBsZXQgdGFibGVIZWFkZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoZWFkJylbMF0uY2hpbGROb2RlcztcbiAgICBmb3IoIGxldCBpID0gMCA7IGk8IHJvdy5jZWxscy5sZW5ndGgtMSA7IGkrKyl7XG4gICAgICAgIGlmKHJvdy5jZWxsc1tpXS5pbm5lclRleHQgIT0gXCJcIiAmJiByb3cuY2VsbHNbaV0uaW5uZXJUZXh0ICE9IFwiXFxuXCIpe1xuICAgICAgICAgICAgb2JqW3RhYmxlSGVhZGVyc1tpXS5pbm5lclRleHQudG9Mb3dlckNhc2UoKV0gPSByb3cuY2VsbHNbaV0uaW5uZXJUZXh0LnJlcGxhY2UoJ1xcbicsJycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBvYmpbdGFibGVIZWFkZXJzW2ldLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFJlcXVlc3QoanNvbixmaWxlKXtcbiAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KCcvYmFja2VuZC8nKyBmaWxlICxcbiAgICAgICAge1xuICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICBib2R5OiBqc29uLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9qc29uJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcbiAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICBsZXQgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICBpZihkYXRhWydlcnInXSAhPSB1bmRlZmluZWQpe1xuICAgICAgICB3aW5kb3cuYWxlcnQoZGF0YVsnZXJyJ10pO1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9IFxuICAgIHJldHVybiBkYXRhO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZvcm0oKXtcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGV0IGZvcm1UaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gICAgZm9ybVRpdGxlLmFsaWduID0gXCJjZW50ZXJcIjtcbiAgICBmb3JtVGl0bGUuaW5uZXJUZXh0ID0gXCJGb3JtdWxhcmlvIGRlIEFkZXPjb1wiXG4gICAgbGV0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGZvcm1UaXRsZSlcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZm9ybSlcbiAgICBmZXRjaEpzb24oXCJzZWxlY2FvLWluZm8ucGhwXCIpLnRoZW4oXG4gICAgICAgIGRhdGEgPT4ge1xuICAgICAgICAgICAgZGF0YS5mb3JFYWNoKCB2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoIHZhbHVlID09IFwiX2lkXCIpIHJldHVybjtcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGZvcm1JbnB1dCh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIClcbiAgICByZXR1cm4gZGl2O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1Ub0pzb24oZm9ybSl7XG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIGZvciggbGV0IGkgPSAwIDsgaTwgZm9ybS5sZW5ndGggOyBpKyspe1xuICAgICAgICAgICAgY29uc29sZS5sb2coZm9ybVtpXS52YWx1ZSk7XG4gICAgICAgICAgICBvYmpbZm9ybVtpXS5wbGFjZWhvbGRlci50b0xvd2VyQ2FzZSgpXSA9IGZvcm1baV0udmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZEJ1dHRvbigpe1xuICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24uaW5uZXJUZXh0ID0gXCJBZGljaW9uYXJcIjtcbiAgICBidXR0b24uY2xhc3NOYW1lID0gXCJ6b29tXCI7XG4gICAgYnV0dG9uLnN0eWxlID0gXCIgLS16b29tU2l6ZSA6IDEuMiBcIlxuICAgIGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcbiAgICAgICAgc2VuZFJlcXVlc3QoZm9ybVRvSnNvbihkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZm9ybScpWzBdKSxcInNlbGVjYW8taW5zZXJ0LnBocFwiKS50aGVuKCBkb25lPT5sb2NhdGlvbi5yZWxvYWQoKSk7ICBcbiAgICB9IFxuICAgIGJ1dHRvbi50eXBlID0gXCJzdWJtaXRcIjtcbiAgICByZXR1cm4gYnV0dG9uO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlcigpe1xuICAgIGxldCBmaWx0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGZpbHRlci5wbGFjZWhvbGRlciA9IFwiRmlsdHJvXCI7XG4gICAgZmlsdGVyLmlkID0gXCJmaWx0cm9cIlxuICAgIGZpbHRlci5vbmlucHV0ID0gZnVuY3Rpb24gKGUpe1xuICAgICAgICBsZXQgdGV4dCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICBsZXQgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXVxuICAgICAgICBsZXQgcm93cyA9IHRhYmxlLmNoaWxkcmVuO1xuICAgICAgICBmb3IobGV0IGkgPSAwIDsgaTxyb3dzLmxlbmd0aCA7aSsrKXtcbiAgICAgICAgICAgbGV0IGZpbmQgPSBmYWxzZTtcbiAgICAgICAgICAgZm9yKGxldCBqID0gMCA7IGo8cm93c1tpXS5jaGlsZHJlbi5sZW5ndGg7IGorKyApe1xuICAgICAgICAgICAgICAgaWYocm93c1tpXS5jaGlsZHJlbltqXS5pbm5lclRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQudG9Mb3dlckNhc2UoKSkgIT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBmaW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYoIWZpbmQpe1xuICAgICAgICAgICAgICAgcm93c1tpXS5oaWRkZW4gPSB0cnVlO1xuICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgIHJvd3NbaV0uaGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyO1xufVxuZnVuY3Rpb24gY2VsbCh2YWx1ZSl7XG4gICAgbGV0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGNlbGwuaW5uZXJUZXh0ID0gdmFsdWU7XG4gICAgY2VsbC5jb250ZW50RWRpdGFibGUgPSB0cnVlO1xuICAgIGNlbGwub25ibHVyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgc2VuZFJlcXVlc3Qocm93dG9Kc29uKHRoaXMucGFyZW50RWxlbWVudCksXCJzZWxlY2FvLXVwZGF0ZS5waHBcIilcbiAgICB9XG4gICAgcmV0dXJuIGNlbGw7XG59XG5mdW5jdGlvbiBkZWxldGVCdXR0b24oKXtcbiAgICBsZXQgZGVsZXRlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBkZWxldGVCdXR0b24uaW5uZXJIVE1MPVwiPGkgY2xhc3M9J2ZhcyBmYS1taW51cy1jaXJjbGUgem9vbUZvbnQnPjwvaT5cIlxuICAgIGRlbGV0ZUJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNlbmRSZXF1ZXN0KHJvd3RvSnNvbihkZWxldGVCdXR0b24ucGFyZW50RWxlbWVudCksXCJzZWxlY2FvLWRlbGV0ZS5waHBcIilcbiAgICAgICAgICAgIHRhYmxlQ29udGVudC5yZW1vdmVDaGlsZChkZWxldGVCdXR0b24ucGFyZW50RWxlbWVudCk7XG4gICAgfVxuICAgIHJldHVybiBkZWxldGVCdXR0b247XG59XG5mdW5jdGlvbiB0YWJsZVJvdyhqc29uKXtcbiAgICBsZXQgdGFibGVSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgIGZvcihsZXQgdmFsdWUgaW4ganNvbiApe1xuICAgICAgICB0YWJsZVJvdy5hcHBlbmRDaGlsZChjZWxsKGpzb25bdmFsdWVdKSk7XG4gICAgfVxuICAgIHRhYmxlUm93LmFwcGVuZENoaWxkKGRlbGV0ZUJ1dHRvbigpKVxuICAgIHJldHVybiB0YWJsZVJvdztcbn1cbmZ1bmN0aW9uIGZvcm1JbnB1dCh2YWx1ZSl7XG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBpbnB1dC5uYW1lID0gdmFsdWU7XG4gICAgaW5wdXQucGxhY2Vob2xkZXIgPSB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnNsaWNlKDEpOztcbiAgICBpbnB1dC5yZXF1aXJlZCA9IHRydWU7XG4gICAgcmV0dXJuIGlucHV0O1xufSJdfQ==

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
