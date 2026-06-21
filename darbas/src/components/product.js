import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './rating';

// produkto korta
function Product(props) {
  const { product } = props;
  return (
    <Card className="product-item">
      <Link to={`/products/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/products/${product.slug}`}>
          <h2>{product.name}</h2>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
      </Card.Body>
      <Card.Text>${product.price}</Card.Text>
      <button className="btn btn-primary">Add to Cart</button>
    </Card>
  );
}

export default Product;