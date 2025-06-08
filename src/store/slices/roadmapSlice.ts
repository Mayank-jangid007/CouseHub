import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RoadmapNode, LearningPath } from '@/types';
import { roadmapAPI } from '@/lib/api';

interface RoadmapState {
  roadmaps: LearningPath[];
  selectedRoadmap: LearningPath | null;
  userProgress: Record<string, number>; // roadmapId -> progress percentage
  completedNodes: Record<string, string[]>; // roadmapId -> completed node IDs
  loading: boolean;
  error: string | null;
}

const initialState: RoadmapState = {
  roadmaps: [],
  selectedRoadmap: null,
  userProgress: {},
  completedNodes: {},
  loading: false,
  error: null,
};

export const fetchRoadmaps = createAsyncThunk(
  'roadmap/fetchRoadmaps',
  async () => {
    const roadmaps = await roadmapAPI.getAllRoadmaps();
    return roadmaps;
  }
);

export const fetchRoadmapById = createAsyncThunk(
  'roadmap/fetchRoadmapById',
  async (roadmapId: string) => {
    const roadmap = await roadmapAPI.getRoadmapById(roadmapId);
    return roadmap;
  }
);

export const updateNodeProgress = createAsyncThunk(
  'roadmap/updateNodeProgress',
  async ({ roadmapId, nodeId, completed }: { roadmapId: string; nodeId: string; completed: boolean }) => {
    await roadmapAPI.updateNodeProgress(roadmapId, nodeId, completed);
    return { roadmapId, nodeId, completed };
  }
);

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState,
  reducers: {
    setSelectedRoadmap: (state, action: PayloadAction<LearningPath | null>) => {
      state.selectedRoadmap = action.payload;
    },
    toggleNodeCompletion: (state, action: PayloadAction<{ roadmapId: string; nodeId: string }>) => {
      const { roadmapId, nodeId } = action.payload;
      if (!state.completedNodes[roadmapId]) {
        state.completedNodes[roadmapId] = [];
      }
      
      const completed = state.completedNodes[roadmapId];
      const index = completed.indexOf(nodeId);
      
      if (index > -1) {
        completed.splice(index, 1);
      } else {
        completed.push(nodeId);
      }
      
      // Update progress percentage
      if (state.selectedRoadmap && state.selectedRoadmap.id === roadmapId) {
        const totalNodes = state.selectedRoadmap.nodes.length;
        const completedCount = completed.length;
        state.userProgress[roadmapId] = Math.round((completedCount / totalNodes) * 100);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roadmaps
      .addCase(fetchRoadmaps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmaps.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmaps = action.payload;
        state.error = null;
      })
      .addCase(fetchRoadmaps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch roadmaps';
      })
      // Fetch roadmap by ID
      .addCase(fetchRoadmapById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmapById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRoadmap = action.payload;
        state.error = null;
      })
      .addCase(fetchRoadmapById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch roadmap';
      })
      // Update node progress
      .addCase(updateNodeProgress.fulfilled, (state, action) => {
        const { roadmapId, nodeId, completed } = action.payload;
        if (!state.completedNodes[roadmapId]) {
          state.completedNodes[roadmapId] = [];
        }
        
        const completedNodes = state.completedNodes[roadmapId];
        const index = completedNodes.indexOf(nodeId);
        
        if (completed && index === -1) {
          completedNodes.push(nodeId);
        } else if (!completed && index > -1) {
          completedNodes.splice(index, 1);
        }
      });
  },
});

export const { setSelectedRoadmap, toggleNodeCompletion, clearError } = roadmapSlice.actions;
export default roadmapSlice.reducer;