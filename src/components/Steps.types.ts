import React, { RefObject } from "react";

export interface ISteps {
    nextStep?: () => void,
    previousStep?: () => void,
    handleSubmit?: () => void,
    children?: React.ReactChild,
    onClick?: () => void
};

export interface IStep1 {
    setCompanyName?: Function,
    setCompanyEmail?: Function,
    setCompanyPassword?: Function,
    setFullname?: Function,
    setEmail?: Function,
    setNumber?: Function,
    setAddress?: Function,
    setPassword?: Function
    emailRef?: RefObject<HTMLInputElement>;
};

export interface IStep2 {
    setCompanyAddress?: Function,
    setCompanyNumber?: Function,
    setAbout?: Function
};

export interface IStep3 {
    setCompanyDescription?: Function,
    setCv?: Function,
    onInput?: Function
};

export interface IStep4 {
    setCompanyImage: Function,
};