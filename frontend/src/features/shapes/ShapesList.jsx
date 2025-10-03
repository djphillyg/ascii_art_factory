import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchShapes,
  selectAvailableShapes,
  selectIsLoadingShapes,
  selectError,
} from './shapesSlice';
import styles from './ShapesList.module.scss';

/**
 * ShapesList Component
 *
 * Demonstrates the Redux pattern:
 * 1. useDispatch - Get dispatch function to trigger actions
 * 2. useSelector - Extract specific state from Redux store
 * 3. useEffect - Trigger async data fetching on mount
 * 4. Handle loading/error/success states
 *
 * LEARN THIS PATTERN - You'll repeat it for other features!
 */
function ShapesList() {
  // ===== REDUX HOOKS =====
  const dispatch = useDispatch();

  // Select state slices using selectors
  const shapes = useSelector(selectAvailableShapes);
  const isLoading = useSelector(selectIsLoadingShapes);
  const error = useSelector(selectError);

  // ===== EFFECTS =====
  // Fetch shapes when component mounts
  useEffect(() => {
    dispatch(fetchShapes());
  }, [dispatch]); // Dependency: only run when dispatch changes (which is never)

  // ===== RENDER LOGIC =====
  // Handle loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading shapes...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>Error loading shapes</h3>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => dispatch(fetchShapes())}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!shapes || shapes.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No shapes available</p>
      </div>
    );
  }

  // Happy path - display shapes
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Shapes</h2>
      <div className={styles.grid}>
        {shapes.map((shape) => (
          <div key={shape.type} className={styles.card}>
            <h3 className={styles.shapeType}>{shape.type}</h3>
            <p className={styles.description}>{shape.description}</p>

            <div className={styles.params}>
              <h4>Required Parameters:</h4>
              <ul>
                {shape.requiredParameters.map((param) => (
                  <li key={param.name}>
                    <strong>{param.name}</strong>
                    <span className={styles.type}>({param.type})</span>
                    {param.constraint && (
                      <span className={styles.constraint}> - {param.constraint}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {shape.optionalParameters && shape.optionalParameters.length > 0 && (
              <div className={styles.params}>
                <h4>Optional Parameters:</h4>
                <ul>
                  {shape.optionalParameters.map((param) => (
                    <li key={param.name}>
                      <strong>{param.name}</strong>
                      <span className={styles.type}>({param.type})</span>
                      {param.description && (
                        <span className={styles.description}> - {param.description}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShapesList;
