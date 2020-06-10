# backendAPI

The files in this folder handle all HTTP communication with the back-end. The functions are simple, and usually take in the arguments needed to send the request and return the `fetch()` method. As there are many calls to the back-end, requests have been distributed in various files according to category. rootAPI is a string that contains the default address to the back-end.

The following function is an example of the most common function in a backendAPI file. It is used to subscribe to a datasource in the client.

```javascript
export async function subscribeToDatasource(id: string) {
	return fetch(rootAPI + "/datasources" + id + "/subscribe", {
		credentials: "include"
	});
}
```

Functions that execute a POST request can be implemented by taking in a FormData object in the function and directly executing the request or by taking in variables and create the formData of the request before sending it. Two examples are shown below

```javascript
export async createProject(email: string, projectName: string) {
	let formData = new FormData();
	formData.append("email", email);
	formData.append("date", new Date().toString());
	formData.append("projectName", projectName);
	return fetch(rootAPI + "projects/new", {
		method: "POST",
		body: formData
	});
}
```

```javascript
export async function createDatasource(formData: FormData) {
	const createLink = rootAPI + "/datasources/create";
	return fetch(createLink, {
		method: "POST",
		body: formData
	});
}
```