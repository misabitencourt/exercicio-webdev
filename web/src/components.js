/**
 * CREATORS
 */

export const createTable = headers => {
  let table = document.createElement("table");
  table.id = "id_table";
  table.setAttribute("class", "table table-striped");
  table.appendChild(createThead(headers));

  selectTable().then(resp => {
    table.appendChild(createTBody(resp));
    refresh();
  });
  return table;
};

export const configForm = (continents, groups, update) => {
  update = update || "";
  loadContinentsOptions(continents, update);
  loadGroupsOptions(groups, update);

  const button = document.getElementById(`sendBTN${update}`);
  if (update !== "") {
    button.addEventListener("click", id => {
      let name = document.getElementById(`name${update}`).value;

      if (name !== "") {
        let id = document.getElementById(`id${update}`).value;
        let group = document.getElementById(`groups${update}`);
        group = group.options[group.selectedIndex].value;

        let continent = document.getElementById(`continents${update}`);
        continent = continent.options[continent.selectedIndex].value;
        updateTeam(id, name, group, continent).then(() => refresh());
        document.getElementById("updateForm").style.display = "none";
      }
    });

    const buttonClear = document.getElementById("clearBTNUpdate");
    buttonClear.addEventListener("click", () => {
      document.getElementById("updateForm").style.display = "none";
    });
  } else {
    button.addEventListener("click", () => {
      let name = document.getElementById(`name${update}`).value;
      if (name !== "" && document.getElementById("id_table").rows.length < 33) {
        let group = document.getElementById(`groups${update}`);
        group = group.options[group.selectedIndex].value;
        let continent = document.getElementById(`continents${update}`);
        continent = continent.options[continent.selectedIndex].value;
        insertTeam(name, group, continent).then(() => refresh());

        document.getElementById("name").value = "";
        document.getElementById("groupsUpdate").value = "A";
        document.getElementById("continentsUpdate").value = "Africa";
      } else {
        alert(
          "O campo nome deve estar preenchido e não deve exceder o número de 32 paises!"
        );
      }
    });

    document.getElementById("search").addEventListener("keyup", () => {
      search();
    });
  }
};

export const createForm = () => {
  const div = document.createElement("div");
  div.className = "formTeam";
  const form = document.createElement("form");
  form.className = "form-inline";
  form.action = "javascript:void(0);";
  const input = document.createElement("input");
  input.id = "name";
  input.className = "form-control mb-2 mr-sm-2";
  input.placeholder = "Brasil...";
  const selectGroups = document.createElement("select");
  selectGroups.id = "groups";
  selectGroups.className = "form-control mb-2 mr-sm-2";
  const selectContinent = document.createElement("select");
  selectContinent.id = "continents";
  selectContinent.className = "form-control mb-2 mr-sm-2";
  const button = document.createElement("button");
  button.id = "sendBTN";
  button.className = "btn btn-primary mb-2";
  const buttonText = document.createTextNode("Insert Team");
  const search = document.createElement("input");
  search.className = "form-control mb-2 mr-sm-2";
  search.id = "search";
  search.placeholder = "Search...";

  button.appendChild(buttonText);
  form.appendChild(input);
  form.appendChild(selectGroups);
  form.appendChild(selectContinent);
  form.appendChild(button);
  div.appendChild(form);
  div.appendChild(search);

  return div;
};

export const createUpdateForm = () => {
  const div = document.createElement("div");
  div.className = "formTeam";
  div.id = "updateForm";
  div.style.display = "none";
  const h2 = document.createElement("h2");
  h2.innerHTML = "Update team";
  const form = document.createElement("form");
  form.className = "form-inline";
  form.action = "javascript:void(0);";
  const idHidden = document.createElement("input");
  idHidden.id = "idUpdate";
  idHidden.type = "hidden";
  const input = document.createElement("input");
  input.className = "form-control mb-2 mr-sm-2";
  input.id = "nameUpdate";
  input.placeholder = "brasil...";
  const selectGroups = document.createElement("select");
  selectGroups.className = "form-control mr-sm-2 mb-2";
  selectGroups.setAttribute("id", "groupsUpdate");
  const selectContinent = document.createElement("select");
  selectContinent.className = "form-control mr-sm-2 mb-2";
  selectContinent.setAttribute("id", "continentsUpdate");
  const button = document.createElement("button");
  button.className = "btn btn-primary mb-2";
  button.id = "sendBTNUpdate";
  const buttonText = document.createTextNode("Update Team");
  const buttonClear = document.createElement("button");
  buttonClear.className = "btn btn-warning mb-2";
  buttonClear.id = "clearBTNUpdate";
  const buttonClearText = document.createTextNode("Clear");

  button.appendChild(buttonText);
  buttonClear.appendChild(buttonClearText);
  form.appendChild(idHidden);
  form.appendChild(input);
  form.appendChild(selectGroups);
  form.appendChild(selectContinent);
  form.appendChild(button);
  form.appendChild(buttonClear);
  div.appendChild(h2);
  div.appendChild(form);

  return div;
};

