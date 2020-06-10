# Routes

The routes of the project are the main pages of the platform that can be accessed using routing, e.g. the projects route is available through "{root}/projects". Each Route has a main component and additional supporting components or files. Each of the files contains a ".style.ts" file that sets the styling for the component.

#### LandingPageRoute
When the application loads, one is directed to the LandingPage. It contains information about the platform and use cases. From the loading page one can navigate to the SignInSignUp route.

#### NewProjectRoute
This is the configuration system of the platform. One can create a new project and add datasources and models. The file contains separate components for connecting to a datasource and uploading a model.

#### ProjectRoute
The project route containt the "skeleton" of a project. The content is located in the Components folder, in the subfolders "Dashboards", "Notifications", "Models" and "Datasources". The SubNavbar manages routing between these components.

The ProjectSettings component is located in this folder. It allows the user to invite another user to participate in the project and send messages on a chat between the project members.

#### ProjectsRoute
The ProjectsRoute is the landing page of the application for authenticated users. It lists all the user's existing projects and an option to create a new project which directs the user to the NewProjectRoute.

#### SignInSignUpRoute
This route displays fields for entering credentials for logging in or registering a new user. One can reset a password