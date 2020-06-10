import { toast } from "react-toastify";
import { firestore } from "src/firebase";
import { INotification } from "src/types/datahandling";
import create from "zustand";

const [useNotificationsStore] = create((set, get) => ({
  notifications: [],
  fetchingNotifications: false,
  deletingNotification: "",
  timestamps: [],
  listenToConfiguration: async (projectId: string) => {
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("models")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            // check if new (timestamp)

            if (
              change.doc.data() &&
              change.doc.data().timestamp &&
              new Date().getTime() / 1000 -
                change.doc.data().timestamp.seconds <
                30
            ) {
              toast.info(
                "Your FMU has been processed and you can watch the model under the models tab. If you cannot see it, try refresh the page.",
                {
                  position: toast.POSITION.BOTTOM_CENTER,
                }
              );
            }

            // if (change.doc.data().created)
          }
        });
      });
  },
  deleteNotification: async (projectId: string, id: string) => {
    set({
      deletingNotification: id,
    });
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("notifications")
      .doc(id)
      .delete()
      .then(() => {
        set({
          deletingNotification: "",
          notifications: get().notifications.filter(
            (notification: INotification) => notification.id !== id
          ),
        });
      })
      .catch((error) => console.log(error));
  },
  deleteAllNotifications: async (projectId: string) => {
    set({
      deletingNotification: "all",
    });
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("notifications")
      .get()
      .then((snapshot) => {
        var batch = firestore.batch();
        snapshot.forEach(function (doc) {
          // For each doc, add a delete operation to the batch
          batch.delete(doc.ref);
        });
        // Commit the batch
        return batch.commit();
      })
      .then(() => {
        set({
          deletingNotification: "",
          notifications: [],
        });
      })
      .catch((error) => console.log(error));
  },
  listenToNotifications: async (projectId: string) => {
    set({
      fetchingNotifications: true,
    });
    firestore
      .collection("projects")
      .doc(projectId)
      .collection("notifications")
      .orderBy("startedAt", "asc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let includesElement = get()
              .notifications.map((n: INotification) => n.id)
              .includes(change.doc.id);
            if (!includesElement) {
              // check if new (timestamp)

              // if (change.doc.data().created)
              if (
                change.doc.data() &&
                change.doc.data().startedAt &&
                new Date().getTime() / 1000 -
                  change.doc.data().startedAt.seconds <
                  30
              ) {
                toast.error(
                  "A sensor is out of normal state with " +
                    change.doc.data().severity +
                    " severity.",
                  {
                    position: toast.POSITION.BOTTOM_CENTER,
                  }
                );
                /*
                NB: Need to have USERNAME and PASSWORD in order to send an SMS.
                fetch(
                  "https://sveve.no/SMS/SendMessage?user=USERNAME&passwd=PASSWORD&to=" +
                    phoneNumber +
                    "&msg=" +
                    message +
                    "&from=CBMS"
                );*/
              }

              const notifications = get().notifications.concat(
                change.doc.data()
              );

              set({
                notifications: notifications,
              });
            }
          }
          if (change.type === "modified") {
            const modifiedDoc = change.doc.data() as INotification;
            if (
              change.doc.data() &&
              change.doc.data().endedAt &&
              new Date().getTime() / 1000 - change.doc.data().endedAt.seconds <
                30
            ) {
              toast.warn("A sensor has returned to normal state ", {
                position: toast.POSITION.BOTTOM_CENTER,
              });
            }

            let objIndex = get().notifications.findIndex(
              (obj: INotification) => obj.id === modifiedDoc.id
            );

            const updatedNotifications = get().notifications;
            updatedNotifications[objIndex] = change.doc.data();
            set({
              notifications: updatedNotifications,
            });
          }
          if (change.type === "removed") {
            if (get().notifications.includes(change.doc.data())) {
              const notifications = get().notifications.filter(
                (notification: INotification) =>
                  notification.id !== change.doc.data().id
              );
              set({
                notifications: notifications,
              });
            }
          }
        });
      });
    set({
      fetchingNotifications: false,
    });
  },
}));

export default useNotificationsStore;
