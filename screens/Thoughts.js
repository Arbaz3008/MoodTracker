import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ThoughtsScreen() {
  const [thought, setThought] = useState('');
  const [tag, setTag] = useState('');
  const [thoughts, setThoughts] = useState([]);
  const [filter, setFilter] = useState('');
  const [editingThoughtId, setEditingThoughtId] = useState(null);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const handleSaveThought = () => {
    if (editingThoughtId !== null) {
      // Update the thought
      setThoughts(thoughts.map(t => (t.id === editingThoughtId ? { id: t.id, thought, tag, date: t.date } : t)));
      setEditingThoughtId(null);
    } else {
      // Add a new thought
      setThoughts([...thoughts, { id: Math.random().toString(), thought, tag, date: new Date().toISOString() }]);
    }
    setThought('');
    setTag('');
  };

  const handleEditThought = (id) => {
    const thoughtToEdit = thoughts.find(t => t.id === id);
    setThought(thoughtToEdit.thought);
    setTag(thoughtToEdit.tag);
    setEditingThoughtId(id);
  };

  const handleDeleteThought = (id) => {
    setThoughts(thoughts.filter(t => t.id !== id));
  };

  const handleFilterThoughts = (text) => {
    setFilter(text);
  };

  const handleSortThoughts = (criteria) => {
    const sortedThoughts = [...thoughts].sort((a, b) => {
      if (criteria === 'date') {
        return new Date(a.date) - new Date(b.date);
      } else {
        return a[criteria].localeCompare(b[criteria]);
      }
    });
    setThoughts(sortedThoughts);
    setSortMenuVisible(false);
  };

  const handleShareThought = async (thought) => {
    try {
      await Share.share({ message: thought });
    } catch (error) {
      console.error('Error sharing thought:', error);
    }
  };

  const filteredThoughts = thoughts.filter(t => 
    t.thought.includes(filter) || t.tag.includes(filter)
  );

  return (
    <View style={styles.container}>
    
      <TextInput
        style={styles.input}
        placeholder="Write down your thoughts..."
        value={thought}
        onChangeText={setThought}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Tag your thought..."
        value={tag}
        onChangeText={setTag}
      />
      <TouchableOpacity onPress={handleSaveThought} style={styles.saveButton}>
        <Text style={styles.buttonText}>{editingThoughtId ? "Update Thought" : "Save Thought"}</Text>
      </TouchableOpacity>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter thoughts..."
          value={filter}
          onChangeText={handleFilterThoughts}
        />
        <TouchableOpacity onPress={() => setSortMenuVisible(!sortMenuVisible)}>
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {sortMenuVisible && (
        <View style={styles.sortMenu}>
          <TouchableOpacity onPress={() => handleSortThoughts('date')} style={styles.sortButton}>
            <Text style={styles.buttonText}>Sort by Date</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortThoughts('thought')} style={styles.sortButton}>
            <Text style={styles.buttonText}>Sort by Title</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortThoughts('tag')} style={styles.sortButton}>
            <Text style={styles.buttonText}>Sort by Tag</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={filteredThoughts}
        renderItem={({ item }) => (
          <View style={styles.thoughtItem}>
            <Text style={styles.thoughtText}>{item.thought}</Text>
            <Text style={styles.tagText}>Tag: {item.tag}</Text>
            <Text style={styles.dateText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleEditThought(item.id)} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteThought(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShareThought(item.thought)} style={styles.shareButton}>
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  sortMenu: {
    position: 'absolute',
    bottom:240,
    right: 30,
    padding: 30,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 42,
  },
  sortButton: {
    paddingVertical: 10,
  },
  thoughtItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  thoughtText: {
    fontSize: 16,
  },
  tagText: {
    fontSize: 14,
    color: 'gray',
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 5,
  },
  shareButton: {
    backgroundColor: '#2196F3',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
  },
});
