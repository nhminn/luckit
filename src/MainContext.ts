import { createContext, useContext } from "react";
import { UserType } from "./types/user";

export const MainContext = createContext<{
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    userData: UserType | null;
    setUserData: React.Dispatch<React.SetStateAction<UserType | null>>;
}>({
    loggedIn: false,
    setLoggedIn: () => { },
    loading: true,
    setLoading: () => { },
    userData: null,
    setUserData: () => { }
});

export const useMainContext = () => {
    return useContext(MainContext);
}