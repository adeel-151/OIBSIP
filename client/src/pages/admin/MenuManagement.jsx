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
        <div className="w-12 h-12 border-4 border-foreground border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-['Chewy'] tracking-wide text-foreground">Menu Configuration</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-lg transition-all border-4 ${
            activeTab === 'ingredients'
              ? 'bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_hsl(var(--primary))] -translate-y-1'
              : 'bg-card text-muted-foreground border-transparent hover:border-foreground/20 hover:bg-secondary/50'
          }`}
        >
          <Package className={activeTab === 'ingredients' ? 'text-primary' : ''} /> 
          Ingredients
        </button>
        <button
          onClick={() => setActiveTab('pizzas')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-lg transition-all border-4 ${
            activeTab === 'pizzas'
              ? 'bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_hsl(var(--primary))] -translate-y-1'
              : 'bg-card text-muted-foreground border-transparent hover:border-foreground/20 hover:bg-secondary/50'
          }`}
        >
          <Pizza className={activeTab === 'pizzas' ? 'text-primary' : ''} /> 
          Pizzas
        </button>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border-4 border-foreground rounded-2xl text-base font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-[4px_4px_0px_0px_hsl(var(--foreground))] border-4 border-foreground hover:-translate-y-1 hover:shadow-none transition-all"
        >
          <Plus className="w-5 h-5 font-black" /> Add Ingredient
        </button>
      </div>

      {/* Ingredients Grid */}
      {activeTab === 'ingredients' && (
        <div className="bg-card border-4 border-foreground rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-secondary text-foreground border-b-4 border-foreground">
                <tr>
                  <th className="p-5 font-black uppercase tracking-wider text-sm border-r-4 border-foreground/20">Name</th>
                  <th className="p-5 font-black uppercase tracking-wider text-sm border-r-4 border-foreground/20">Category</th>
                  <th className="p-5 font-black uppercase tracking-wider text-sm border-r-4 border-foreground/20">Price</th>
                  <th className="p-5 font-black uppercase tracking-wider text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-foreground/20">
                {filteredIngredients.map((item) => (
                  <tr key={item._id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="p-5 border-r-4 border-foreground/10">
                      <span className="font-bold text-lg">{item.name}</span>
                    </td>
                    <td className="p-5 border-r-4 border-foreground/10">
                      <span className={`inline-flex items-center px-4 py-2 border-2 border-foreground rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_hsl(var(--foreground))] ${
                        item.category === 'BASE' ? 'bg-[#fef08a] text-foreground' :
                        item.category === 'SAUCE' ? 'bg-[#fca5a5] text-foreground' :
                        item.category === 'CHEESE' ? 'bg-[#fef08a] text-foreground' :
                        item.category === 'VEGETABLE' ? 'bg-[#86efac] text-foreground' :
                        'bg-[#bfdbfe] text-foreground'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-5 border-r-4 border-foreground/10 font-black text-xl">
                      {item.price === 0 ? <span className="text-muted-foreground">Included</span> : <span className="text-primary">Rs.{item.price}</span>}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-10 h-10 rounded-xl bg-secondary border-2 border-foreground flex items-center justify-center hover:bg-primary hover:text-white hover:-translate-y-1 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:shadow-none transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="w-10 h-10 rounded-xl bg-secondary border-2 border-foreground flex items-center justify-center hover:bg-destructive hover:text-white hover:-translate-y-1 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:shadow-none transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredIngredients.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-10 text-center font-bold text-muted-foreground text-lg">
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
        <div className="bg-card border-4 border-dashed border-foreground/40 rounded-[2rem] p-12 text-center">
          <Pizza className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-60" />
          <h3 className="text-4xl font-['Chewy'] tracking-wide text-foreground mb-3">Pizza Presets</h3>
          <p className="text-lg font-bold text-muted-foreground max-w-md mx-auto">
            Manage pre-configured pizza recipes that appear on the menu. Create combos of your ingredients.
          </p>
          <div className="mt-8 inline-block bg-background border-4 border-foreground px-6 py-3 rounded-full shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <p className="font-black text-primary uppercase tracking-wider">
              {pizzas.length > 0 ? `${pizzas.length} pizzas loaded from database` : 'No preset pizzas in database yet.'}
            </p>
          </div>
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
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border-4 border-foreground rounded-[2rem] shadow-[12px_12px_0px_0px_hsl(var(--foreground))] z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b-4 border-foreground bg-secondary/50 flex justify-between items-center">
                <h3 className="text-3xl font-['Chewy'] tracking-wide text-foreground">
                  {editItem ? 'Edit Ingredient' : 'Add Ingredient'}
                </h3>
                <button 
                  onClick={closeModal} 
                  className="w-10 h-10 rounded-full bg-background border-2 border-foreground flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto">
                <div>
                  <label className="text-base font-black uppercase tracking-wider text-foreground mb-2 block">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Mozzarella"
                    className="w-full px-4 py-3 bg-background border-4 border-foreground rounded-xl font-bold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
                  />
                </div>

                <div>
                  <label className="text-base font-black uppercase tracking-wider text-foreground mb-2 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 bg-background border-4 border-foreground rounded-xl font-bold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-base font-black uppercase tracking-wider text-foreground mb-2 block">Price (Rs.)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-background border-4 border-foreground rounded-xl font-bold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
                  />
                </div>

                <div>
                  <label className="text-base font-black uppercase tracking-wider text-foreground mb-2 block">Image URL (optional)</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-background border-4 border-foreground rounded-xl font-bold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
                  />
                </div>
              </div>

              <div className="p-6 border-t-4 border-foreground bg-secondary/50 flex gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-4 bg-background border-4 border-foreground rounded-2xl font-black text-lg hover:bg-secondary shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-4 bg-primary text-white border-4 border-foreground rounded-2xl font-black text-lg shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-y-1 hover:shadow-none transition-all"
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
