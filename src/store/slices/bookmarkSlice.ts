import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SearchResult } from '@/types';
import { bookmarkAPI } from '@/lib/api';

interface BookmarkState {
  bookmarks: SearchResult[];
  loading: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
  error: null,
};

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (userId: string) => {
    const bookmarks = await bookmarkAPI.getUserBookmarks(userId);
    return bookmarks;
  }
);

export const addBookmark = createAsyncThunk(
  'bookmarks/addBookmark',
  async ({ userId, resource }: { userId: string; resource: SearchResult }) => {
    await bookmarkAPI.addBookmark(userId, resource.id);
    return resource;
  }
);

export const removeBookmark = createAsyncThunk(
  'bookmarks/removeBookmark',
  async ({ userId, resourceId }: { userId: string; resourceId: string }) => {
    await bookmarkAPI.removeBookmark(userId, resourceId);
    return resourceId;
  }
);

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    clearBookmarks: (state) => {
      state.bookmarks = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookmarks
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload;
        state.error = null;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookmarks';
      })
      // Add bookmark
      .addCase(addBookmark.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks.push(action.payload);
        state.error = null;
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add bookmark';
      })
      // Remove bookmark
      .addCase(removeBookmark.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== action.payload);
        state.error = null;
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove bookmark';
      });
  },
});

export const { clearBookmarks, clearError } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;