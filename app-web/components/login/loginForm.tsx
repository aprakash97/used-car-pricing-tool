"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

const LoginForm = () => {
  const [isSignin, setIsSignin] = useState<boolean>(true);

  return (
    <>
      <div>loginForm</div>
      <Button
        variant={"outline"}
        onClick={() => {
          setIsSignin(true);
        }}
        disabled={isSignin}
      >
        Signin
      </Button>
      <Button
        variant={"outline"}
        onClick={() => {
          setIsSignin(false);
        }}
        disabled={!isSignin}
      >
        Signup
      </Button>

      <div>{isSignin ? <p>true </p> : <p>false</p>}</div>
    </>
  );
};

export default LoginForm;
