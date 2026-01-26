---
title: 'Machine Learning Research Intern at NEC Labs America'
summary: 'Research internship focused on deep learning for computer vision, implementing object detection and scene understanding systems using YOLOv2 and PyTorch'
date: '2017-07-01'
category: 'Machine Learning Research Intern at NEC Labs America'
categoryDuration: 'Feb 2017 – Jul 2017'
role: 'Machine Learning Research Intern'
company: 'NEC Labs America | Princeton, USA'
websiteUrl: 'https://www.nec-labs.com/'
duration: 'Feb 2017 – Jul 2017'
location: 'Onsite | Princeton, New Jersey, USA'
logo: '/logos/nec.png'
techStack: ['Python', 'PyTorch', 'YOLOv2', 'Deep Learning', 'Computer Vision', 'Object Detection', 'Scene Understanding', 'OpenCV']
highlights: [
  'Traffic Surveillance Object Detection: Fine-tuned YOLOv2 for tandem-motorbike detection in traffic surveillance video; tuned anchor boxes/heads + targeted augmentation to surface candidate "tandem near pedestrian" incident windows for human review.',
  'Scene Understanding (Visual Relationship Detection): Built a PyTorch subject-predicate-object relationship detector with scene-graph outputs; engineered spatial features and explored graph/message-passing + translation-embedding formulations to improve predicate classification robustness for downstream incident reasoning.'
]
featured: true
order: 2
---

## Overview

As a Machine Learning Research Intern at NEC Labs America in Princeton, New Jersey, my work focused on applying deep learning techniques to real-world problems in traffic surveillance and scene understanding, implementing and fine-tuning state-of-the-art models for custom object detection tasks.

## Key Contributions

### 1. Object Detection for Traffic Surveillance

Developed a custom object detection system for identifying tandem vehicles in traffic surveillance footage using YOLOv2 (You Only Look Once v2).

**Project Scope:**
- **Problem**: Need to detect and track specific vehicle configurations (tandems) in traffic surveillance video streams for transportation analysis
- **Approach**: Fine-tuned YOLOv2, a state-of-the-art real-time object detection model, for custom object classes
- **Dataset**: Traffic surveillance dataset with labeled tandem vehicle instances

**Technical Implementation:**
- **Model Architecture**: YOLOv2 (Darknet-19 backbone)
- **Transfer Learning Strategy**:
  - Started with pre-trained YOLOv2 weights trained on COCO/ImageNet
  - Fine-tuned final layers on custom traffic surveillance dataset
  - Adjusted anchor boxes for tandem vehicle dimensions
  - Modified detection heads for custom object classes
- **Training Process**:
  - Data preprocessing and augmentation for traffic scenarios
  - Semi-supervised learning
  - Hyperparameter tuning for optimal detection performance
  - Validation on held-out test set

**Technical Challenges & Solutions:**
- **Class Imbalance**: Tandem vehicles are rare in typical traffic
  - Solution: Applied data augmentation and weighted sampling
- **Varying Lighting Conditions**: Surveillance footage across different times of day
  - Solution: Implemented augmentation strategies for brightness, contrast variations
- **Small Object Detection**: Vehicles at distance appear small in frame
  - Solution: Adjusted anchor box scales and detection thresholds
<!--
- **Real-time Performance**: Need for fast inference on video streams
  - Solution: Optimized model architecture and inference pipeline
-->

**Impact:**
- Successfully detected tandem vehicles with high precision and recall
- Achieved real-time inference speeds suitable for video stream processing
- Provided foundation for automated traffic analysis system

### 2. Scene Understanding with Relationship Detection

Built a relationship‑detection system to move from “what objects are present” to **how objects relate** by predicting subject–predicate–object triplets (e.g., “person riding bicycle,” “car parked near building”). The goal was to enable **scene understanding** as a structured graph of objects and their relationships rather than isolated detections.

**What the project tackled:**
- **Combinatorial growth**: relationship candidates grow quadratically with detected objects.
- **Long‑tail relationships**: many predicates are rare but important.
- **Context dependence**: predicates depend on both local appearance and global scene context.

**Technical approach (PyTorch):**
- **Triplet formulation**: modeled relationships as (subject, predicate, object) with predicate classification over object pairs.
- **Scene‑graph style reasoning**: explored message‑passing between object nodes and relationship edges to refine both object and predicate predictions.
- **Translation‑embedding modeling (VTransE‑like)**: represented relationships as vector translations in embedding space (subject + predicate ≈ object).
- **Spatial features**: encoded relative position/size, overlap (IoU), and center distance between subject/object boxes to help disambiguate predicates like “on,” “near,” “under,” “riding.”
- **Multi‑task training**: combined object detection losses with relationship classification to encourage joint consistency.

**Data + evaluation:**
- Used VRD/Visual Genome‑style annotations (dense objects + relationships per image).
- Validated improvements in predicate accuracy and qualitative scene‑graph consistency, especially on common spatial predicates.

**Impact:**
- Delivered an end‑to‑end prototype for visual relationship detection and scene‑graph generation.
- Established a practical path from object detection to richer scene understanding for downstream reasoning.

<!--
## Technical Skills Developed

### Deep Learning & Computer Vision
- Advanced understanding of convolutional neural networks (CNNs)
- Experience with state-of-the-art object detection architectures (YOLO family)
- Transfer learning and fine-tuning strategies
- Multi-task learning frameworks
- Visual relationship detection and scene graphs

## Technologies & Tools

**Deep Learning Frameworks:**
- PyTorch (primary framework)
- Darknet (for YOLOv2)
- TensorBoard for experiment tracking

**Computer Vision Libraries:**
- OpenCV for image/video processing
- PIL/Pillow for image manipulation
- NumPy for numerical operations

**Development Tools:**
- Python 3.x
- Jupyter notebooks for experimentation
- Git for version control
- CUDA for GPU acceleration

**Infrastructure:**
- GPU clusters for training
- Linux environment
- High-performance storage for datasets

-->
