import { create, StateCreator } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

import { Product } from '@/types';

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}
type MyPersist = (
  config: StateCreator<CartStore>,
  options: PersistOptions<CartStore>
) => StateCreator<CartStore>;

const useCart = create<CartStore, []>(
  (persist as MyPersist)(
    (set, get): CartStore => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast('Item already in cart.');
        }

        set({ items: [...get().items, data] });
        toast.success('Item added to cart.');
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success('Item removed from cart.');
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
