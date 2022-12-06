import React from "react";
import "./style/App.css";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";
import Widgets from "./components/Widgets";
import UserInfo from "./components/UserInfo";
// rfce
// Links:
// Firebase data structures
/// https://firebase.google.com/docs/firestore/data-model#:~:text=Note%3A%20Cloud%20Firestore%20supports%20a,structure%20data%20within%20a%20document.

function App() {
  return (
    <div className="app">
      <Sidebar />
      <Feed />
      <Widgets />
      <UserInfo />
    </div>
  );
}

export default App;
