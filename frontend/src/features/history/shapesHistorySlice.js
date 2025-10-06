import { createSlice } from '@reduxjs/toolkit'


// i guess in the history it should have a uuid that is searchable
const initialState = {
    history: []
}

const shapeHistorySlice = createSlice({
    name: 'shapeHistory',
    initialState,
    reducers: {
        addToHistory: (state, action) => {
            state.history = [...state.history, {...action.payload }]
        },
        removeFromHistory: (state, action) => {
            const { uuid } = action.payload 
            const index = state.history.findIndex((history) => history.uuid === uuid)
            state.history.splice(index, 1)
        },
        clearHistory: (state) => {
            state.history = []
        }
    }
})

export const selectHistory = (state) => state.shapeHistory.history

export const { addToHistory, removeFromHistory, clearHistory} = shapeHistorySlice.actions

export default shapeHistorySlice.reducer
