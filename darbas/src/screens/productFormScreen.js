import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// nauju produktu kurimo ir esamu redagavimas
function ProductFormScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [rating, setRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // jiai redeguoja ispradziu esamas data 
  useEffect(() => {
    if (!isEditMode) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/id/${id}`);
        setName(data.name || '');
        setImage(data.image || '');
        setBrand(data.brand || '');
        setCategory(data.category || '');
        setPrice(data.price || 0);
        setCountInStock(data.countInStock || 0);
        setRating(data.rating || 0);
        setNumReviews(data.numReviews || 0);
        setDescription(data.description || '');
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEditMode]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name,
        image,
        brand,
        category,
        price: Number(price),
        countInStock: Number(countInStock),
        rating: Number(rating),
        numReviews: Number(numReviews),
        description,
      };
      if (isEditMode) {
        // egzistuojancio produkto editinimas
        await axios.put(`/api/products/id/${id}`, payload);
      } else {
        // naujo produko kurimas
        await axios.post('/api/products', payload);
      }
      setLoading(false);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="small-container">
      <h1>{isEditMode ? 'Edit Product' : 'Create Product'}</h1>
      {loading && <p>Saving...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input className="form-control" value={image} onChange={(e) => setImage(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input className="form-control" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Count In Stock</label>
          <input type="number" className="form-control" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input type="number" className="form-control" value={rating} onChange={(e) => setRating(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Reviews</label>
          <input type="number" className="form-control" value={numReviews} onChange={(e) => setNumReviews(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductFormScreen;
