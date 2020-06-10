# Utils

To minimize size and complexity of the components, the Utils folder provides helping functions that are imported and used in the components. 

#### MachineLearning

#### dataHandler
The dataHandler provides a variation of operations that manipulates data. 

`AddChannels.tsx` is a component used in Tile configuration and Settings to select a datasource and corresponding sensors.

`DownloadData.tsx` receives data that the user wants to download, reformats it and downloads it as a csv or xlsx file according to user preference.

`ReadData.ts` receives incoming real-time data, buffers and unpacks it. The data is formatted before it is returned.

`UploadFile.tsx` is a component that lets the user browse a file from its file directory and uploads and transmits it to the back-end for storage.

`channelParser.ts` parses raw data from a topic (datasource) on a RawRopic format into channels on a Channel format (id, channelName).


#### processorHandler
The processorHandler folder is used for creating and communicating with processors. Processors are created several places in the application, and demands a lot of code. The `formDataCreator.ts` is dedicated solely to creating correct data for post requests related to processors, and `processorStarter.ts` manages functions that create, start, stop and sets input and outputs of the processors.


#### styles and util.tsx
`util.tsx` provides simple functions for data parsing and manipulation.

Utils also contains the default styling for the entire application in the *styles* folder.