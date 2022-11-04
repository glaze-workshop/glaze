import { FC, memo, useCallback } from 'react'
import { BackgroundParam } from '@glaze/types'
import { FormControl, FormLabel, Grid, GridItem } from '@chakra-ui/react'
import InputWithTmp from '../../../pages/project/components/RightBar/InputWithTmp'
import CtlWrapper from './CtlWrapper'

export interface BackgroundCtlProps {
  name: string
  value: BackgroundParam
  onChange: (v: BackgroundParam) => unknown
}

const BackgroundCtl: FC<BackgroundCtlProps> = ({ name, value, onChange }) => {
  const handleImageChange = useCallback(
    (image: string) => {
      onChange({ ...value, backgroundImage: image.length == 0 ? undefined : image })
    },
    [onChange, value]
  )

  const handleBackgroundChange = useCallback(
    (color: string) => {
      onChange({ ...value, backgroundColor: color.length == 0 ? undefined : color })
    },
    [onChange, value]
  )

  return (
    <CtlWrapper name={name}>
      <Grid gridTemplateColumns={'60px 1fr'} alignItems="center" gap={3}>
        <GridItem>Image</GridItem>
        <GridItem>
          <InputWithTmp value={value.backgroundImage ?? ''} onChange={handleImageChange} />
        </GridItem>
        <GridItem>Color</GridItem>
        <GridItem>
          <InputWithTmp value={value.backgroundColor ?? ''} onChange={handleBackgroundChange} />
        </GridItem>
      </Grid>
    </CtlWrapper>
  )
}

export default memo(BackgroundCtl)
