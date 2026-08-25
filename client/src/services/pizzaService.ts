import api from './api';

export const getAllPizzas = async () => {
  const response = await api.get('/pizzas');
  return response.data;
};

export const getFeaturedPizzas = async () => {
  const response = await api.get('/pizzas/featured');
  return response.data;
};

export const getPizzaById = async (id) => {
  const response = await api.get(`/pizzas/${id}`);
  return response.data;
};
