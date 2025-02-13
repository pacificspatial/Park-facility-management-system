import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Root from "./views/root"
import "ag-grid-enterprise"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-balham.css"
import { LicenseManager } from "ag-grid-enterprise"
import "dayjs/locale/ja"
import React, {useEffect} from "react"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import dayjs from "dayjs";
import UseMainData from "./data"
import {createTheme, ThemeProvider} from "@mui/material";
import "dayjs/locale/ja.js"
import Admin from "./views/admin";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCaqv06nz2s3B2NHd5uKRaJ6lL_yKqG1T8",
    authDomain: "echigo-park.firebaseapp.com",
    projectId: "echigo-park",
    storageBucket: "echigo-park.appspot.com",
    messagingSenderId: "297224808140",
    appId: "1:297224808140:web:ea9364588a43bc4bb20469",
    measurementId: "G-7D9JKGXYZ7"
};

const theme = createTheme({
    typography: {
        fontFamily: "monospace",
    }
})

dayjs.locale('ja')

export const MainDataContext = React.createContext()

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
function App() {

    useEffect(() => {
        process.env.REACT_APP_AG_GRID_LICENSE_KEY && LicenseManager.setLicenseKey(process.env.REACT_APP_AG_GRID_LICENSE_KEY)
    }, []);

    const useMainData = UseMainData()


  return (
      <ThemeProvider theme={theme}>
          <BrowserRouter>
              <MainDataContext.Provider value={useMainData}>
                    <Routes>
                      <Route exact path="/" element={<Root />} />
                        <Route exact path="/admin" element={<Admin />} />
                    </Routes>
              </MainDataContext.Provider>
          </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
