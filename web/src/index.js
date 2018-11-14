import backendTest from './backend-test.js';
import {createTable, createForm, configForm, createUpdateForm} from './components';

export default element => {
    const headers = ['#', 'Name', 'Group', 'Continent', 'Edit', 'Delete']
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const continents = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']

    element.appendChild(createForm());
    configForm(continents, groups)
    element.appendChild(createUpdateForm());
    configForm(continents, groups,'Update')
    element.appendChild(createTable(headers));
}
