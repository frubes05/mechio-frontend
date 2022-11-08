import React, { Children, useReducer, useState } from "react";

const initialState = {
  state: {
      companyEmail: '',
      companyName: '',
      companyPremium: false,
      _id: '',
      email: '',
      userLocation: '',
      fullname: '',
      number: '',
      address: '',
      loggedIn: false,
      exp: 0,
      iat: 0
  },
  dispatch: () => {},
  showAll: false,
  setShowAll: () => {}
};

type Company = {
  _id: String;
  companyEmail: String;
  companyName: String;
  company?: boolean;
  companyPremium: boolean;
}

type User = {
  _id: String;
  email: String;
  user?: boolean;
  fullname: String;
  address: String;
  number: String;
  userLocation: String;
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
  showAll: boolean;
  setShowAll: Function;
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
    }
  | {
    type: "PAYMENT"
    payload: Initial;
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
    case "PAYMENT":
      return {...action.payload, companyPremium: true}
  }
};

const AuthContextProvider = ({ children }: Children) => {
    const [showAll, setShowAll] = useState<boolean>(false);
    const [state, dispatch] = useReducer(AuthContextReducer, {
        companyEmail: '',
        companyName: '',
        companyPremium: false,
        _id: '',
        userLocation: '',
        email: '',
        fullname: '',
        number: '',
        address: '',
        loggedIn: false,
        exp: 0,
        iat: 0
    });

  return <AuthContext.Provider value={{state, dispatch, showAll, setShowAll}}>{children}</AuthContext.Provider>;
};

export {AuthContext, AuthContextProvider};
