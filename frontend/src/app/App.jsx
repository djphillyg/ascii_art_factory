import { useDispatch } from 'react-redux'
import {
  generateShapeAsync,
  setShape,
  updateOptions,
} from '../features/shapeGenerator/shapeGeneratorSlice'
//import styles from './App.module.scss'


/**
 * Main App Component
 *
 * This is your root component. Keep it simple - just layout and routing.
 * Real logic belongs in feature components (like ShapesList).
 */
function App() {
  const dispatch = useDispatch()

  // test the actions
  const testActions = () => {
    console.log('testing actions...')
    // dispatch each action
    dispatch(setShape('circle'))
    dispatch(updateOptions({ radius: 10, isFilled: true }))
    dispatch(generateShapeAsync({
      type: 'circle',
      options: {
        radius: 5,
      }
    }))

  }

  return (
    // <div className={styles.app}>
    //   <header className={styles.header}>
    //     <h1>ASCII Art Generator</h1>
    //     <p>Build beautiful ASCII art with React + Redux</p>
    //   </header>

    //   <main className={styles.main}>
    //     <ShapesList />
    //   </main>

    //   <footer className={styles.footer}>
    //     <p>Built with Vite + React + Redux Toolkit</p>
    //   </footer>
    // </div>
    <div>
      <h1>ASCII Shape generator</h1>
      <button onClick={testActions}>Test Redux Actions</button>
    </div>
  )
}

export default App
