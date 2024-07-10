import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const initialMoodData = [
  { id: '1', date: '2024-07-01', mood: '😊', description: 'Feeling great!' },
  { id: '2', date: '2024-07-02', mood: '😐', description: 'It was an okay day.' },
  { id: '3', date: '2024-07-03', mood: '😔', description: 'Feeling a bit down.' },
];

const MoodHistoryScreen = () => {
  const [moodData, setMoodData] = useState(initialMoodData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMoodData, setFilteredMoodData] = useState(initialMoodData);
  const [newEntry, setNewEntry] = useState({ date: '', mood: '', description: '' });
  const [editEntry, setEditEntry] = useState(null);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.mood}>{item.mood}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity onPress={() => handleEdit(item)}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredData = moodData.filter(item =>
      item.date.includes(text) || item.mood.includes(text) || item.description.includes(text)
    );
    setFilteredMoodData(filteredData);
  };

  const handleAddEntry = () => {
    const newMoodData = [...moodData, { ...newEntry, id: (moodData.length + 1).toString() }];
    setMoodData(newMoodData);
    setFilteredMoodData(newMoodData);
    setNewEntry({ date: '', mood: '', description: '' });
  };

  const handleEdit = (item) => {
    setEditEntry(item);
    setNewEntry({ date: item.date, mood: item.mood, description: item.description });
  };

  const handleUpdateEntry = () => {
    const updatedMoodData = moodData.map(item =>
      item.id === editEntry.id ? { ...editEntry, ...newEntry } : item
    );
    setMoodData(updatedMoodData);
    setFilteredMoodData(updatedMoodData);
    setEditEntry(null);
    setNewEntry({ date: '', mood: '', description: '' });
  };

  const handleDelete = (id) => {
    const newMoodData = moodData.filter(item => item.id !== id);
    setMoodData(newMoodData);
    setFilteredMoodData(newMoodData);
  };

  const handleSort = (criteria) => {
    const sortedData = [...filteredMoodData].sort((a, b) => {
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    });
    setFilteredMoodData(sortedData);
    setSortCriteria(criteria);
    setModalVisible(false);
  };

  const calculateStatistics = () => {
    if (moodData.length === 0) return {};
    const moodCounts = moodData.reduce((acc, item) => {
      acc[item.mood] = (acc[item.mood] || 0) + 1;
      return acc;
    }, {});
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
    return { mostCommonMood };
  };

  const statistics = calculateStatistics();

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by date, mood, or description"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={() => setModalVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMoodData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No mood history available.</Text>
          </View>
        )}
      />
      <View style={styles.newEntryContainer}>
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={newEntry.date}
          onChangeText={(text) => setNewEntry({ ...newEntry, date: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Mood"
          value={newEntry.mood}
          onChangeText={(text) => setNewEntry({ ...newEntry, mood: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={newEntry.description}
          onChangeText={(text) => setNewEntry({ ...newEntry, description: text })}
        />
        {editEntry ? (
          <Button title="Update Entry" onPress={handleUpdateEntry} />
        ) : (
          <Button title="Add Entry" onPress={handleAddEntry} />
        )}
      </View>
      <View style={styles.statisticsContainer}>
        <Text style={styles.statisticsText}>Most Common Mood: {statistics.mostCommonMood || 'N/A'}</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.sortButtons}>
          <TouchableOpacity onPress={() => handleSort('date')}>
    <Text style={styles.sortButtonText}>Sort by Date</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => handleSort('mood')}>
    <Text style={styles.sortButtonText}>Sort by Mood</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => handleSort('description')}>
    <Text style={styles.sortButtonText}>Sort by Description</Text>
  </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  iconContainer: {
    paddingLeft: 10,
  },
  sortButtons: {
    position: 'absolute',
    top: 100,
    right: -30,
    backgroundColor: 'transperent',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 42,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transperent',
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mood: {
    fontSize: 24,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
  },
  editText: {
    color: 'blue',
  },
  deleteText: {
    color: 'red',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
  newEntryContainer: {
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  statisticsContainer: {
    marginTop: 20,
  },
  statisticsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sortButtonText: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

});

export default MoodHistoryScreen;
