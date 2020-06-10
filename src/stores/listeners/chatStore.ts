import { fire, firestore } from "src/firebase";
import { ChatMessage } from "src/types/project";
import create from "zustand";

const [useChatStore] = create((set, get) => ({
  messages: [],
  initializeChat: async (project: string) => {
    firestore
      .collection("projects")
      .doc(project)
      .collection("chat")
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            if (
              get()
                .messages.map((message: any) => message.id)
                .indexOf(change.doc.id) < 0
            ) {
              const messages = get().messages.concat(
                change.doc.data() as ChatMessage
              );
              set({
                messages: messages,
              });
            }
          }
        });
      });
  },
  sendMessage: async (project: string, email: string, message: string) => {
    const messageRef = firestore
      .collection("projects")
      .doc(project)
      .collection("chat")
      .doc();
    messageRef.set({
      id: messageRef.id,
      message: message,
      createdBy: email,
      createdAt: fire.Timestamp.now(),
    });
  },
}));

export default useChatStore;
