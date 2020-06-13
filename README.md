# Front-end Solution for the Digital Twin Cloud Platform

[![N|Solid](https://i.imgur.com/i2NjWff.png)](http://digitaltwin.surge.sh)

The goal of this project is to develop a generic platform that could host multiple digital twins for many users. The platform should provide functionality that enables students to monitor and perform analyses on the digital twins. The application is divided into a front-end and a back-end solution, whereas the back-end solution can be found [here](https://github.com/erikkjernlie/digtwin_backend/). Please note that the back-end solution requires an NDA. The Digital Twin Cloud Platform front-end solution is developed by Anne Pernille Wulff Wold and Erik Kjernlie in their master thesis Spring 2020.

## Tech

### Open-source libraries

The Digital Twin Cloud uses a number of open source projects to work properly:

- [ReactJS] - A JavaScript library for building user interfaces
- [Styled-components] - Use the best bits of ES6 and CSS to style your apps without stress
- [Typescript] - A typed superset of JavaScript that compiles to plain JavaScript for easy debugging and documentation
- [Plotly.js] - An interactive graphing library
- [React-beautiful-dnd] - Beautiful and accessible drag and drop for lists with React
- [React-grid-layout] - A draggable and resizable grid layout with responsive breakpoints, for React
- [React-icons]- Popular icons with ES6 imports
- [Leaflet] - a JavaScript library for interactive maps
- [Zustand] - Bear necessities for global state management in React
- [TensorFlow JS] - Machine learning for JavaScript developers
- [@aksel/structjs] - Python-style struct module in JavaScript for parsing real-time data from the back-end
- [jspdf] - For client-side JavaScript PDF generation
- [Youtube] - For live video streaming

### Proprietary software

The Digital Twin Cloud Platform is also dependent upon some proprietary software:

- [The Digital Twin Cloud Platform Backend Solution] - Python backend-solution for the Digital Twin Cloud Platform
- [Firebase] - Google Firestore for real-time database updates and Firebase Authentication for authentication
- [Ceetron] - For advanced 3D visualization of CFD and FEA

### Software architecture

The software architecture for the Digital Twin Cloud Platform is displayed in the figure below. The front-end solution is developed in React. It communicates with Firebase's UI Auth for authentication. The front-end solution communicates with the backend solution through HTTP requests for receiving resources and WebSockets for receiving real-time data from the back-end. The back-end solution receives data from phyiscal assets through UDP connections. Notifications for event triggers are received with real-time updates from Google Cloud Firestore directly in the front-end. Google Cloud Firestore is also used for inviting people to projects and chatting inside a specific project.  
![Software architecture](https://i.imgur.com/64tVNtT.jpg)

## Installation

The front-end solution requires [Node.js](https://nodejs.org/) v12+ to run.
Use the package manager [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) to install dependencies.

```bash
yarn
```

```bash
npm install
```

Use the package manager to start the server. The command will run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

```bash
yarn start
```

```bash
npm run start
```

## Build and deployment

### Build

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

```bash
yarn build
```

```bash
npm run build
```

### Deployment

The front-end solution is hosted through [Surge](https://surge.sh/). Surge makes it really easy to deploy projects for free through npm or yarn, by only writing a few lines of code in Windows's command line.

```bash
cd build
cp index.html 200.html
npm install --global surge
surge
```

“cp index.htm 200.html” is used to copy the index.html file into a new filed called 200.html for the Windows Operating System. This is necessary for client-side routing. The next step is to install surge, before completing the deployment with the **surge** command. After typing **surge** in the command window, the last step is to choose a domain name and press enter. The project will then be hosted at project-name.surge.sh. For the Digital Twin Cloud Platform, this is set to digitaltwin.surge.sh but it can easily be changed in the future.

# How to use the Digital Twin Cloud Platform

## Requirements
- Connected to the NTNU network (local network or VPN)
- Do not use Internet Explorer (optimized for Google Chrome and Safari)

## User guides
- [Introduction video](https://www.youtube.com/watch?v=J9HCDY4ji9A)
- [Create project, configure datasource with CSV data and upload model](https://www.youtube.com/watch?v=NVK11OFoFIo)
- [Configure JSON datasource](https://www.youtube.com/watch?v=Kc6xRuD5ElI)
- [Visualization of 3D models, even triggers and notifications](https://www.youtube.com/watch?v=8di6MFMW1t0)
- [Real-time data and report generator](https://www.youtube.com/watch?v=eMwcWiSKC8E)
- [Analytics (FFTs, video streaming, spectrograms, historical data, predictions etc)](https://www.youtube.com/watch?v=fguiR-mA4gg)



[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[styled-components]: https://styled-components.com/
[ceetron]: https://www.ceetronsolutions.com//
[typescript]: https://www.typescriptlang.org/
[plotly.js]: https://plotly.com/
[react-beautiful-dnd]: https://github.com/atlassian/react-beautiful-dnd/
[react-grid-layout]: https://github.com/STRML/react-grid-layout/
[react-icons]: https://react-icons.netlify.com/#//
[leaflet]: https://leafletjs.com//
[zustand]: https://github.com/react-spring/zustand/
[firebase]: https://firebase.google.com/
[tensorflow js]: https://www.tensorflow.org/js/
[@aksel/structjs]: https://www.npmjs.com/package/@aksel/structjs/
[jspdf]: https://github.com/MrRio/jsPDF/
[the digital twin cloud platform backend solution]: https://github.com/erikkjernlie/digtwin_backend/
[youtube]: https://youtube.com/
[dill]: https://github.com/joemccann/dillinger
[git-repo-url]: https://github.com/joemccann/dillinger.git
[john gruber]: http://daringfireball.net
[df1]: http://daringfireball.net/projects/markdown/
[markdown-it]: https://github.com/markdown-it/markdown-it
[ace editor]: http://ace.ajax.org
[node.js]: http://nodejs.org
[twitter bootstrap]: http://twitter.github.com/bootstrap/
[jquery]: http://jquery.com
[@tjholowaychuk]: http://twitter.com/tjholowaychuk
[express]: http://expressjs.com
[reactjs]: http://reactjs.org
[gulp]: http://gulpjs.com
[pldb]: https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md
[plgh]: https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md
[plgd]: https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md
[plod]: https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md
[plme]: https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md
[plga]: https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md
