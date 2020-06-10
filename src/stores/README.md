# Stores

The stores contain code related closely connected to the back-end or the Firestore database. It contains three subfolders:

- listeners
- profile
- project

These files are layer between the front-end components/views/files and the backendAPI folder that makes ex or external components of the system.

Other files import the file as useXStore and then include the specific fields or functions that are used in the file. X is the name of the store. An example is shown below

```javascript
import useProfileStore from "src/stores/profile/profileStore";

const { createProfile } = useProfileStore((state) => ({
  createProfile: state.createProfile,
}));
```
