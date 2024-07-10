import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Share, ScrollView, Modal, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [mood, setMood] = useState('');
  const [description, setDescription] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const handleTrackMood = () => {
    const newEntry = { mood, description, date: selectedDay };
    setMoodHistory((prevHistory) => [...prevHistory, newEntry]);
  };

  const handleShare = () => {
    setSharing(true);
    const shareMessage = `I'm feeling ${mood} today! ${description}`;
    Share.share({ message: shareMessage })
      .then((result) => {
        console.log(result);
        setSharing(false);
      })
      .catch((error) => {
        console.error(error);
        setSharing(false);
      });
  };

  const handleDayPress = (day) => {
    setSelectedDay(day.dateString);
    setShowCalendar(false);
  };

  const getAverageMoodRating = (history) => {
    if (history.length === 0) return 'N/A';
    const ratings = history.map(entry => {
      switch (entry.mood) {
        case 'happy': return 10;
        case 'neutral': return 5;
        case 'sad': return 0;
        case 'excited': return 8;
        case 'anxious': return 3;
        case 'tired': return 2;
        default: return 5; // default for custom emojis
      }
    });
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return `${average.toFixed(1)}/10`;
  };

  const getMostCommonMood = () => {
    if (moodHistory.length === 0) return 'N/A';
    const moodCount = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    const mostCommonMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);
    return mostCommonMood;
  };

  const getLongestStreak = () => {
    if (moodHistory.length === 0) return 'N/A';
    let maxStreak = 1, currentStreak = 1;
    for (let i = 1; i < moodHistory.length; i++) {
      if (new Date(moodHistory[i].date) - new Date(moodHistory[i - 1].date) === 86400000) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 1;
      }
    }
    return `${maxStreak} days`;
  };

  const getPersonalizedQuote = () => {
    const quotes = {
      happy: "Happiness is a direction, not a place.",
      neutral: "Keep your face always toward the sunshine—and shadows will fall behind you.",
      sad: "Tough times never last, but tough people do.",
      excited: "The only way to do great work is to love what you do.",
      anxious: "You are stronger than you think.",
      tired: "Rest and self-care are so important.",
    };
    return quotes[mood] || "Keep going, you're doing great!";
  };

  const getMoodBasedRecommendations = () => {
    const recommendations = {
      happy: "Listen to upbeat music, go for a run, or call a friend!",
      neutral: "Try some light reading, a walk in the park, or some relaxing music.",
      sad: "Consider watching a funny movie, talking to a friend, or doing some yoga.",
      excited: "Channel your energy into a new project or hobby!",
      anxious: "Practice deep breathing, meditation, or talk to a friend.",
      tired: "Take a nap, relax with a good book, or watch your favorite show.",
    };
    return recommendations[mood] || "Take care of yourself, and do something you love!";
  };

  const interpretMoodFromDescription = (input) => {
    // Predefined keywords or phrases to match against
    const keywords = {
      happy: ['happy', 'joyful', 'excited', 'great', 'awesome'],
      neutral: ['neutral', 'calm', 'okay', 'fine', 'content'],
      sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable'],
      excited: ['excited', 'enthusiastic', 'eager', 'thrilled', 'amped'],
      anxious: ['anxious', 'nervous', 'worried', 'stressed', 'tense'],
      tired: ['tired', 'exhausted', 'fatigued', 'weary', 'sleepy'],
    };

    // Convert input to lowercase for case-insensitive matching
    const lowerInput = input.toLowerCase();

    // Check each mood keyword list for matches
    for (const moodKey in keywords) {
      if (keywords[moodKey].some(keyword => lowerInput.includes(keyword))) {
        return moodKey;
      }
    }

    // Default to neutral if no matches found
    return 'neutral';
  };

  const handleTextInputChange = (text) => {
    setDescription(text);
    const interpretedMood = interpretMoodFromDescription(text);
    setMood(interpretedMood);
  };

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setMood('custom'); // Set a custom mood type for custom emojis
      setMoodHistory((prevHistory) => [...prevHistory, { mood: 'custom', description: '', date: selectedDay }]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>MoodTracker</Text>
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <View style={styles.emojiContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setMood('happy')}>
              <Text style={mood === 'happy' ? styles.selectedEmoji : styles.emoji}>😊</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMood('neutral')}>
              <Text style={mood === 'neutral' ? styles.selectedEmoji : styles.emoji}>😐</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMood('sad')}>
              <Text style={mood === 'sad' ? styles.selectedEmoji : styles.emoji}>😔</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMood('excited')}>
              <Text style={mood === 'excited' ? styles.selectedEmoji : styles.emoji}>😁</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMood('anxious')}>
              <Text style={mood === 'anxious' ? styles.selectedEmoji : styles.emoji}>😰</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMood('tired')}>
              <Text style={mood === 'tired' ? styles.selectedEmoji : styles.emoji}>😴</Text>
            </TouchableOpacity>
           </ScrollView>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Describe your mood"
            value={description}
            onChangeText={handleTextInputChange}
            maxLength={100}
          />
          <TouchableOpacity style={styles.button} onPress={handleTrackMood}>
            <Text style={styles.buttonText}>Track Mood</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share Mood</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <Text>Current Mood Streak: {moodHistory.length} days</Text>
          <Text>Most Common Mood: {getMostCommonMood()}</Text>
          <Text>Longest Streak: {getLongestStreak()}</Text>
          <Text>Average Mood Rating: {getAverageMoodRating(moodHistory)}</Text>
        </View>
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <Text>{getMoodBasedRecommendations()}</Text>
        </View>
        <View style={styles.quotesSection}>
          <Text style={styles.sectionTitle}>Today's Quote</Text>
          <Text>{getPersonalizedQuote()}</Text>
        </View>
        <View style={styles.calendarSection}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              [selectedDay]: { selected: true },
            }}
          />
        </View>
        {showCalendar && (
          <View style={styles.calendarOverlay}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                [selectedDay]: { selected: true },
              }}
            />
          </View>
        )}
        <Modal visible={showEmojiPicker} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Custom Emoji</Text>
              <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
                <Text style={styles.buttonText}>Choose from Library</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setShowEmojiPicker(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
  },
  moodSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 10,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 40,
    marginHorizontal: 10,
  },
  selectedEmoji: {
    fontSize: 40,
    marginHorizontal: 10,
    borderColor: 'blue',
    borderWidth: 2,
    borderRadius: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 50,
  },
  button: {
    height: 40,
    backgroundColor: 'tomato',
    padding: 5,
    borderRadius: 50,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  statsSection: {
    marginBottom: 20,
  },
  recommendationsSection: {
    marginBottom: 20,
  },
  quotesSection: {
    marginBottom: 20,
  },
  calendarSection: {
    marginTop: 20,
  },
  calendarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
});
