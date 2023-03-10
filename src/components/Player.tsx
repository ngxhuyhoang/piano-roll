import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import cloneDeep from 'lodash/cloneDeep';

import {
  TOTAL_BARS,
  BEATS_PER_BAR,
  NOTES_IN_OCTAVE,
  TOTAL_OCTAVES,
  DEFAULT_TEMPO,
} from '../constants';
import usePlayer from '../hooks/usePlayer';
import Note from './Note';
import styles from './styles';
import Controllers from './Controllers';

const Player = () => {
  const insets = useSafeAreaInsets();
  const [tempo, setTempo] = useState(DEFAULT_TEMPO);
  const {
    currentBeat,
    isPlaying,
    playPitch,
    play: playTrack,
    stop: stopTrack,
  } = usePlayer();

  const [notes, setNotes] = useState<number[][][]>(
    Array.from({ length: TOTAL_BARS }).map(() =>
      Array.from({ length: BEATS_PER_BAR }).map(() => []),
    ),
  );

  const [contentWidth, setContentWidth] = useState(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scroll = useSharedValue(0);

  useDerivedValue(() => {
    scrollTo(scrollViewRef, scroll.value, 0, false);
  });

  const togglePlayback = () => {
    if (isPlaying) {
      scroll.value = scroll.value;
      stopTrack();
    } else {
      const beats = notes.reduce((all, bar) => [...all, ...bar], []);
      const offset = -3 * (contentWidth / beats.length);
      scroll.value = offset;
      const noteDuration = (60 / tempo) * 1000;
      scroll.value = withTiming(contentWidth + offset, {
        duration: beats.length * noteDuration,
        easing: Easing.linear,
      });
      playTrack(beats, tempo);
    }
  };

  const handleToggleNote = useCallback(
    (barIndex: number, beatIndex: number, pitchIndex: number) => {
      if (isPlaying) {
        return;
      }
      const shouldPlay = !notes[barIndex][beatIndex].includes(pitchIndex);
      setNotes(oldNotes => {
        const newNotes = cloneDeep(oldNotes);
        if (shouldPlay) {
          newNotes[barIndex][beatIndex].push(pitchIndex);
        } else {
          newNotes[barIndex][beatIndex].splice(
            newNotes[barIndex][beatIndex].indexOf(pitchIndex),
            1,
          );
        }
        return newNotes;
      });
      if (shouldPlay) {
        playPitch(pitchIndex);
      }
    },
    [isPlaying, notes, playPitch],
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        style={styles.scrollView}
        contentContainerStyle={{
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
        scrollEnabled={!isPlaying}
        onContentSizeChange={setContentWidth}
        showsHorizontalScrollIndicator={false}>
        {notes.map((bar, barIndex) => (
          <View style={styles.bar} key={barIndex}>
            {bar.map((_beat, beatIndex) => (
              <View style={styles.beat} key={beatIndex}>
                {Array.from({
                  length: NOTES_IN_OCTAVE * TOTAL_OCTAVES + 1,
                }).map((_pitch, pitchIndex) => (
                  <Note
                    key={pitchIndex}
                    onPress={handleToggleNote}
                    barIndex={barIndex}
                    beatIndex={beatIndex}
                    pitchIndex={pitchIndex}
                    notes={notes}
                    isPlaying={isPlaying}
                    currentBeat={currentBeat}
                    colorIndex={pitchIndex % (NOTES_IN_OCTAVE + 1)}
                  />
                ))}
              </View>
            ))}
          </View>
        ))}
      </Animated.ScrollView>
      <Controllers
        isPlaying={isPlaying}
        togglePlayback={togglePlayback}
        setTempo={setTempo}
        tempo={tempo}
      />
    </View>
  );
};

export default Player;
