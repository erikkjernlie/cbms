# Dashboard

The subsubnavbar and the top of the row of the dashboard contain the existing dashboards and five buttons:

* Add dashboard: create a new dashboard
* Add New: create a new tile
* Generate Report: download a PDF document that contains screenshots of the tiles in the dashboard
* Inspect dataset: get a statistical overview of a CSV file provided by the user
* Delete dashboard: deletes the current dashboard

The rest of the dashboard is a large canvas dedicated to rendering *tiles* created by the user.

#### Tiles
The tiles contain monitoring and analytics features that can be applied to the physical asset(s) connected to the project. After clicking on *Add new*, a window for tile configuration popus up. The user can navigate between different categories and types of tiles. All the tiles require an input, either a datasource (and specific sensor(s))aor a file. Some tiles require parameters such as sampling frequency of the sensors. When the configuration is completed, the tile will be saved and show up on the dashboard. The tiles can be moved around in the canvas, modified or deleted.