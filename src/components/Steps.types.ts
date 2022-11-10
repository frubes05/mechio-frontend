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
    setCompanyNumber?: Function,
    setFullname?: Function,
    setEmail?: Function,
    setNumber?: Function,
    setAddress?: Function,
    setLocation?: Function,
    setPassword?: Function
    emailRef?: RefObject<HTMLInputElement>;
};

export interface IStep2 {
    setCompanyImage?: Function,
    setCompanyAddress?: Function,
    setCompanyLocation?: Function,
    setCompanyNumber?: Function,
    setAbout?: Function
};

export interface IStep3 {
    setCompanyDescription?: Function,
    setAddress?: Function,
    setLocation?: Function,
    onPDFInput?: Function,
    onInput?: Function
};

export interface IStep4 {
    setCompanyImage: Function,
};