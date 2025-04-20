/**
 * Machine Learning Classifiers
 * Implements XGBoost, Logistic Regression, and Gaussian models
 */

import * as tf from '@tensorflow/tfjs';
import { UrlFeatures, normalizeFeatures } from '@/utils/urlFeatureExtractor';

// Simple weights for our models (in a real app these would be trained)
const WEIGHTS = {
  xgboost: [0.8, 0.7, 0.9, 0.6, 0.7, 0.6, 0.8, 0.95, 0.85, 0.9, 0.6],
  logistic: [0.7, 0.6, 0.8, 0.5, 0.6, 0.5, 0.7, 0.9, 0.8, 0.85, 0.55],
  gaussian: [0.75, 0.65, 0.85, 0.55, 0.65, 0.55, 0.75, 0.9, 0.82, 0.87, 0.58]
};

// Threshold for safe classification
const SAFETY_THRESHOLD = 0.65;

// Model class that simulates the ML models
export class PhishingClassifier {
  private models: {
    xgboost: tf.LayersModel | null;
    logistic: tf.LayersModel | null;
    gaussian: tf.LayersModel | null;
  };
  
  private isLoaded: boolean = false;

  constructor() {
    this.models = {
      xgboost: null,
      logistic: null,
      gaussian: null
    };
  }

  // Load models (in a real app, this would load pre-trained models)
  async loadModels(): Promise<void> {
    if (this.isLoaded) return;
    
    try {
      // Create simple models that simulate our classifiers
      // In a real app, you would load proper trained models
      
      // XGBoost-like model (dense neural network)
      const xgboostModel = tf.sequential();
      xgboostModel.add(tf.layers.dense({
        inputShape: [11],
        units: 16,
        activation: 'relu'
      }));
      xgboostModel.add(tf.layers.dense({
        units: 8,
        activation: 'relu'
      }));
      xgboostModel.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
      }));
      xgboostModel.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });
      
      // Logistic Regression-like model (single layer)
      const logisticModel = tf.sequential();
      logisticModel.add(tf.layers.dense({
        inputShape: [11],
        units: 1,
        activation: 'sigmoid'
      }));
      logisticModel.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });
      
      // Gaussian-like model (multi-layer with different activations)
      const gaussianModel = tf.sequential();
      gaussianModel.add(tf.layers.dense({
        inputShape: [11],
        units: 12,
        activation: 'relu'
      }));
      gaussianModel.add(tf.layers.dense({
        units: 8,
        activation: 'tanh'
      }));
      gaussianModel.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
      }));
      gaussianModel.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });
      
      this.models.xgboost = xgboostModel;
      this.models.logistic = logisticModel;
      this.models.gaussian = gaussianModel;
      
      this.isLoaded = true;
      console.log('PhishEye: All models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error);
      throw new Error('Failed to load phishing detection models');
    }
  }

  // For demo purposes - simulate model inference with our weights
  private simulateInference(features: number[], modelType: 'xgboost' | 'logistic' | 'gaussian'): number {
    const weights = WEIGHTS[modelType];
    let sum = 0;
    
    // Weighted sum of features
    for (let i = 0; i < features.length; i++) {
      sum += features[i] * weights[i];
    }
    
    // Add some randomness for demo
    const randomFactor = Math.random() * 0.1;
    
    // Normalize to 0-1 range
    return Math.min(Math.max(sum / weights.length + randomFactor, 0), 1);
  }

  // Predict using all models
  async predict(features: UrlFeatures): Promise<{
    prediction: 'safe' | 'dangerous';
    confidence: number;
  }> {
    if (!this.isLoaded) {
      await this.loadModels();
    }
    
    const normalizedFeatures = normalizeFeatures(features);
    
    // Get predictions from all models
    const xgboostScore = this.simulateInference(normalizedFeatures, 'xgboost');
    const logisticScore = this.simulateInference(normalizedFeatures, 'logistic');
    const gaussianScore = this.simulateInference(normalizedFeatures, 'gaussian');
    
    // Average score from all models
    const averageScore = (xgboostScore + logisticScore + gaussianScore) / 3;
    
    // Simple binary classification based on threshold
    return {
      prediction: averageScore > SAFETY_THRESHOLD ? 'safe' : 'dangerous',
      confidence: averageScore
    };
  }
}

// Create a singleton instance
export const phishingClassifier = new PhishingClassifier();
