import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Keyboard, Dimensions } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { Share } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [pieChartData, setPieChartData] = useState([
    { name: 'Happy', population: 40, color: '#0f0', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Sad', population: 30, color: '#f00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Neutral', population: 30, color: '#00f', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ]);

  const [barChartData, setBarChartData] = useState({
    labels: ['Anxiety', 'Joy', 'Frustration'],
    datasets: [
      {
        data: [20, 50, 30],
      },
    ],
  });

  const [lineChartData, setLineChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  });

  const [goal, setGoal] = useState('');
  const [reminder, setReminder] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [insights, setInsights] = useState('');

  const handleSaveGoal = () => {
    Keyboard.dismiss();
    console.log('Goal saved:', goal);
    setGoal('');
  };
  const handleSaveReminder = () => {
    Keyboard.dismiss(); 
    console.log('Reminder set:', reminder);
    setReminder('');
  };
  const handleSaveJournalEntry = () => {
    Keyboard.dismiss();
    console.log('Journal entry saved:', journalEntry);
    setJournalEntry('');
  };
  const handleShare = () => {
    const shareText = `Check out my mood statistics!\nGoal: ${goal}\nReminder: ${reminder}`;
    Share.share({
      message: shareText,
    })
      .then(result => console.log(result))
      .catch(error => console.log(error));
  };
  const handleShowDatePicker = () => {
  };
  const handleConfirmDate = (date) => {
  };
  const handleCancelDate = () => {
  };
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.chartTitle}>Mood Distribution</Text>
      <PieChart
        data={pieChartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <Text style={styles.chartTitle}>Emotion Breakdown</Text>
      <BarChart
        data={barChartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
      <Text style={styles.chartTitle}>Mood Trends</Text>
      <LineChart
        data={lineChartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
      />
      <Text style={styles.sectionTitle}>Goal Setting</Text>
      <TextInput
        style={styles.input}
        placeholder="Set your goal..."
        value={goal}
        onChangeText={setGoal}
        onSubmitEditing={handleSaveGoal}
      />
      <TouchableOpacity onPress={handleSaveGoal} style={styles.button}>
        <Text style={styles.buttonText}>Save Goal</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Set a Reminder</Text>
      <TextInput
        style={styles.input}
        placeholder="Set a reminder..."
        value={reminder}
        onChangeText={setReminder}
        onSubmitEditing={handleSaveReminder}
      />
      <TouchableOpacity onPress={handleSaveReminder} style={styles.button}>
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Mood Journaling</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Write your journal entry..."
        value={journalEntry}
        onChangeText={setJournalEntry}
        multiline
      />
      <TouchableOpacity onPress={handleSaveJournalEntry} style={styles.button}>
        <Text style={styles.buttonText}>Save Journal Entry</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Personalized Insights</Text>
      <Text style={styles.insights}>{insights || 'No insights available.'}</Text>
      <TouchableOpacity onPress={handleShare} style={[styles.button, { backgroundColor: '#4CAF50' }]}>
        <Text style={styles.buttonText}>Share Statistics</Text>
      </TouchableOpacity>
      <Text style={styles.comingSoon}>More features coming soon...</Text>
      <DateTimePickerModal
        isVisible={true} // Set to true when needed
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={handleCancelDate}
      />
    </ScrollView>
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
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 20,
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
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  insights: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
    color: '#888',
  },
  comingSoon: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});
