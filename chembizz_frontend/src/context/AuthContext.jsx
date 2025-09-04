import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(() => {
        try {
            return {id: localStorage.getItem("myCompanyId")}
        } catch (error) {
            console.error("Error parsing JSON from localStorage:", error);
            return null;
        }
    });

	return <AuthContext.Provider value={{ authUser:authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};