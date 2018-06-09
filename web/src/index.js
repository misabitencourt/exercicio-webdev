import backendTest from './backend-test.js';


export default element => {
    element.textContent = 'Hello world';

    backendTest().then(test => console.log(test));

    // Seu código começa aqui!!
}
