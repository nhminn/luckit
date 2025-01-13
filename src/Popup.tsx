import { useEffect, useState } from "react"
import LoginScreen from "./screens/Login"
import LoadingScreen from "./screens/Loading";
import { MainContext } from "./MainContext";
import MainScreen from "./screens/Main";
import { UserType } from "./types/user";

function Popup() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserType | null>(null);

    const handleUserState = () => {
        chrome.storage.local.get(['token', 'user'], (result) => {
            if (result.token && result.user) {
                setUserData(result.user as UserType);
                setLoggedIn(true);
            }
            setLoading(false);
        });
    }

    useEffect(() => {
        handleUserState();

        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'local') {
                if (changes.token && changes.user) {
                    setUserData(changes.user.newValue as UserType);
                    setLoggedIn(true);
                }
            }
        });

        chrome.runtime.onMessage.addListener((message) => {
            if (message.logout) {
                setLoggedIn(false);
                setUserData(null);
                return;
            }

            if (message.login) {
                handleUserState();
            }
        });

    }, []);

    return (
        <MainContext.Provider value={{ loggedIn, setLoggedIn, loading, setLoading, userData, setUserData }}>
            {!loggedIn && !loading && <LoginScreen />}
            {loggedIn && !loading && <MainScreen />}
            {loading && <LoadingScreen />}
        </MainContext.Provider>
    )
}

export default Popup;