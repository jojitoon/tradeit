import React, { useEffect, useState } from 'react';
import firebase from '../configs/firebase';
import axios from 'axios';
import {
  Button,
  InputGroup,
  Intent,
  Spinner,
  Tooltip,
} from '@blueprintjs/core';
import { geolocated } from 'react-geolocated';
import { useHistory } from 'react-router-dom';

const Signup = ({ coords, isGeolocationAvailable }) => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [phone, setPhone] = useState();
  const [location, setLocation] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (isGeolocationAvailable) {
      console.log('Available geolocation');
      console.log(coords);
      if (coords) {
        console.log('Latitude is :', coords.latitude);
        console.log('Longitude is :', coords.longitude);
        setLocation([coords.latitude, coords.longitude]);
      }
    }
  }, [isGeolocationAvailable, coords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (user) => {
          const data = await axios.post('/users/create', {
            phone,
            email,
            location,
            username,
          });
          history.push('/');
          console.log(data);
        })
        .catch((error) => {
          setLoading(false);

          console.error(error.message);
        });
    } catch (error) {
      console.error(error.message);
    }
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
      <h2>Signup</h2>
      <form
        style={{ width: '100%', maxWidth: '300px' }}
        onSubmit={handleSubmit}
      >
        <InputGroup
          type='text'
          placeholder='Enter your username...'
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        <InputGroup
          type='email'
          placeholder='Enter your Email...'
          onChange={({ target }) => setEmail(target.value)}
        />

        <br />
        <InputGroup
          type='phone'
          placeholder='Enter your phone...'
          onChange={({ target }) => setPhone(target.value)}
        />

        <br />
        <InputGroup
          placeholder='Enter your password...'
          rightElement={lockButton}
          onChange={({ target }) => setPassword(target.value)}
          type={showPassword ? 'text' : 'password'}
        />
        <br />
        <InputGroup
          // type='text'
          value={location ? location.join(',') : ''}
          placeholder='Enter your location...'
          onChange={({ target }) => setLocation(target.value.split(','))}
        />
        <br />
        {loading ? (
          <Spinner intent='success' />
        ) : (
          <Button
            rightIcon='arrow-right'
            intent='success'
            type='submit'
            text='Sign up'
            large
          />
        )}
      </form>
    </div>
  );
};
export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
})(Signup);
