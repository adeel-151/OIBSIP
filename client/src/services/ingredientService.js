import api from './api';

export const getAllIngredients = async () => {
  const response = await api.get('/ingredients');
  return response.data;
};

export const getIngredientsByCategory = async (category) => {
  const response = await api.get(`/ingredients/${category}`);
  return response.data;
};