'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import React from 'react'
import { convertEndTimeAtom, convertStartTimeAtom } from '@/atoms'
import { TimeInput } from '@/components/ui/time-input'

interface TimeRangeSettingsProps {
  className?: string
}

export function TimeRangeSettings({ className }: TimeRangeSettingsProps) {
  const t = useTranslations('gifConfig')
  const [startTime, setStartTime] = useAtom(convertStartTimeAtom)
  const [endTime, setEndTime] = useAtom(convertEndTimeAtom)

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4">
        <TimeInput
          label={t('startTime')}
          value={startTime}
          onChange={setStartTime}
          placeholder="0"
          description={t('startTimeDesc')}
        />
        <TimeInput
          label={t('endTime')}
          value={endTime}
          onChange={setEndTime}
          placeholder={t('endTimePlaceholder')}
          description={t('endTimeDesc')}
          isInfinitySupported={true}
        />
      </div>
    </div>
  )
}
