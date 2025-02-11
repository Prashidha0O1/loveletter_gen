import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Modal,
} from 'react-native';
import ViewShot from "react-native-view-shot"
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { captureRef } from "react-native-view-shot"
import { letterTemplates } from '../../utils/deepseekApi';

const LoveLetterGenerator = () => {
  const [recipientName, setRecipientName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [tone, setTone] = useState('romantic');
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterContent, setLetterContent] = useState('');
  const viewShotRef = useRef(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const toneOptions = [
    { id: 'romantic', icon: 'heart', label: 'Romantic' },
    { id: 'sweet', icon: 'smile-beam', label: 'Sweet' },
    { id: 'passionate', icon: 'fire', label: 'Passionate' },
    { id: 'poetic', icon: 'feather', label: 'Poetic' },
  ];

  const generateLetter = () => {
    setIsGenerating(true);
    const templates = letterTemplates[tone];
    const randomIndex = Math.floor(Math.random() * templates.length);
    const selectedTemplate = templates[randomIndex].body;

    const finalLetter = selectedTemplate.replace(/{occasion}/g, occasion);
    setLetterContent(finalLetter);
    setIsGenerating(false);
    setShowResult(true);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleGenerateLetter = () => {
    generateLetter();
  };

  const handleDownloadAndShare = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.8,
      });
    } catch (error) {
      console.error("Error sharing love letter:", error);
    }
  };

  const ResultModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showResult}
      onRequestClose={() => setShowResult(false)}
    >
      <View style={styles.modalContainer}>
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.8 }}>
          <View style={[styles.letterContainer, styles.letterBackground]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowResult(false)}
            >
              <Ionicons name="close" size={24} color="#FF6B6B" />
            </TouchableOpacity>
            
            <Animated.View
              style={[
                styles.letterContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.letterDate}>February 11, 2025</Text>
              <Text style={styles.letterGreeting}>Dearest {recipientName},</Text>
              <Text style={styles.letterBody}>{letterContent}</Text>
              <Text style={styles.letterClosing}>With all my love,</Text>
              <Text style={styles.letterSignature}>Me</Text>
            </Animated.View>
          </View>
        </ViewShot>

        <View style={styles.letterActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="content-copy" size={20} color="#FF6B6B" />
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadAndShare}>
            <MaterialIcons name="file-download" size={20} color="#FF6B6B" />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="heart" size={40} color="#FF6B6B" />
          </View>
          <Text style={styles.title}>Love Letter Generator</Text>
          <Text style={styles.subtitle}>Create the perfect expression of love</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="#FF6B6B" />
            <TextInput
              style={styles.input}
              placeholder="Recipient's Name"
              value={recipientName}
              onChangeText={setRecipientName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="event" size={24} color="#FF6B6B" />
            <TextInput
              style={styles.input}
              placeholder="Special Occasion (Optional)"
              value={occasion}
              onChangeText={setOccasion}
              placeholderTextColor="#999"
            />
          </View>

          <Text style={styles.toneLabel}>Select Letter Tone</Text>
          <View style={styles.toneContainer}>
            {toneOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.toneOption,
                  tone === option.id && styles.toneOptionSelected,
                ]}
                onPress={() => setTone(option.id)}
              >
                <FontAwesome5
                  name={option.icon}
                  size={20}
                  color={tone === option.id ? '#fff' : '#FF6B6B'}
                />
                <Text
                  style={[
                    styles.toneText,
                    tone === option.id && styles.toneTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={handleGenerateLetter}
            disabled={!recipientName || isGenerating}
          >
            {isGenerating ? (
              <Text style={styles.generateButtonText}>Creating Magic...</Text>
            ) : (
              <View style={styles.generateButtonContent}>
                <MaterialIcons name="favorite" size={24} color="#fff" />
                <Text style={styles.generateButtonText}>Generate Love Letter</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ResultModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFE5E5',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 15,
    textShadowColor: 'rgba(255, 107, 107, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FF8B8B',
    marginTop: 5,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  toneLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  toneContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  toneOptionSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  toneText: {
    marginLeft: 8,
    color: '#FF6B6B',
    fontSize: 14,
  },
  toneTextSelected: {
    color: '#fff',
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#FFB5B5',
    shadowOpacity: 0.1,
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    justifyContent: 'center',
    padding: 20,
  },
  letterContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  letterContent: {
    marginTop: 20,
  },
  letterDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  letterGreeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 15,
  },
  letterBody: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 20,
  },
  letterClosing: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 20,
  },
  letterSignature: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#FF6B6B',
    marginTop: 10,
  },
  letterActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#FFE5E5',
    paddingTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginLeft: 5,
    color: '#FF6B6B',
    fontSize: 16,
  },
  letterBackground: {
    backgroundColor: '#FFE5E5',
  },
});

export default LoveLetterGenerator;