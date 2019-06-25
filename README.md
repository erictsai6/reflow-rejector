# reflow-rejector
Small library to alert if any reflow abuses are detected

The purpose of this library is to monitor the runtime usage of javascript APIs that are known to trigger reflows. [Reference link](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

## Installation
`npm install reflow-rejector`

## Usage
```javascript
import { ReflowRejector } from 'reflow-rejector';

// Config is optional
const config = {
    maxAllowed: 10, // default 10
    intervalMs: 1500, // default 1500
    alertType: 'ALERT', // default 'ALERT' - ['ALERT', 'CONSOLE']
    alertFrequencyMs: 600000 // default 10 minutes == 600,000 ms
};

ReflowRejector.initialize(config);

// If you wish to disable it then tear it down
ReflowRejector.teardown();
```

## Development
Feel free to pull down this source code and hack at it yourself. 
* Demo server
    * `npm run dev`
    * This will start a small web server that will automatically pull in the source code
    * http://localhost:8080/
* Unit tests / Integration tests
    * `npm run test`
    * `npm run test:watch`
    * Both will run the *.spec.ts files and the one marked integration.spec.ts will test the entire flow using karma and a real browser. 
    