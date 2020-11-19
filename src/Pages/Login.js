import React, { useState } from 'react';
import firebase from '../configs/firebase';
import {
  Button,
  InputGroup,
  Intent,
  Spinner,
  Tooltip,
} from '@blueprintjs/core';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        setLoading(false);
        console.error('Incorrect username or password');
      });
  };

  const lockButton = (
    <Tooltip content={`${showPassword ? 'Hide' : 'Show'} Password`}>
      <Button
        icon={showPassword ? 'unlock' : 'lock'}
        intent={Intent.WARNING}
        minimal={true}
        onClick={() => setShowPassword((prev) => !prev)}
      />
    </Tooltip>
  );

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h2>Login</h2>
      <form
        style={{ width: '100%', maxWidth: '300px' }}
        onSubmit={handleSubmit}
      >
        <InputGroup
          type='text'
          placeholder='Enter your Email...'
          onChange={({ target }) => setEmail(target.value)}
        />

        <br />
        <InputGroup
          placeholder='Enter your password...'
          rightElement={lockButton}
          onChange={({ target }) => setPassword(target.value)}
          type={showPassword ? 'text' : 'password'}
        />

        <br />
        {loading ? (
          <Spinner intent='success' />
        ) : (
          <Button
            rightIcon='arrow-right'
            intent='success'
            type='submit'
            text='Sign in'
            large
          />
        )}
      </form>
    </div>
  );
};
export default Login;
