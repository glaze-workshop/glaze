import {
  Box,
  Flex,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack
} from '@chakra-ui/react'
import React, { FC, memo, useState } from 'react'
import FlatPicker from '../../../../../components/FlatPicker'
import { useProjectAnalysis, useProjectDeploymentInfo } from '../../../../../hooks/deployment.hook'
import dayjs from 'dayjs'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'

export interface BasicAnalysisProps {}
const BasicAnalysis: FC<BasicAnalysisProps> = () => {
  const [range, setRange] = useState([
    dayjs().startOf('day').subtract(7, 'day').toDate(),
    dayjs().startOf('day').toDate()
  ])
  const { projectId } = useProjectDeploymentInfo()
  const { chartData, deploymentAnalysis } = useProjectAnalysis(projectId, range[0], range[1])
  return (
    <>
      <Flex align="center" justify="space-between">
        <Text fontSize="xl" fontWeight="bold">
          基础数据分析
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
      <Grid mt={5} templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem w="100%" p={5} borderWidth={1} borderColor="gray.100" rounded="xl">
          <Stat>
            <StatLabel>点击量</StatLabel>
            <StatNumber>{deploymentAnalysis?.count ?? 0}次</StatNumber>
          </Stat>
        </GridItem>
        <GridItem w="100%" p={5} borderWidth={1} borderColor="gray.100" rounded="xl">
          <Stat>
            <StatLabel>流量使用</StatLabel>
            <StatNumber>{deploymentAnalysis?.totalSize ?? 0}byte</StatNumber>
          </Stat>
        </GridItem>
      </Grid>
      <VStack>
        <Box h="400px" w="full">
          <ResponsiveBar
            data={chartData}
            keys={['requestCount', 'userCount']}
            groupMode="grouped"
            indexBy="day"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 17,
              legend: '日期',
              legendPosition: 'middle',
              legendOffset: 40
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '总数',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            legendLabel={({ id }) => (id === 'requestCount' ? '访问量' : '用户量')}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </Box>
        <Box h="400px" w="full">
          <ResponsiveLine
            data={[
              {
                id: '流量使用(kb)',
                color: 'hsl(321, 70%, 50%)',
                data: chartData.map((x) => ({
                  x: x.day,
                  y: x.size / 1024
                }))
              }
            ]}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: true,
              reverse: false
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '日期',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '流量（kb）',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </Box>
      </VStack>
    </>
  )
}

export default memo(BasicAnalysis)
