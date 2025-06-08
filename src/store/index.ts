import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import searchSlice from './slices/searchSlice';
import roadmapSlice from './slices/roadmapSlice';
import bookmarkSlice from './slices/bookmarkSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'bookmarks'], // Only persist auth and bookmarks
};

const rootReducer = combineReducers({
  auth: authSlice,
  search: searchSlice,
  roadmap: roadmapSlice,
  bookmarks: bookmarkSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;