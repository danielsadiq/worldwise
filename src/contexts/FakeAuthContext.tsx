import React, { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
const initialState = { user: null, isAuthenticated: false };
type UserType = {
  name:string,
  email:string,
  password:string,
  avatar:string,
}

type StateType = {
  user:UserType|null,
  isAuthenticated:boolean
}
type ActionType =
  | { type: "login"; payload: UserType } // Adjust the type of 'payload' as needed
  | { type: "logout" };

function reducer(state:StateType, action:ActionType) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action");
  }
}

const AuthContext = createContext({
  user: {name:"", email:"", password:"", avatar:""},
  isAuthenticated:false
});
function AuthProvider({ children }: { children: React.ReactElement }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email:string, password:string ) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({type: "logout"})
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  else return context
}

export { useAuth, AuthProvider };
