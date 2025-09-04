import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../BASE_URL";

export const NotiContext = createContext();

export const useNotiContext = () => {
    return useContext(NotiContext);
};

export const NotiContextProvider = ({ children }) => {
    const [notifications, setNotifications] = useState("");
    const [notificationsArray, setNotificationArray] = useState([]);

    const fetchNotifications = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/notification/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()

        // setNotificationArray(data.data)
        const filteredNotifications = data.data.filter(notification => notification.title !== "Welcome");
        setNotificationArray(filteredNotifications);

    }

    useEffect(() => {
        fetchNotifications();
    }, [notifications, setNotifications]);


    return <NotiContext.Provider value={{ notifications: notifications, setNotifications, notificationsArray }}>{children}</NotiContext.Provider>;
};