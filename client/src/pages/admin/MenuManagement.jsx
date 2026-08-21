import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Pizza, Search, Package } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

const CATEGORIES = ['BASE', 'SAUCE', 'CHEESE', 'VEGETABLE', 'MEAT'];

const MenuManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'BASE', price: '', image: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ingredientsRes, pizzasRes] = await Promise.all([
        api.get('/ingredients'),
        api.get('/pizzas')
      ]);
      setIngredients(ingredientsRes.data.data || ingredientsRes.data || []);
      setPizzas(pizzasRes.data.data || pizzasRes.data || []);
    } catch (error) {
      // Fallback demo data
      setIngredients([
        { _id: 'b1', name: 'Classic Thin', category: 'BASE', price: 80 },
        { _id: 'b2', name: 'Hand Tossed', category: 'BASE', price: 70 },
        { _id: 's1', name: 'Classic Tomato', category: 'SAUCE', price: 0 },
        { _id: 'c1', name: 'Mozzarella', category: 'CHEESE', price: 35 },
        { _id: 'v1', name: 'Mushrooms', category: 'VEGETABLE', price: 25 },
        { _id: 'v2', name: 'Bell Pepper', category: 'VEGETABLE', price: 15 },
        { _id: 'm1', name: 'Pepperoni', category: 'MEAT', price: 45 },
      ]);
      setPizzas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.category) {
      toast.error('Name and category are required');
      return;
    }

    try {
      if (editItem) {
        await api.put(`/ingredients/${editItem._id}`, form);
        toast.success('Ingredient updated');
      } else {
        await api.post('/ingredients', form);
        toast.success('Ingredient added');
      }
      fetchData();
      closeModal();
    } catch (error) {
      toast.error(editItem ? 'Update failed' : 'Add failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;
    try {
      await api.delete(`/ingredients/${id}`);
      toast.success('Ingredient deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, price: item.price, image: item.image || '' });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditItem(null);
    setForm({ name: '', category: 'BASE', price: '', image: '' });
  };

  const filteredIngredients = ingredients.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'ingredients'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" /> Ingredients
        </button>
        <button
          onClick={() => setActiveTab('pizzas')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === 'pizzas'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Pizza className="w-4 h-4 inline mr-2" /> Pizzas
        </button>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Ingredient
        </button>
      </div>

      {/* Ingredients Grid */}
      {activeTab === 'ingredients' && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredIngredients.map((item) => (
                  <tr key={item._id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="p-4">
                      <span className="font-semibold text-sm">{item.name}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.category === 'BASE' ? 'bg-amber-500/10 text-amber-400' :
                        item.category === 'SAUCE' ? 'bg-red-500/10 text-red-400' :
                        item.category === 'CHEESE' ? 'bg-yellow-500/10 text-yellow-400' :
                        item.category === 'VEGETABLE' ? 'bg-green-500/10 text-green-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-sm">
                      {item.price === 0 ? <span className="text-muted-foreground">Included</span> : `Rs.${item.price}`}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredIngredients.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-muted-foreground text-sm">
                      No ingredients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pizzas Tab */}
      {activeTab === 'pizzas' && (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <Pizza className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-bold font-heading mb-2">Pizza Presets</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Manage pre-configured pizza recipes that appear on the menu. Create combos of your ingredients.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            {pizzas.length > 0 ? `${pizzas.length} pizzas loaded from database` : 'No preset pizzas in database yet.'}
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold font-heading">
                  {editItem ? 'Edit Ingredient' : 'Add Ingredient'}
                </h3>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Mozzarella"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Price (Rs.)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Image URL (optional)</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  {editItem ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MenuManagement;
