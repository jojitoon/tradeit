import React, { useState } from 'react';
import { Button, InputGroup, FileInput, Spinner } from '@blueprintjs/core';
import uploadToStorage from '../utils/uploadToStorage';
import includesAll from '../utils/includesAll';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const CreateProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isValid = includesAll(Object.keys(product), ['name', 'image']);
      if (!isValid) {
        alert('fill all fields');
        return setLoading(false);
      }
      const productObj = { ...product };

      const imageUrl = await uploadToStorage(productObj.image);
      productObj.image = imageUrl;
      const { data } = await axios.post('/products/create', productObj);
      if (data.success) {
        history.push('/');
      }
      return setLoading(false);
    } catch (error) {
      console.log(error.message);
      return setLoading(false);
    }
  };

  const setProductValue = (key, value) =>
    setProduct((prev) => ({
      ...prev,
      [key]: value,
    }));

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h2>Create Product</h2>
      <form
        style={{ width: '100%', maxWidth: '300px' }}
        onSubmit={handleSubmit}
      >
        <InputGroup
          type='text'
          placeholder='Enter Product name...'
          value={product.name}
          onChange={({ target }) => setProductValue('name', target.value)}
        />

        <br />

        <FileInput
          hasSelection={!!product.image}
          text={product.image ? product.image.name : 'Select Product Image'}
          buttonText={product.image ? 'Change' : 'Select'}
          onInputChange={(e) => setProductValue('image', e.target.files[0])}
        />
        <br />
        <br />
        <InputGroup
          type='text'
          placeholder='Enter Product location...'
          value={product.location && product.location.join(',')}
          onChange={({ target }) =>
            setProductValue('location', target.value.split(','))
          }
        />

        <br />

        <InputGroup
          type='text'
          placeholder='Enter Product reach in meters...'
          value={product.radius}
          onChange={({ target }) => setProductValue('radius', target.value)}
        />

        <br />

        {loading ? (
          <Spinner intent='success' />
        ) : (
          <Button
            rightIcon='arrow-right'
            intent='success'
            type='submit'
            text='Create Product'
            large
          />
        )}
      </form>
    </div>
  );
};
export default CreateProduct;
