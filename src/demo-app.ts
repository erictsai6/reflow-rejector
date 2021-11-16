import { ReflowRejector } from './index';

ReflowRejector.initialize();

const appContainer = document.getElementById('app');

const divList: HTMLDivElement[] = [];

for (let i = 0; i < 20; i++) {
    const div = document.createElement('div');
    const anchor = document.createElement('a');
    const span = document.createElement('span');
    span.innerText = 'Placeholder';
    div.appendChild(anchor);
    div.appendChild(span);
    anchor.innerText = `Special Link ${i} - `;
    appContainer?.appendChild(div);
    divList.push(div);
}

setInterval(() => {
    for (let i = 0; i < divList.length; i++) {
        const div = divList[i];
        div.style.marginLeft = Math.random() * 100 + 'px';
        (div.children[1] as HTMLSpanElement).innerText = `${(div.children[0] as HTMLSpanElement).offsetLeft} px offsetLeft`;
    }
}, 10000)
