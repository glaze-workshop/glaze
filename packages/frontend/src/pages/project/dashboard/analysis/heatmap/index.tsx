import { Box, Flex, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { FC, memo, useEffect, useRef, useState } from 'react'
import FlatPicker from '../../../../../components/FlatPicker'
import { useProjectDeploymentInfo, useQueryClickEvents } from '../../../../../hooks/deployment.hook'
import { useGlazeMessageListener } from './message'

export interface HeatmapProps {}

const Heatmap: FC<HeatmapProps> = () => {
  const [range, setRange] = useState([
    dayjs().subtract(7, 'day').toDate(),
    dayjs().startOf('day').toDate()
  ])

  const { projectId, deploymentInfo } = useProjectDeploymentInfo()
  const { clickEvents } = useQueryClickEvents(projectId, range[0], range[1])

  const iframeRef = useRef<HTMLIFrameElement>(null)
  useGlazeMessageListener(iframeRef, clickEvents)

  return (
    <>
      <Flex align="center" justify="space-between">
        <Text fontSize="xl" fontWeight="bold">
          热力图分析
        </Text>
        <FlatPicker
          data-enable-time
          initConfig={{
            mode: 'range',
            maxDate: 'today'
          }}
          value={range}
          onChange={(e) => {
            if (e.length === 2) {
              setRange(e)
            }
          }}
        />
      </Flex>

      {deploymentInfo && (
        <Box
          mt="16px"
          borderWidth={1}
          borderColor="gray.200"
          borderRadius="md"
          w="100%"
          h="800px"
          as="iframe"
          ref={iframeRef}
          src={`https://${deploymentInfo.path}.glaze-heatmap.localhost`}
        />
      )}
    </>
  )
}
export default memo(Heatmap)
