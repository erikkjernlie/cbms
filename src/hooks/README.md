# Hooks

This folder contains custom made hooks using React Hooks. The files expose functions and values that can be imported in files using useX as shown below

```javascript
import { useRegister } from "src/hooks/authentication/authentication";

const { registerUser, registering, registerError } = useRegister();

```

In this case, the useRegister hook is imported with its variables registerUser (function), registering (boolean) and registerError (string). The user can call the registerUser function, and the registering variable will be true while the user is being registered. If an error occurs, the registerError will explain the problem.

There are three custom hooks files but each file can contain more than one hook. The authentication file exports the hooks useRegister, useSignIn, useSignOut, useResetPassword and useUser. A similar logic is implemented in the error and project hooks.