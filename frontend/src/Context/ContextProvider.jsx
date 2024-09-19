import React, { createContext, useContext, useState } from 'react';

// Create the context
const Context = createContext();

// Custom hook to use the context
export const useContextProvider = () => {
    return useContext(Context);
}

const ContextProvider = ({ children }) => {
    const [sidebarNavigate, setSidebarNavigate] = useState(null);
console.log(sidebarNavigate,'sideBarNavigate');

    return (
        <Context.Provider value={{ sidebarNavigate, setSidebarNavigate }}>
            {children}
        </Context.Provider>
    );
}

export default ContextProvider;
