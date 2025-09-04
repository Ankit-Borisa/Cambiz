import React, { createContext, useState } from 'react';

export const DisplayPoContext = createContext();

export const DisplayPoProvider = ({ children }) => {
    const [displayPo, setDisplayPo] = useState(false);

    return (
        <DisplayPoContext.Provider value={{ displayPo, setDisplayPo }}>
            {children}
        </DisplayPoContext.Provider>
    );
};
