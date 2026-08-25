import Pizza from '../models/Pizza';
import { getCache, setCache } from '../utils/redis';
export const getAllPizzas = async (req, res, next) => {
    try {
        const cacheKey = 'pizzas:all';
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({ success: true, data: cachedData, source: 'cache' });
        }
        const pizzas = await Pizza.find({ isAvailable: true }).populate('ingredients');
        await setCache(cacheKey, pizzas, 3600);
        res.status(200).json({ success: true, data: pizzas });
    }
    catch (error) {
        next(error);
    }
};
export const getFeaturedPizzas = async (req, res, next) => {
    try {
        const cacheKey = 'pizzas:featured';
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({ success: true, data: cachedData, source: 'cache' });
        }
        const pizzas = await Pizza.find({ isFeatured: true, isAvailable: true }).populate('ingredients');
        await setCache(cacheKey, pizzas, 3600);
        res.status(200).json({ success: true, data: pizzas });
    }
    catch (error) {
        next(error);
    }
};
export const getPizzaById = async (req, res, next) => {
    try {
        const cacheKey = `pizza:${req.params.id}`;
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json({ success: true, data: cachedData, source: 'cache' });
        }
        const pizza = await Pizza.findById(req.params.id).populate('ingredients');
        if (!pizza) {
            return res.status(404).json({ success: false, message: 'Pizza not found' });
        }
        await setCache(cacheKey, pizza, 3600);
        res.status(200).json({ success: true, data: pizza });
    }
    catch (error) {
        next(error);
    }
};
