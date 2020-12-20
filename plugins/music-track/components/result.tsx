import React from 'react'
import { Badge } from '@sanity/ui'
import Label from 'part:@sanity/components/labels/default'
import prettyMs from 'pretty-ms'
import { Track } from '../types'
import styles from './search.css'

import getAppleMusicImageUrl from '../lib/get-apple-music-image-url'

interface Props {
  track: Track
}

const Result: React.FC<Props> = ({ track }) => (
  <div className={styles.container}>
    <img
      src={getAppleMusicImageUrl(track.album.appleMusicImageUrl, 150)}
      className={styles.image}
      width={150}
      height={150}
    />
    <div>
      <Label>{track.name}</Label>
      <div className={styles.details}>
        <span className={styles.detailsItem}>
          {track.artists.map(artist => artist.name).join(', ')}
        </span>
        <span className={styles.detailsItem}> - </span>
        <span className={styles.detailsItem}>{track.album.name}</span>
        {track.explicit && (
          <span className={styles.detailsItem}>
            <Badge mode='outline' tone='caution'>
              Explicit
            </Badge>
          </span>
        )}
      </div>
      <p className={styles.duration}>
        {prettyMs(track.duration, { secondsDecimalDigits: 0 })}
      </p>
    </div>
  </div>
)

export default Result
