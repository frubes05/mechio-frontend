import React, { Children, useReducer } from "react";

const initialState = {
  state: {
      companyEmail: '',
      companyName: '',
      _id: '',
      email: '',
      fullname: '',
      number: '',
      address: '',
      loggedIn: false,
      exp: 0,
      iat: 0
  },
  dispatch: () => {},
};

type Company = {
  _id: String;
  companyEmail: String;
  companyName: String;
  company?: boolean;
}

type User = {
  _id: String;
  email: String;
  user?: boolean;
  fullname: String;
  address: String;
  number: String;
}

type Both = {
  exp: Number,
  iat: Number,
  loggedIn: boolean
}

type Initial = Company & User & Both

type Context = {
  state: Initial;
  dispatch?: React.Dispatch<Actions>;
};

type Actions =
  | {
      type: "LOGIN";
      payload: Initial;
    }
  | {
      type: "REGISTER";
      payload: Initial;
    }
  | {
      type: "LOGOUT";
    };

type Children = {
  children: React.ReactNode;
};

const AuthContext = React.createContext<Context>(initialState);

const AuthContextReducer = (state: Initial, action: Actions): Initial => {
  switch (action.type) {
    case "LOGIN":
      return { ...action.payload, loggedIn: true };
    case "REGISTER":
      return {...action.payload, loggedIn: true};
    case "LOGOUT":
      return {...initialState.state, loggedIn: false};
  }
};

const AuthContextProvider = ({ children }: Children) => {
    const [state, dispatch] = useReducer(AuthContextReducer, {
        companyEmail: '',
        companyName: '',
        _id: '',
        email: '',
        fullname: '',
        number: '',
        address: '',
        loggedIn: false,
        exp: 0,
        iat: 0
    });

  return <AuthContext.Provider value={{state, dispatch}}>{children}</AuthContext.Provider>;
};

export {AuthContext, AuthContextProvider};
