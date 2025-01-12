import { useEffect, useState } from "react"
import LoginScreen from "./screens/Login"
import LoadingScreen from "./screens/Loading";
import { MainContext } from "./MainContext";

function Popup() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        chrome.storage.local.get(['token'], (result) => {
            if (result.token) {
                setLoggedIn(true);
            }
            setLoading(false);
        });
    }, []);

    return (
        <MainContext.Provider value={{ loggedIn, setLoggedIn, loading, setLoading }}>
            {!loggedIn && !loading && <LoginScreen />}
            {loading && <LoadingScreen />}
        </MainContext.Provider>
    )
}

export default Popup;