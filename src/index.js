console.log('hello world');

export class ReflowRejector {
    static initialize() {
        document.createElement = () => {};
    }
}