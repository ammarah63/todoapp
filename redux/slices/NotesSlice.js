import { createSlice } from "@reduxjs/toolkit";

const NotesSlice = createSlice({
  name: "Notes",
  initialState: {
    Notes: null,
  },
  reducers: {
    setNotes: (state, action) => {
      state.Notes = action.payload;
    },
    clearNotes: (state) => {
       state.Notes = null;
    
    },
  },
});

export const {
  setNotes,
  clearNotes,
} = NotesSlice.actions;
export default NotesSlice.reducer;
