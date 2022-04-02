import React, { FC, useState, useEffect, ChangeEvent } from 'react'
import * as Y from 'yjs'
import {
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

  const handlePathChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPathVal(e.target.value)
  }

  const handleToChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToVal(e.target.value)
  }

  useEffect(() => {
    path && setPathVal(path)
    to && setToVal(to)
    // console.log('[selectedyMap]', yMap)
  }, [path, to])

  return (
    <>
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
                <Input value={pathVal} onChange={handlePathChange} />
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
                <Input value={toVal} onChange={handleToChange} />
              </InputGroup>
            </Tr>
          </Tbody>
        </Table>
      )}
    </>
  )
}

export default RoutePanel
