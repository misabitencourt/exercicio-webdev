var app = (function () {
'use strict';

function header()
{
    header = "<h1 align=center> Copa do Mundo </h1>";
    return header;
}

function table()
{
    table = '<table class="table table-striped">';
    table += '<thead>';
    table += '<tr>';
    table += '<th scope="col">Nome</th>';
    table += '<th scope="col">Grupo</th>';
    table += '<th scope="col">Continente</th>';
    table += '</tr>';
    table += '</thead>';
    table += '</table>';
    return table;
}

function form()
{
    //form = '<form action="selecao-act-cadastrar.php" method="post" enctype="multipart/form-data">';
    
    table = '<p> teste </p>';
    
    table += "<table class='table table-light'>";
    
    table += '<tr>';
    table += '<td>Nome:</td>';
    table += '<td><input type="text" name="nome" required oninput="setCustomValidity(\'\')"';
    table += 'oninvalid="this.setCustomValidity';
    table += "('Favor preencher o nome da seleçao')";
    table += '"';
    table += "></td>'";
    table += '</tr>';
    table += '<tr>';
    
    table += '<tr>';
    table += '<td>Grupo:</td>';
    table += '<td><input type="text" name="grupo" required oninput="setCustomValidity(\'\')"';
    table += 'oninvalid="this.setCustomValidity';
    table += "('Favor preencher o grupo da seleçao')";
    table += '"';
    table += "></td>'";
    table += '</tr>';
    table += '<tr>';
    
    table += '<tr>';
    table += '<td>Continente:</td>';
    table += '<td><input type="text" name="continente" required oninput="setCustomValidity(\'\')"';
    table += 'oninvalid="this.setCustomValidity';
    table += "('Favor preencher o continente da seleçao')";
    table += '"';
    table += "></td>'";
    table += '</tr>';
    table += '<tr>';
    
    table += '</table>';
    
    //form += table;
    //form += '</form>';
    
    return table;
    
}

var backendTest = () => new Promise(function ($return, $error) {
    let response, data;
    return fetch('/backend/index.php').then(function ($await_1) {
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
})


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbWlzYWJcXHBocFxcZXhlcmNpY2lvXFx3ZWJcXHNyY1xcYmFja2VuZC10ZXN0LmpzKG9yaWdpbmFsKSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxrQkFBZTs7SUFDTSxPQUFNLEtBQUEsQ0FBTSxzQkFBWjs7WUFBWCxXQUFXO1lBQ0osT0FBTSxRQUFBLENBQVMsSUFBVCxHQUFOOztvQkFBUCxPQUFPO29CQUViLGVBQU87Ozs7Ozs7Ozs7QUFOWCIsImZpbGUiOiJDOlxcVXNlcnNcXG1pc2FiXFxwaHBcXGV4ZXJjaWNpb1xcd2ViXFxzcmNcXGJhY2tlbmQtdGVzdC5qcyhvcmlnaW5hbCkiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9iYWNrZW5kL2luZGV4LnBocCcpO1xyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxufSJdfQ==

var index = element => {
    document.getElementById("app").innerHTML = header();
    document.getElementById("app").innerHTML += table();
    document.getElementById("app").innerHTML += form();
    backendTest().then(test => console.log(test));
}

return index;

}());
//# sourceMappingURL=bundle.js.map
