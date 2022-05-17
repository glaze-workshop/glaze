import { FC, memo } from 'react'
import { Box, Grid, GridItem, HStack, Input, Tag, VStack } from '@chakra-ui/react'
import * as Y from 'yjs'
import { ComponentFullInfo } from '../../../../components/BasicComponents/basicComponentMap'
import {
  BackgroundControl,
  BackgroundControlProps,
  ControlType,
  FontControl,
  FontControlProps,
  TextControl
} from '../../../../schema/config'
import { useYjsRerender } from '../../../../components/GlazeEditor/yjs.hook'

interface SettingPanelProps<T> {
  propsKey: string
  propsConfig: T
  propsInfo: Y.Map<any>
}

const BackgroundSettingPanel: FC<SettingPanelProps<BackgroundControl>> = ({
  propsKey,
  propsConfig,
  propsInfo
}) => {
  const backgroundConfig: BackgroundControlProps | undefined = propsInfo.get(propsKey)

  useYjsRerender(propsInfo)

  return (
    <Grid templateColumns="80px 1fr" alignItems="center" gap="2">
      <GridItem>背景颜色</GridItem>
      <GridItem>
        <Input
          size="sm"
          value={backgroundConfig?.backgroundColor}
          onChange={(e) =>
            propsInfo.set(propsKey, { ...backgroundConfig, backgroundColor: e.target.value })
          }
        ></Input>
      </GridItem>
      <GridItem>背景图片</GridItem>
      <GridItem>
        <Input
          size="sm"
          value={backgroundConfig?.backgroundImage}
          onChange={(e) =>
            propsInfo.set(propsKey, { ...backgroundConfig, backgroundImage: e.target.value })
          }
        ></Input>
      </GridItem>
    </Grid>
  )
}

const FontSettingPanel: FC<SettingPanelProps<FontControl>> = ({
  propsKey,
  propsConfig,
  propsInfo
}) => {
  const fontConfig: FontControlProps | undefined = propsInfo.get(propsKey)

  useYjsRerender(propsInfo)

  return (
    <Grid templateColumns="80px 1fr" alignItems="center" gap="2">
      <GridItem>字体颜色</GridItem>
      <GridItem>
        <Input
          size="sm"
          value={fontConfig?.color}
          onChange={(e) => propsInfo.set(propsKey, { ...fontConfig, color: e.target.value })}
        ></Input>
      </GridItem>
      <GridItem>字体大小</GridItem>
      <GridItem>
        <Input
          size="sm"
          value={fontConfig?.fontSize}
          onChange={(e) => propsInfo.set(propsKey, { ...fontConfig, fontSize: e.target.value })}
        ></Input>
      </GridItem>
      <GridItem>字体粗细</GridItem>
      <GridItem>
        <Input
          size="sm"
          value={fontConfig?.fontWeight}
          onChange={(e) => propsInfo.set(propsKey, { ...fontConfig, fontWeight: e.target.value })}
        ></Input>
      </GridItem>
      <GridItem>字体家族</GridItem>
      <GridItem>
        <Input
          size="sm"
          value={fontConfig?.fontFamily}
          onChange={(e) => propsInfo.set(propsKey, { ...fontConfig, fontFamily: e.target.value })}
        ></Input>
      </GridItem>
    </Grid>
  )
}

const TextSettingPanel: FC<SettingPanelProps<TextControl>> = ({
  propsKey,
  propsConfig,
  propsInfo
}) => {
  useYjsRerender(propsInfo)

  return (
    <Grid templateColumns="80px 1fr" alignItems="center" gap="2">
      <GridItem>{propsConfig.name}</GridItem>
      <GridItem>
        <Input
          size="sm"
          value={propsInfo.get(propsKey)}
          onChange={(e) => propsInfo.set(propsKey, e.target.value)}
        ></Input>
      </GridItem>
    </Grid>
  )
}

export interface PropsPanelProps {
  propsInfo: Y.Map<any>
  componentFullInfo?: ComponentFullInfo
}

const PropsPanel: FC<PropsPanelProps> = ({ propsInfo, componentFullInfo }) => {
  const propsConfig = componentFullInfo?.config.props

  return (
    <>
      <Box>
        <Tag size="md" variant="solid" colorScheme="teal" margin="10px 0" width="60px">
          Props
        </Tag>
      </Box>
      {propsConfig && (
        <VStack align="start">
          {Object.keys(propsConfig).map((key) => {
            const config = propsConfig[key]

            switch (config.type) {
              case ControlType.BACKGROUND:
                return (
                  <BackgroundSettingPanel
                    key={key}
                    propsKey={key}
                    propsConfig={config}
                    propsInfo={propsInfo}
                  />
                )
              case ControlType.FONT:
                return (
                  <FontSettingPanel
                    key={key}
                    propsKey={key}
                    propsConfig={config}
                    propsInfo={propsInfo}
                  />
                )
              case ControlType.TEXT:
                return (
                  <TextSettingPanel
                    key={key}
                    propsKey={key}
                    propsConfig={config}
                    propsInfo={propsInfo}
                  />
                )
            }

            return <Box>{config.name}</Box>
          })}
        </VStack>
      )}
    </>
  )
}

export default memo(PropsPanel)
