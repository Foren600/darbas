import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';

const productRouter = express.Router();

// Gauna visus produktus
productRouter.get('/', async (req, res) => {
    const products = await Product.find({});
    if (products.length > 0) {
        return res.send(products);
    }
    res.send(data.products);
});

// search kurio nzn ar naudosiu
const PAGE_SIZE = 3;
productRouter.get('/search', async (req, res) => {
    const pageSize = req.query.pageSize || PAGE_SIZE;
    const page = req.query.page || 1;
    const category = req.query.category || '';
    const price = req.query.price || '';
    const rating = req.query.rating || '';
    const order = req.query.order || '';
    const searchQuery = req.query.query || '';

    const queryFilter = searchQuery && searchQuery !== 'all'
        ? { name: { $regex: searchQuery, $options: 'i' } } : {};
    const categoryFilter = category && category !== 'all'
        ? { category: { $regex: category, $options: 'i' } } : {};
    const priceFilter = price && price !== 'all'
        ? { price: { $gte: Number(price.split('-')[0]), $lte: Number(price.split('-')[1]) } } : {};
    const ratingFilter = rating && rating !== 'all'
        ? { rating: { $gte: Number(rating) } } : {};
    const sortOrder =
        order === 'lowest' ? { price: 1 }
        : order === 'highest' ? { price: -1 }
        : { _id: -1 };

    const products = await Product.find({
        ...queryFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
    }).sort(sortOrder).skip(pageSize * (page - 1)).limit(pageSize);

    const countProducts = await Product.countDocuments({
        ...queryFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
    });

    res.send({ products, countProducts, page, pages: Math.ceil(countProducts / pageSize) });
});

// GET all categories
productRouter.get('/categories', async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
});

// CREATE product
productRouter.post('/', async (req, res) => {
    const { name, image, brand, category, description, price, countInStock, rating, numReviews } = req.body;

    const slug = name
        ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : Math.random().toString(36).substring(2, 8);

    const newProduct = new Product({ name, slug, image, brand, category, description, price, countInStock, rating, numReviews });
    const createdProduct = await newProduct.save();
    res.status(201).send(createdProduct);
});

// UPDATE product by id
productRouter.put('/id/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send({ message: 'Product Not Found' });

    const { name, image, brand, category, description, price, countInStock, rating, numReviews } = req.body;
    product.name = name ?? product.name;
    product.slug = name
        ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : product.slug;
    product.image = image ?? product.image;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.countInStock = countInStock ?? product.countInStock;
    product.rating = rating ?? product.rating;
    product.numReviews = numReviews ?? product.numReviews;

    const updatedProduct = await product.save();
    res.send(updatedProduct);
});

// DELETE product by id
productRouter.delete('/id/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send({ message: 'Product Not Found' });
    await product.deleteOne();
    res.send({ message: 'Product deleted successfully' });
});

// GET product by id
productRouter.get('/id/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

// GET product by slug
productRouter.get('/:slug', async (req, res) => {
    const product = (await Product.findOne({ slug: req.params.slug }))
        || data.products.find((x) => x.slug === req.params.slug);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

export default productRouter;
