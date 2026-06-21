import ProductScreen from './screens/productScreen';
import SearchScreen from './screens/searchScreens';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/homeScreen';
import { Navbar, Container, Nav, Badge, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { store } from './store';
import CartScreen from './screens/cartScreen';
import SignInScreen from './screens/singinScreen';
import navDropdown from 'react-bootstrap/NavDropdown';
import SignUpScreen from './screens/signupScreen';
import ProfileScreen from './screens/profileScreen';
import SearchBox from './components/searchBox';
import ProductFormScreen from './screens/productFormScreen';

function App() {
      const { state, dispatch: ctxDispatch } = useContext(store);
      const { cart, userInfo } = state;
      const singoutHandler = () => {
        ctxDispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
      }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>skelbiu tik blogiau</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <SearchBox/>
                <LinkContainer to="/cart">
                  <Nav.Link>
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger" className="ms-1">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/signout" onClick={singoutHandler}>
                      <NavDropdown.Item>Sign Out</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/signin">
                    <Nav.Link>Sign In</Nav.Link>
                  </LinkContainer>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main> 
          <Container>
          <Routes>
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/signin" element={<SignInScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/products/new" element={<ProductFormScreen />} />
          <Route path="/products/:id/edit" element={<ProductFormScreen />} />
          <Route path="/products/:slug" element={<ProductScreen />} />
          <Route path="/" element={<HomeScreen />} />
          </Routes>
          </Container>
      </main>
      <footer className="text-center">
        <div className="footer-content">
          <div className="text-center">
            <p>&copy; 2026 skelbiu tik blogiau. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;