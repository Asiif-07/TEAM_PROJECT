import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for logged in user on mount
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signup = (name, email, password) => {
        // Check if user already exists (simple simulation)
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const userExists = existingUsers.find((u) => u.email === email);

        if (userExists) {
            return { success: false, message: "User with this email already exists." };
        }

        const newUser = { name, email, password }; // Note: In real app, never store passwords plainly
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        return { success: true };
    };

    const login = (email, password) => {
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const foundUser = existingUsers.find(
            (u) => u.email === email && u.password === password
        );

        if (foundUser) {
            const { password, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
            return { success: true };
        }

        return { success: false, message: "Invalid email or password." };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("currentUser");
    };

    const value = {
        user,
        signup,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
