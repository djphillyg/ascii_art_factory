import { useSelector } from 'react-redux'
import { Box, Text } from '@chakra-ui/react'
import { selectCurrentShapeType } from './shapeGeneratorSlice'
import CircleOptions from './CircleOptions'
import RectangleOptions from './RectangleOptions'
import PolygonOptions from './PolygonOptions'
import TextOptions from './TextOptions'

/**
 * OptionsPanel Component
 *
 * Displays shape-specific options based on the selected shape type
 * All options are wrapped in a consistent Box for visual consistency
 */
export default function OptionsPanel() {
    const currentShapeType = useSelector(selectCurrentShapeType)

    // Helper function to render the correct options component
    const renderOptions = () => {
        switch (currentShapeType) {
            case 'circle':
                return <CircleOptions />
            case 'rectangle':
                return <RectangleOptions />
            case 'polygon':
                return <PolygonOptions />
            case 'text':
                return <TextOptions />
            default:
                return <Text color="gray.600">Select a shape to see options</Text>
        }
    }

    return (
        <Box
            bg="white"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.200"
        >
            {renderOptions()}
        </Box>
    )
}