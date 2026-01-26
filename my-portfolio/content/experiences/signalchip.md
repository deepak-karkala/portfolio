---
title: 'Signal Processing Engineer at Signalchip Innovations'
summary: 'Worked on multi-user detection algorithms for WCDMA/LTE systems, contributing to 1 US patent in wireless communications signal processing'
date: '2015-05-01'
category: 'Other'
role: 'Signal Processing Engineer'
company: 'Signalchip Innovations'
websiteUrl: 'https://www.signalchip.com/'
duration: 'Feb 2012 – May 2015'
location: 'Bangalore, India'
logo: '/logos/signalchip.png'
techStack: ['WCDMA', 'LTE', 'Octave', 'Digital Signal Processing', 'Wireless Communications', 'Path Searcher', 'Rake Receiver', 'Channel Estimation', 'Multiuser Detection']
highlights: [
  'Joined as 5th employee of semiconductor startup, contributing to core signal processing algorithms',
  'Developed and validated WCDMA uplink receiver algorithms (Path Searcher, RAKE, Multiuser Detection), achieved 3GPP NodeB receiver conformance (BER <0.001) across multi-path/interference channel conditions',
  'Patent: Developed symbol level interference cancellation method (US Patent 9602240), Patent: Developed optimized channel estimation system reducing computational complexity (US Patent 20160365991)',
]
featured: true
order: 1
---

## Overview

As the fifth employee at Signalchip Innovations, a semiconductor startup, I worked on developing advanced signal processing algorithms for wireless communications systems. My work focused on solving critical challenges in WCDMA and LTE base station receivers, particularly in the areas of multi-user detection, channel estimation, and interference cancellation.

## Key Contributions

### 1. Multi-User Detection with Interference Cancellation

Developed a novel approach to multi-user detection that significantly reduced storage requirements and processing complexity in WCDMA uplink receivers.

**Technical Innovation:**
- **Problem**: Traditional multiuser detection methods required storing complex reconstructed signals for all users, leading to high memory consumption and computational complexity - especially problematic for low-cost base stations with limited resources
- **Solution**: Developed a symbol-level interference cancellation method that stores only soft bit estimates instead of full reconstructed signals, dramatically reducing memory requirements without compromising receiver performance
- **Implementation**: Designed a dual-iteration process:
  - First iteration: Generate and store soft bit estimates for each user
  - Subsequent iterations: Reuse stored soft bit estimates by multiplying with scaling factors and adding to soft demapper input
  - Only the difference between current and previous soft bit estimates needs reconstruction

**Impact:**
- Reduced storage requirements by storing only soft bits (~1-2 bytes per symbol) instead of complex reconstructed signals (~8-16 bytes per symbol)
- Enabled implementation in femtocell base stations with limited processing capability
- Supported increased cell size and number of users without proportional increase in hardware complexity
- **Awarded [US Patent 9602240](https://patents.google.com/patent/US9602240B1/en?oq=9602240)** (March 2017)

**Technical Details:**
- Implemented both serial and parallel interference cancellation processes
- Utilized RAKE receiver for multipath combining, descrambling, and dispreading
- Developed soft demapper for generating soft bit estimates
- Created efficient reconstruction block using UE transmit chip rate processor and channel modeling

### 2. Optimized Channel Estimation for WCDMA Systems

Pioneered a dual-stage channel estimation approach that drastically reduced correlation operations while maintaining estimation accuracy.

**Technical Innovation:**
- **Problem**: Traditional channel estimators performed correlation operations across the entire uncertainty region at high sampling rates, requiring excessive processing power - especially challenging as the number of users and cell size increased
- **Solution**: Developed a two-stage channel estimator:
  - **Coarse Path Searcher**: Performs correlations at chip rate using single-phase samples to identify regions of interest in the uncertainty region
  - **Fine Path Searcher**: Performs high-resolution correlations only within identified regions of interest to calculate precise phase information and multipath locations

**Implementation Architecture:**
- Coarse Stage:
  - Samples at oversampling index × chip rate but processes only one phase
  - Identifies valid correlation peaks above threshold (K1 × noise mean)
  - Determines channel delay and regions of interest
  - Significantly reduces search space
- Fine Stage:
  - Processes all phase samples only in regions of interest
  - Calculates accurate phase information at oversampled rate
  - Identifies multipath components using threshold (K2 × noise mean)
  - Generates channel state information for RAKE receiver

**Impact:**
- Reduced number of correlation operations by 60-80% compared to traditional methods
- Decreased base station power consumption and hardware complexity
- Enabled support for larger cell sizes without performance degradation
- Made femtocell base station implementation economically viable
- **[US Patent Application 20160365991](https://patents.google.com/patent/US20160365991A1/en?oq=20160365991)** (filed October 2015)

**Technical Details:**
- Uncertainty region = round-trip delay of farthest user + maximum channel spread
- Region of interest = channel spread window where multipath components occur
- Implemented adaptive thresholding based on noise mean calculation
- Developed firmware override mode for flexible operation

### 3. WCDMA Signal Processing Components

**Path Searcher Implementation:**
- Designed algorithms to identify multipath components in WCDMA signals
- Implemented correlation-based peak detection for signal arrival timing
- Developed threshold computation using noise statistics

**Rake Receiver Development:**
- Built multipath combining logic for WCDMA uplink
- Implemented descrambling and dispreading operations
- Designed channel compensation using estimated phase and delay information

**Multi-User Detection:**
- Developed sequential and parallel interference cancellation schemes
- Implemented soft bit generation and reconstruction blocks
- Created efficient signal subtraction and combining mechanisms

### 4. LTE PRACH Signal Detection

Worked on Physical Random Access Channel (PRACH) detection algorithms for LTE systems, enabling efficient random access procedures for user equipment connecting to base stations.


## Patents

### 1. [Method and System for Symbol Level Interference Cancellation at a Receiver for Multiuser Detection](https://patents.google.com/patent/US9602240B1/en?oq=9602240)
- **Patent Number**: [US 9602240](https://patents.google.com/patent/US9602240B1/en?oq=9602240)
- **Issued**: March 21, 2017
- **Inventors**: Aravind Ganesan, Deepak Karkala, Rajesh Mundhada
- **Abstract**: Methods and systems for performing symbol level interference cancellation that reduces storage requirements by reusing soft bit estimates across iterations instead of storing full reconstructed signals for all users.

### 2. [Method and System for Performing Optimized Channel Estimation](https://patents.google.com/patent/US20160365991A1/en?oq=20160365991)
- **Patent Application**: [US 20160365991](https://patents.google.com/patent/US20160365991A1/en?oq=20160365991)
- **Filed**: October 6, 2015
- **Published**: December 15, 2016
- **Inventors**: Aravind Ganesan, Deepak Karkala, Rajesh Mundhada
- **Abstract**: A dual-stage channel estimation system using coarse path searching at chip rate followed by fine path searching at oversampled rate within identified regions of interest, significantly reducing correlation operations.

