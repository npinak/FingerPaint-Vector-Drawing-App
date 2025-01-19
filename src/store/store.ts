import { configureStore } from '@reduxjs/toolkit'
import AppInfoSlice from './appInfo'
import ToolSelectionSlice from '@/store/toolSelection'

// ...

export const store = configureStore({
  reducer: {
    toolSelection: ToolSelectionSlice,
    appInfo: AppInfoSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
