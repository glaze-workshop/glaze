import { FC, memo, useCallback } from 'react'
import { Grid, GridItem } from '@chakra-ui/react'
import InputWithTmp from '../../../pages/project/components/RightBar/InputWithTmp'
import CtlWrapper from './CtlWrapper'
import { FontParam } from '@glaze/types'

export interface FontCtlProps {
  name: string
  value: FontParam
  onChange: (v: FontParam) => unknown
}

const FontCtl: FC<FontCtlProps> = ({ name, value, onChange }) => {
  const handleFontColorChange = useCallback(
    (color: string) => {
      onChange({ ...value, color: color.length == 0 ? undefined : color })
    },
    [onChange, value]
  )

  const handleFontSizeChange = useCallback(
    (size: string) => {
      onChange({ ...value, fontSize: size.length == 0 ? undefined : size })
    },
    [onChange, value]
  )

  return (
    <CtlWrapper name={name}>
      <Grid gridTemplateColumns={'60px 1fr'} alignItems="center" gap={3}>
        <GridItem>Color</GridItem>
        <GridItem>
          <InputWithTmp value={value.color ?? ''} onChange={handleFontColorChange} />
        </GridItem>
        <GridItem>Size</GridItem>
        <GridItem>
          <InputWithTmp value={(value.fontSize as string) ?? ''} onChange={handleFontSizeChange} />
        </GridItem>
      </Grid>
    </CtlWrapper>
  )
}

export default memo(FontCtl)
