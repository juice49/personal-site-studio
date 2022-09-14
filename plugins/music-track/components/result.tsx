import React from 'react'
import styled from 'styled-components'
import { Text, Card, Heading, Label, Badge, Stack } from '@sanity/ui'
import prettyMs from 'pretty-ms'
import { Track } from '../types'

import getAppleMusicImageUrl from '../lib/get-apple-music-image-url'

interface Props {
  track: Track
}

const Result: React.FC<Props> = ({ track }) => (
  <Card as='button' padding={3}>
    <Container>
      <Image
        src={getAppleMusicImageUrl(track.album.appleMusicImageUrl, 150)}
        width={150}
        height={150}
      />
      <DetailsContainer>
        <Stack space={4}>
          <Stack space={3}>
            <Heading as='h3' size={1}>
              {track.name}
            </Heading>
            <Details>
              <Text size={1}>
                {track.artists.map(artist => artist.name).join(', ')}
              </Text>
              <Text size={1}> - </Text>
              <Text size={1}>{track.album.name}</Text>
              {track.explicit && (
                <Badge mode='outline' tone='caution' fontSize={1}>
                  Explicit
                </Badge>
              )}
            </Details>
          </Stack>
          <Label size={0}>
            {prettyMs(track.duration, { secondsDecimalDigits: 0 })}
          </Label>
        </Stack>
      </DetailsContainer>
    </Container>
  </Card>
)

export default Result

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
`

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Details = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;
`

const Image = styled.img`
  display: block;
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 4px;
`
