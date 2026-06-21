import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import { Row, Col, ListGroup } from 'react-bootstrap';
import Rating from '../components/rating';
import { store } from '../store';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAILURE':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

function ProductScreen() {
    const navigate = useNavigate();
    const params = useParams();
    const { slug } = params;
    const [productState, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: '',
    });
    const { product, loading, error } = productState;
    
    // fetch produktu data is api
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`http://localhost:5000/api/products/${slug}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            }catch (err) {
                dispatch({ type: 'FETCH_FAILURE', payload: err.message });
            }
        };
        fetchData();
    }, [slug]);

    const { state: ctxState, dispatch: ctxDispatch } = useContext(store);
    const { cart } = ctxState;
    // prideda preke i krepseli tikrina ar preke jau yra krepselyje jei yra atnaujina kieki jei ne prideda nauja preke
    const addToCartHandler = () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        if (product.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }

        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

        navigate('/cart');
    };

    // produktu trinimas
    const deleteProductHandler = async () => {
        if (!window.confirm('Delete this product?')) {
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/api/products/id/${product._id}`);
            navigate('/');
        } catch (err) {
            window.alert(err.response?.data?.message || err.message);
        }
    };
    return loading? (
        <div>Loading...</div>
    ) : error ? (
        <div>{error}</div>
    ) : (
        <div>
            <Row>
                {/* produkto  */}
                <Col md={6}>
                    <img src={product.image} alt={product.name} className="img-fluid" />
                </Col>
                <Col md={3}>
                    <ListGroup>
                        <ListGroup.Item>
                            <h1>{product.name}</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>{product.description}</p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating rating={product.rating} numReviews={product.numReviews} />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h3>${product.price.toFixed(2)}</h3>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <button onClick={addToCartHandler} className="prodButton me-2">Add to Cart</button>
                            <Link to={`/products/${product._id}/edit`} className="btn btn-secondary me-2">
                                Edit Product
                            </Link>
                            <button onClick={deleteProductHandler} className="btn btn-danger">
                                Delete Product
                            </button>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </div>
    );
}

export default ProductScreen;
