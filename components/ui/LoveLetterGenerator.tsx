import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Modal,
  Linking,
  Image,
  Platform,
} from 'react-native';  
import ViewShot from "react-native-view-shot";
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { captureRef } from "react-native-view-shot";
import { letterTemplates } from '../../utils/deepseekApi';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import config from '../../config';

// Import your icons
const githubIcon = require('../../assets/images/github.png');
const linkedinIcon = require('../../assets/images/linkedin.png');
const onlyfansIcon = require('../../assets/images/of.png');

// Initialize Gemini API with your API Key
const genAI = new GoogleGenerativeAI("AIzaSyCulHvXvRHonZut6wcqvIqCeZwdP-c0b90");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const LoveLetterGenerator = () => {
  const [recipientName, setRecipientName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [tone, setTone] = useState('romantic');
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterContent, setLetterContent] = useState('');
  const viewShotRef = useRef(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [letterContent]);

  const toneOptions = [
    { id: 'romantic', icon: 'heart', label: 'Romantic' },
    { id: 'sweet', icon: 'smile-beam', label: 'Sweet' },
    { id: 'passionate', icon: 'fire', label: 'Passionate' },
    { id: 'poetic', icon: 'feather', label: 'Poetic' },
  ];

  const handleGenerateLetter = async () => {
    if (!recipientName) return;
  
    setIsGenerating(true);
    
    try {
      const prompt = `Write a ${tone} love letter for ${recipientName}. Occasion: ${occasion || "Just because"}.`;
      
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();

      console.log("Generated Letter:", responseText);

      setLetterContent(responseText);
      setShowResult(true);
    } catch (error) {
      console.error("Error generating love letter:", error);
      alert("Failed to generate the love letter. Please try again.");
    }
  
    setIsGenerating(false);
  };

  useEffect(() => {
    console.log("Updated Letter Content:", letterContent);
  }, [letterContent]);

  const handleDownloadAndShare = async () => {
    try {
      const uri = await captureRef(viewShotRef, { format: "png", quality: 0.8 });
      const filePath = FileSystem.cacheDirectory + 'love_letter.png';
      await FileSystem.moveAsync({ from: uri, to: filePath });
      await Sharing.shareAsync(filePath);
    } catch (error) {
      console.error("Error sharing love letter:", error);
    }
  };

  const handleCopyToClipboard = async () => {
    if (letterContent) {
      try {
        await Clipboard.setStringAsync(letterContent);
        alert("Letter copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        alert("Failed to copy to clipboard. Please try again.");
      }
    } else {
      alert("No letter content to copy.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="heart" size={40} color="#FF6B6B" />
          </View>
          <Text style={styles.title}>Cupid Quill</Text>
          <Text style={styles.subtitle}>Create the perfect expression of love</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="user" size={24} color="#FF6B6B" />
            <TextInput
              style={styles.input}
              placeholder="Recipient's Name"
              value={recipientName}
              onChangeText={setRecipientName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="calendar-alt" size={24} color="#FF6B6B" />
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
                <FontAwesome5 name="magic" size={24} color="#fff" />
                <Text style={styles.generateButtonText}>Generate Love Letter</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.resultContainer} ref={viewShotRef}>
          {letterContent ? (
            <Text style={styles.letterText}>{letterContent}</Text>
          ) : (
            <Text style={styles.placeholderText}>Your letter will appear here...</Text>
          )}
        </View>

        {letterContent && (
          <>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyToClipboard}>
              <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton} onPress={handleDownloadAndShare}>
              <Text style={styles.shareButtonText}>Share Letter</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Crafted with ❤ by Prashidha Rawal</Text>
        <Text style={styles.footerText}>Enjoying the app? Show some love by following me on socials!</Text>
        <View style={styles.socialLinks}>
          <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Prashidha0O1')}>
            <FontAwesome5 name="github" size={30} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/prashidha-rawal-032697212/')}>
            <FontAwesome5 name="linkedin" size={30} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://onlyfans.com/serialkisser69')}>
            <Image source={onlyfansIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://x.com/0xPrashidha')}>
            <FontAwesome5 name="twitter" size={30} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (styles remain unchanged)
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
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFE4E1",
    borderRadius: 10,
    minHeight: 200,
  },
  letterText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
  placeholderText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
  copyButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#FF8B8B',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FFE5E5',
  },
  footerText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 10,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
});

export default LoveLetterGenerator;