# Listeners

The files in this folder handle real time events such as event triggers, chat messages and project invites. They communicate directly with the Firestore database through real-time listeners. The listeners are implemented in the front-end but could go through the back-end as well with a slight increase in delay. 

The listeners are implemented using the `onSnapshot` method from the Firebase API. When changes are made in the database, the listener will be alerted and handle the change according to instructions in the code.

The files include methods to manipulate data in the collections that are listened to, which will trigger the `onSnapshot` method.
