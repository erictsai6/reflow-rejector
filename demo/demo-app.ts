import { ReflowRejector } from '../src/index';
ReflowRejector.initialize();

const appContainer = document.getElementById('app');

const divList: HTMLElement[] = [];

for (let i = 0; i < 20; i++) {
    const div = document.createElement('div');
    const anchor = document.createElement('a');
    const span = document.createElement('span');
    span.innerText = 'Placeholder';
    div.appendChild(anchor);
    div.appendChild(span);
    anchor.innerText = `Special Link ${i} - `;
    appContainer.appendChild(div);
    divList.push(div);
}

setInterval(() => {
    for (let i = 0; i < divList.length; i++) {
        const div = divList[i];
        div.style.marginLeft = Math.random() * 100 + 'px';
        div.children[1].innerText = `${div.children[0].offsetLeft} px offsetLeft`;
    }
}, 10000)
