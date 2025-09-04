import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Create a context for the active tab state
export const ActiveContext = createContext();

// Custom hook to use the ActiveContext
export const useActiveContext = () => {
    return useContext(ActiveContext);
};

// Provider component to manage and provide the active tab state
export const ActiveContextProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState("Home");
    const location = useLocation(); // Use the useLocation hook inside the component

    useEffect(() => {
        // Update activeTab based on the current pathname
        const pathName = location.pathname;

        const finalPath = pathName.split("/")[2]

        if (finalPath === "buying-inquiry" ) {
            setActiveTab("Buying Inquiry");
        } else if (finalPath === "home") {
            setActiveTab("Home");
        } else if (finalPath === "catalog") {
            setActiveTab("My Catalog");
        } else if (finalPath === "selling-inquiry") {
            setActiveTab("Selling Inquiry");
        } else if (finalPath === "purchase-data") {
            setActiveTab("PO Data");
        } else if (finalPath === "sales-data") {
            setActiveTab("Sales Data");
        } else if (finalPath === "sales-return") {
            setActiveTab("Sales Return");
        } else if (finalPath === "purchase-return") {
            setActiveTab("Purchase Return");
        } else if(finalPath === "payment-detail"){
            setActiveTab("Payment Detail");
        }

    }, [location.pathname]); // Depend on location.pathname

    return (
        <ActiveContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </ActiveContext.Provider>
    );
};
