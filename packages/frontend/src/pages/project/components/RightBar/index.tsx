import { FC, memo, useMemo } from 'react'
import { SelectedNodeInfoSubject } from '../../../../components/GlazeEditor/state'
import { editorSharedDocument } from '../../../../components/GlazeEditor/EditorSharedDocument'
import { Box, Flex } from '@chakra-ui/react'
import LayoutPanel from './LayoutPanel'
import NameIdPanel from './NameIdPanel'
import PropsPanel from './PropsPanel'
import { useObservableEagerState } from 'observable-hooks'
import { createYjsMapProxy, NodeProxy } from '../../../../components/GlazeEditor/yjs.hook'
import { notEmpty } from '@glaze/common'

export interface RightBarProps {}
const RightBar: FC<RightBarProps> = () => {
  const selectedId = useObservableEagerState(SelectedNodeInfoSubject)

  const node = useMemo(() => {
    if (notEmpty(selectedId)) {
      const nodeInfo = editorSharedDocument.getNodeById(selectedId)
      if (nodeInfo) {
        return createYjsMapProxy<NodeProxy>(nodeInfo)
      }
    }
    return null
  }, [selectedId])

  return node ? (
    <Flex w="250px" className="border-l" flexDirection="column">
      <Box padding="10px" pb={0}>
        <NameIdPanel nameInfo={node.name} idInfo={node.id} />
      </Box>
      <Box padding="10px" flex={1} overflow="auto">
        <LayoutPanel layoutInfo={node.layout} />
        <PropsPanel componentId={node.componentId} propsInfo={node.props} />
      </Box>
    </Flex>
  ) : (
    <Box w="250px" className="border-l" padding="10px">
      尚未选中元素
    </Box>
  )
}

export default memo(RightBar)
