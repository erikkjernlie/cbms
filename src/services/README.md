# Services

The services provided include authentication and error handling.

`authService.ts` contains the methods that facilitate registration, signing into the platform and resetting passwords. It also provides a listener that changes the authentication state of the user when it logs in and out. Only authenticated users are granted access to the platform. The authentication service communicates directly with the Firebase authentication service.

`errorService.ts` parses system error messages to more user-friendly error messages that can be displayed in the client.
