import {createSlice} from '@reduxjs/toolkit'

// this is where you would put any function calls


const initialState = {
    isModalOpen: false,
    sidebarVisible: true,
    theme: 'light',
}

const ui = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleModal: (state, action) => {
            state.toggleModal = action.payload
        },
        toggleSidebar: (state, action) => {
            state.toggleSidebar = action.payload
        },
        setTheme: (state, action) => {
            state.theme = action.payload
        }
    }
})

export default ui.reducer