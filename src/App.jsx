import React from "react";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import Calendar from "./components/Calendar";

const App = () => {
  return (
    <>
      <Provider store={appStore}>
        <Calendar />
      </Provider>
    </>
  );
};

export default App;
