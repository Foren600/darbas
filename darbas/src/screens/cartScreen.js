import { useContext } from "react";
import { store } from '../store';
import { Row, Col, ListGroup, Button } from "react-bootstrap";

// krepselis
export default function CartScreen() {
    const { state, dispatch: ctxDispatch } = useContext(store);
    const cartItems = state.cart?.cartItems || [];

    return (
        <div>
            <h1>Shopping Cart</h1>
            {/* jiai krepselis tuscias rodo, kad tuscias */}
            {cartItems.length === 0 ? (
                <div>Cart is empty. <a href="/">Go shopping</a></div>
            ) : (
                <Row>{/* rodo krepseli esanciu produktu savybes */}
                    <Col md={8}>
                        <ListGroup>
                            {cartItems.map((item, index) => (
                                <ListGroup.Item key={item._id || item.slug || index}>
                                    <Row className="align-items-center">
                                        <Col md={6}>{item.name}</Col>
                                        <Col md={3}>
                                            {/* miktukas sumazint kieki*/}
                                            <Button variant="light" disabled={item.quantity === 1}>
                                                <i className="fas fa-minus-circle"></i>
                                            </Button>{' '}
                                            <span>{item.quantity}</span>{' '}
                                            {/* miktukas padidint kieki */}
                                            <Button variant="light">
                                                <i className="fas fa-plus-circle"></i>
                                            </Button>
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <h2>Order Summary</h2>
                        <div>Total items: {cartItems.reduce((a, c) => a + c.quantity, 0)}</div>
                        <div>
                            Total price: ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0).toFixed(2)}
                        </div>
                        <div className="mt-3">
                            <h3>
                                subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items): ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0).toFixed(2)}
                            </h3>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
}
