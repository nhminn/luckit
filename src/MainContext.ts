import { createContext } from "react";

export const MainContext = createContext<{
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
    loggedIn: false,
    setLoggedIn: () => { },
    loading: true,
    setLoading: () => { },
});

export const useMainContext = () => {
    return MainContext;
}