import React, { useEffect, useState } from 'react';
import { Callout, Card, Elevation, Spinner } from '@blueprintjs/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { geolocated } from 'react-geolocated';

const Products = ({ coords, isGeolocationAvailable }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noCoordsYet, setNOCoordsYet] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getProducts() {
      setLoading(true);

      console.log(coords);

      if (coords) {
        setNOCoordsYet(false);
        const { data } = await axios.get(
          `/products?location=${coords.latitude},${coords.longitude}`
        );
        if (data.success) {
          setProducts(data.products);
          setLoading(false);
        }
      } else {
        setNOCoordsYet(true);
        setLoading(false);
      }
    }

    getProducts();
  }, [history, coords]);

  if (loading)
    return (
      <div
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Spinner intent='success' />
        {noCoordsYet && (
          <Callout intent='primary'>
            Fetching your Location. please be patient
          </Callout>
        )}
      </div>
    );
  return (
    <div>
      <div style={{ padding: '0 20px ' }}>
        <h1>Products</h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '24% 24% 24% 24%',
          gridGap: '1%',
          padding: '20px',
        }}
      >
        {products.map((product, i) => (
          <Card
            key={i}
            interactive={true}
            elevation={Elevation.TWO}
            onClick={() => history.push(`/product/${product._id}`)}
          >
            <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
              <img
                style={{ width: '100%' }}
                src={product.image}
                alt={product.name}
              />
            </div>
            <h5>{product.name}</h5>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default geolocated()(Products);
