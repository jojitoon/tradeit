import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Elevation,
  Button,
  Intent,
  TextArea,
  Spinner,
  Callout,
} from '@blueprintjs/core';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import truncate from 'truncate';

const SingleProduct = () => {
  const [product, setProduct] = useState(null);
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState('');
  const [replyId, setReplyId] = useState(null);
  const { productId } = useParams();

  const getProduct = useCallback(async () => {
    const { data } = await axios.get(`/products/${productId}`);
    console.log(data);
    if (data.success) {
      setProduct(data.product);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) getProduct();
  }, [productId, getProduct]);

  const addComment = async () => {
    setCommenting(true);
    try {
      const { data } = await axios.post('/users/comment', {
        comment,
        replyId: replyId && replyId._id,
        productId,
      });

      if (data.success) {
        await getProduct();
        setCommenting(false);
        setComment('');
        setReplyId(null);
      }
    } catch (error) {
      setCommenting(false);
    }
  };
  return (
    product && (
      <div>
        <div style={{ padding: '0 20px ' }}>
          <h1>Product</h1>
        </div>
        <div
          style={{
            padding: '20px',
          }}
        >
          <Card
            interactive={true}
            elevation={Elevation.TWO}
            onClick={() => alert(product.name)}
          >
            <div style={{ display: 'flex', height: '450px' }}>
              <div
                style={{
                  width: '50%',
                  height: '450px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  style={{ width: '100%' }}
                  src={product.image}
                  alt={product.name}
                />
              </div>
              <div>
                <h2>{product.name.toUpperCase()}</h2>
                <h2>By {product.userId.username}</h2>
                <p>created on {new Date(product.created_at).toDateString()}</p>
              </div>
            </div>
          </Card>
        </div>

        <div
          style={{
            padding: '20px',
          }}
        >
          <h2>Comments</h2>
          {product.comments.length ? (
            <div>
              {product.comments.map((comment) => (
                <div key={comment._id}>
                  <Callout id={comment._id} intent='success'>
                    {comment.message}{' '}
                    <button
                      onClick={() => {
                        setReplyId(comment);
                        window.scrollTo(0, document.body.scrollHeight);
                      }}
                    >
                      reply
                    </button>
                  </Callout>
                  {comment.comment && (
                    <Callout
                      onClick={() => {
                        const el = document.getElementById(comment.comment._id);
                        el.style.border = '1px solid red';
                        el.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(function () {
                          el.style.border = 'none';
                        }, 2000);
                      }}
                    >
                      {truncate(comment.comment.message, 200)}
                    </Callout>
                  )}
                  <br />
                </div>
              ))}
            </div>
          ) : (
            <div>No comments. Be the first to comment </div>
          )}
          <div>
            <br />
            {replyId && (
              <Callout intent='primary'>
                reply to : {truncate(replyId.message, 50)}{' '}
                <button onClick={() => setReplyId(null)}>cancel</button>
              </Callout>
            )}
            <TextArea
              fill
              placeholder='Enter your comment...'
              growVertically={true}
              intent={Intent.PRIMARY}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <br />
            <br />
            {commenting ? (
              <Spinner intent='success' />
            ) : (
              <Button
                disabled={!comment.length}
                // rightIcon='arrow-right'
                // intent='success'
                type='button'
                text='Comment'
                large
                onClick={addComment}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default SingleProduct;
