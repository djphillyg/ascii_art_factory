import { useSelector } from 'react-redux'
import { Box, Text } from '@chakra-ui/react'
import { selectCurrentShapeType } from './shapeGeneratorSlice'
import CircleOptions from './CircleOptions'
import RectangleOptions from './RectangleOptions'
import PolygonOptions from './PolygonOptions'
import TextOptions from './TextOptions'
import { terminalTheme } from '../../theme/terminal'

/**
 * OptionsPanel Component
 *
 * Displays shape-specific options based on the selected shape type
 * Terminal-styled options panel - shows only shape-specific inputs (not shared options)
 */
export default function OptionsPanel({ showSharedOptions = false }) {
    const currentShapeType = useSelector(selectCurrentShapeType)

    // Helper function to render the correct options component
    const renderOptions = () => {
        switch (currentShapeType) {
            case 'circle':
                return <CircleOptions showSharedOptions={showSharedOptions} />
            case 'rectangle':
                return <RectangleOptions showSharedOptions={showSharedOptions} />
            case 'polygon':
                return <PolygonOptions showSharedOptions={showSharedOptions} />
            case 'text':
                return <TextOptions showSharedOptions={showSharedOptions} />
            default:
                return (
                    <Text
                        color={terminalTheme.colors.gray[500]}
                        fontFamily={terminalTheme.fonts.mono}
                        fontSize="sm"
                    >
                        [ No shape selected - waiting for input... ]
                    </Text>
                )
        }
    }

    return (
        <Box>
            <Text
                color={terminalTheme.colors.cyan[500]}
                fontSize="sm"
                fontWeight="bold"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wider"
            >
                &gt; Configuration
            </Text>
            {renderOptions()}
        </Box>
    )
}