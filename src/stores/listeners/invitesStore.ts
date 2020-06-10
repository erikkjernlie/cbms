import { fire, firestore } from "src/firebase";
import { Profile, User } from "src/types/project";
import create from "zustand";

const [useInvitesStore] = create((set, get) => ({
  invites: [],
  inviteError: "",
  newInvite: "",
  sendingInvite: false,
  loadingInvite: false,
  acceptInvite: async (project: string, user: User, history: any) => {
    set({
      loadingInvite: true,
    });
    var batch = firestore.batch();
    var mailaddress = firestore.collection("profiles").doc(user.email).get();

    if (mailaddress) {
      var userRef = firestore.collection("profiles").doc(user.email);
      batch.update(userRef, {
        invites: fire.FieldValue.arrayRemove(project),
        projects: fire.FieldValue.arrayUnion(project),
      });

      var projectRef = firestore.collection("projects").doc(project);
      batch.update(projectRef, {
        users: fire.FieldValue.arrayUnion(user.email),
      });

      batch
        .commit()
        .then(() => {
          set({
            loadingInvite: false,
          });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },

  sendUserInvite: async (project: string, email: string) => {
    set({
      sendingInvite: true,
    });
    return firestore
      .collection("profiles")
      .doc(email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const profile = doc.data() as Profile;
          if (
            profile &&
            profile.invites &&
            profile.invites.length >= 0 &&
            profile.invites.indexOf(email) >= 0
          ) {
            // set invite error that user already is in the project
            // can also check if user has gotten an invite
          } else {
            firestore
              .collection("profiles")
              .doc(email)
              .update({
                invites: fire.FieldValue.arrayUnion(project),
              })
              .then(() => {})
              .catch((error) => {
                console.log(error);
              });
          }
        }
      })
      .finally(() => {
        set({
          sendingInvite: false,
        });
      });
  },
  setInvites: (invites: string[]) => {
    set({
      invites: invites,
    });
  },
  initializeInvites: async (email: string) => {
    firestore
      .collection("profiles")
      .doc(email)
      .onSnapshot((doc) => {
        let data = doc.data() as Profile;
        if (data && data.invites) {
          let newInvites = data.invites;
          if (newInvites && newInvites.length > 0) {
            let newInvite = newInvites.filter(
              (x) => !get().invites.includes(x)
            );
            if (newInvite.length > 0 && newInvites !== get().invites) {
              set({
                newInvite: newInvite[newInvite.length - 1],
                invites: newInvites,
              });
            }
          }
        }
      });
  },
  removeInvite: async (invite: string, user: User, history: any) => {
    set({
      loadingInvite: true,
    });
    const invites = get().invites.filter((inv: string) => inv !== invite);

    firestore
      .collection("profiles")
      .doc(user.email)
      .update({
        invites: fire.FieldValue.arrayRemove(invite),
      })
      .then(() => {
        set({
          loadingInvite: false,
          invites: invites,
        });
      });
  },
}));

export default useInvitesStore;
