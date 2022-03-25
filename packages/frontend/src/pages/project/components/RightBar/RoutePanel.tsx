import React, { FC, useState, useEffect } from 'react'
import * as Y from 'yjs'
import {
  Tag,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  InputGroup,
  InputLeftAddon,
  Input
} from '@chakra-ui/react'

export interface RoutePanelProps {
  path?: string
  to?: string
  yMap: Y.Map<any>
}

const RoutePanel: FC<RoutePanelProps> = ({ path, to, yMap }: RoutePanelProps) => {
  const [pathVal, setPathVal] = useState('')
  const [toVal, setToVal] = useState('')

  useEffect(() => {
    path && setPathVal(path)
    to && setToVal(to)
    console.log('[selectedyMap]', yMap)
  }, [path, to])

  return (
    <>
      <Tag size="md" variant="solid" colorScheme="teal" margin="10px 0" width="60px">
        Routes
      </Tag>
      {pathVal && (
        <Table size="sm" marginBottom="10px">
          <Thead>
            <Tr>
              <Th>path</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <InputGroup size="sm">
                <InputLeftAddon children="/" />
                <Input value={pathVal} />
              </InputGroup>
            </Tr>
          </Tbody>
        </Table>
      )}
      {toVal && (
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>to</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <InputGroup size="sm">
                <InputLeftAddon children="/" />
                <Input value={toVal} />
              </InputGroup>
            </Tr>
          </Tbody>
        </Table>
      )}
    </>
  )
}

export default RoutePanel
