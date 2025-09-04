import React, { createContext, useState } from 'react';

export const ProfileUpdateContext = createContext();

export const UpdateProfileProvider = ({ children }) => {
    const [updateProfile, setUpdateProfile] = useState(false);

    return (
        <ProfileUpdateContext.Provider value={{ updateProfile, setUpdateProfile }}>
            {children}
        </ProfileUpdateContext.Provider>
    );
};
