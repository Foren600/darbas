import React, { useReducer, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Row, Col } from 'react-bootstrap';
import LoadingBox from '../components/loadingBox';
import MessageBox from '../components/messageBox'; 
import Product from '../components/product';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, products: action.payload.products,
                page:action.payload.page,
                pages:action.payload.pages,
                countProducts:action.payload.countProducts,
                loading: false };

        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


// kainos filtras
const prices = [
    {
        name: '1€ to 50€',
        value: '1-50',
    },
    {
        name: '50€ to 100€',
        value: '50-100',
    },
    {
        name: '100€ to 200€',
        value: '100-200',
    },
    {
        name: '200€ and above',
        value: '200-1000000000',
    }
];

// reitingo filtras
const ratings = [
    {
        name: '4stars & up',
        rating: '4',
    },
    {
        name: '3stars & up',
        rating: '3',
    },
    {
        name: '2stars & up',
        rating: '2',
    },
    {
        name: '1star & up',
        rating: '1',
    }
];


// pagrindine funkcija 
export default function SearchScreen() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const sp = new URLSearchParams(search);
    const catagory = sp.get('catagory') || 'all';
    const query = sp.get('query') || 'all';
    const price = sp.get('price') || 'all';
    const rating = sp.get('rating') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || '1';
    const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        products: [],
        pages: 1,
        countProducts: 0,
    });


    // fetch data su filtrais
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/products/search?query=${query}&catagory=${catagory}&price=${price}&rating=${rating}&order=${order}&page=${page}`
                );
                dispatch({ type: 'FETCH_REQUEST', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, [query, catagory, price, rating, order, page]);


    const[catagories, setCatagories] = useState([]);
    useEffect(() => {
        const fetchCatagories = async () => {
            try {
                const { data } = await axios.get(`/api/products/catagories`);
                setCatagories(data);
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCatagories();
    }, []);

    // filrtu keitimas
    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCatagory = filter.catagory || catagory;
        const filterQuery = filter.query || query;
        const filterRating = filter.rating || rating;
        const filterPrice = filter.price || price;
        const sortOrder = filter.order || order;

        return `/search?catagory=${filterCatagory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
    }

    return (
        //filtru pasirinkimai
        <div>
            <Row>
                <Col md={3}>
                    <h3>departments</h3>
                    <div>
                        <ul>
                            <li>
                                <Link className={'all' === catagory ? 'text-bold' : ''} to={getFilterUrl({ catagory: 'all' })}>
                                    All Departments
                                </Link>
                            </li>
                            {catagories.map((c) => (
                                <li key={c}>
                                    <Link className={c === catagory ? 'text-bold' : ''} to={getFilterUrl({ catagory: c })}>
                                        {c}
                                    </Link>
                                </li>
                            ))}
                        </ul>      
                    </div>
                        <div>
                            <h3>price</h3>
                            <ul>
                                <li>
                                    <Link className={'all' === price ? 'text-bold' : ''} to={getFilterUrl({ price: 'all' })}>
                                        All Prices
                                    </Link>
                                </li>

                                {prices.map((p) => (
                                <li key={p.value}>
                                    <Link className={p.value === price ? 'text-bold' : ''} to={getFilterUrl({ price: p.value })}>
                                        {p.name}
                                    </Link>
                                </li>
                                ))}

                            </ul>
                        </div>

                        <div>
                            <h3>Avg. Customer Review</h3>
                            <ul>
                                <li>
                                    <Link className={'all' === rating ? 'text-bold' : ''} to={getFilterUrl({ rating: 'all' })}>
                                        All Reviews
                                    </Link>
                                </li>
                                {ratings.map((r) => (
                                    <li key={r.rating}>
                                        <Link className={r.rating === rating ? 'text-bold' : ''} to={getFilterUrl({ rating: r.rating })}>
                                            {r.name}
                                        </Link>
                                    </li>
                                ))}

                                    <li>
                                        <Link className={'' === rating ? 'text-bold' : ''} to={getFilterUrl({ rating: '' })}>
                                            No Rating
                                        </Link>
                                    </li>

                            </ul>
                        </div>

                </Col>
                <Col md={9}>
                
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (  
                    <>
                    <Row className="justify-content-between mb-3">

                        <div>
                            {/* rezultatu skaicius ir pasirinkti filtrai */}
                            {countProducts === 0 ? 'No' : countProducts} Results
                            {query !== 'all' && ' : ' + query}
                            {catagory !== 'all' && ' : ' + catagory}
                            {price !== 'all' && ' : Price ' + price}
                            {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                            {/* Show clear filters button if any filter is active */}
                            {query !== 'all' || catagory !== 'all' || price !== 'all' || rating !== 'all' ? (
                                <button
                                    className="btn btn-light"
                                    onClick={() => {
                                        navigate(getFilterUrl({
                                            query: 'all',
                                            catagory: 'all',
                                            price: 'all',
                                            rating: 'all',
                                            page: 1,
                                        }));
                                    }}
                                >
                                    Clear Filters
                                </button>
                            ) : null}
                        </div>
                    </Row>
                    </>
                )}


                </Col>

                {/* Sort dropdown menu */}
                sort by{' '}
                <select
                    value={order}
                    onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                    }}
                >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                </select>

            </Row>

                    {products.length === 0 && <MessageBox>No Product Found</MessageBox>}

                    <Row>

                        {products.map((product) => (
                            <Col sm={6} lg={4} className="mb-3" key={product._id}>
                                <Product product={product}></Product>
                            </Col>
                        ))}

                    </Row>


                    <div>
                        {[...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                to={getFilterUrl({ page: x + 1 })}
                            >

                                <button
                                    className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}>
                                {x + 1}
                                </button>
                            </Link>
                        ))}
                    </div>

        </div>
    );
}