const createThead = headers => {
  let thead = document.createElement("thead");
  let tr = document.createElement("tr");

  headers.forEach(header => {
    let th = document.createElement("th");
    th.setAttribute("scope", "col");
    let text = document.createTextNode(header);
    th.appendChild(text);
    tr.appendChild(th);
  });

  thead.appendChild(tr);
  return thead;
};

const createTBody = content => {
  let tbody = document.createElement("tbody");
  tbody.setAttribute("id", "id_tbody");
  content.forEach(row => {
    tbody.appendChild(createRows(row));
  });

  return tbody;
};

const createRows = row => {
  let tr = document.createElement("tr");

  Object.keys(row).forEach(element => {
    let td = document.createElement("th");
    let text = document.createTextNode(row[element]);
    td.appendChild(text);
    tr.appendChild(td);
  });

  tr.appendChild(addButtonEdit(row["id"]));
  tr.appendChild(addButtonDelete(row["id"]));

  return tr;
};

const addButtonEdit = id => {
  let td = document.createElement("td");
  let editBTN = document.createElement("button");
  editBTN.setAttribute("class", "btn btn-info");
  editBTN.innerHTML = "<i class='fas fa-edit'></i>";
  editBTN.addEventListener("click", () => {
    editTeam(id);
    document.getElementById("updateForm").style.display = "block";
  });
  td.appendChild(editBTN);

  return td;
};

const addButtonDelete = id => {
  let td = document.createElement("td");
  let deleteBTN = document.createElement("button");
  deleteBTN.setAttribute("class", "btn btn-danger");
  deleteBTN.innerHTML = "<i class='fas fa-trash'></i>";
  deleteBTN.addEventListener("click", () => {
    deleteTeam(id).then(() => refresh());
  });
  td.appendChild(deleteBTN);

  return td;
};

const loadGroupsOptions = (groups, update) => {
  const select = document.getElementById(`groups${update}`);

  groups.forEach(group => {
    let option = document.createElement("option");
    option.setAttribute("value", group);
    var optionText = document.createTextNode(group);
    option.appendChild(optionText);
    select.appendChild(option);
  });
};

const loadContinentsOptions = (continents, update) => {
  const select = document.getElementById(`continents${update}`);

  continents.forEach(continent => {
    let option = document.createElement("option");
    option.setAttribute("value", continent);
    var optionText = document.createTextNode(continent);
    option.appendChild(optionText);
    select.appendChild(option);
  });
};

const updateTeam = async (id, name, groups, continent) => {
  let request = new Request("./backend/CRUD/update.php", {
    method: "post",
    body: [id, name, groups, continent],
    headers: {
      "Content-Type": "text/json"
    }
  });
  let response = await fetch(request);
  await response
    .json()
    .then(() => console.log())
    .catch(() => console.log());
};

/**
 * CRUD
 */

const deleteTeam = async id => {
  let request = new Request("./backend/CRUD/delete.php", {
    method: "post",
    body: id,
    headers: {
      "Content-Type": "text/json"
    }
  });
  let response = await fetch(request);
  await response
    .json()
    .then(() => console.log())
    .catch(() => console.log());
};

const editTeam = async (id, name, group, continent) => {
  loadById(id).then(data => {
    document.getElementById("idUpdate").value = data["id"];
    document.getElementById("nameUpdate").value = data["name"];
    document.getElementById("groupsUpdate").value = data["groups"];
    document.getElementById("continentsUpdate").value = data["continent"];
  });

  refresh();
};

const loadById = async id => {
  const response = await fetch(`./backend/CRUD/loadById.php?id=${id}`);
  return response.json();
};

const selectTable = async () => {
  const response = await fetch("./backend/CRUD/select.php");
  const data = await response.json();
  return data;
};

const insertTeam = async (name, group, continent) => {
  let request = new Request("./backend/CRUD/insert.php", {
    method: "post",
    body: [name, group, continent],
    headers: {
      "Content-Type": "text/json"
    }
  });

  let response = await fetch(request);
  await response
    .json()
    .then(() => console.log())
    .catch(() => console.log());
};

const search = () => {
  let table = document.getElementById("id_table");
  let tbody = document.getElementById("id_tbody");

  table.removeChild(tbody);
  searchTest().then(resp => table.appendChild(createTBody(resp)));
  document.body.appendChild(table);
};

const searchTest = async () => {
  const searchField = document.getElementById("search").value;
  const response = await fetch(`./backend/CRUD/search.php?name=${searchField}`);
  const data = await response.json();
  return data;
};

const refresh = () => {
  let table = document.getElementById("id_table");
  let tbody = document.getElementById("id_tbody");

  table.removeChild(tbody);
  selectTable().then(resp => table.appendChild(createTBody(resp)));
  document.body.appendChild(table);
};