# Project

The project folder contains three stores that provide functions used in the configuration and modification of projects.

The `dataStore`handles incoming sensor data. Functions for opening and closing a WebSocket connection turns on and off the real-time communication channel with the back-end. One can subscribe to datasources (subscribeDatasources), parse incoming data (parseData) and add new datasources (setDatasources) 

The `datasourceStore`handles datasources of a project. One can fetch all datasources in a project from the back-end, add a new or remove a datasource.

In the `projectStore`, there are functions for a project and its features of a project such as dashboards, models and tiles. This includes fetching information, creating, changing and deleting operations.