import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/product';




const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAILURE':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

// fetcinti produktai rodomi pagrindiniame puslapyje
function HomeScreen() {
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: '',
    });
    
    // gaunami visi produktai is api
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('http://localhost:5000/api/products');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            }catch (err) {
                dispatch({ type: 'FETCH_FAILURE', payload: err.message });
            }
        };
        fetchData();
    }, []);
    return (
      <div>
        {/* produkto card*/}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Welcome to the App</h1>
          <Link to="/products/new" className="btn btn-primary">
            Add New Product
          </Link>
        </div>
        <div className="product-list">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <Row>
              {products.map((product, index) => (
                <Col key={product.slug || index} sm={6} md={4} lg={3} className="mb-3">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    );
}

export default HomeScreen;