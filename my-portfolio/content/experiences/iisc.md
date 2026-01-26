---
title: 'Junior Research Fellow at Indian Institute of Science'
summary: 'Research fellowship focused on developing efficient image reconstruction algorithms for Diffuse Optical Tomography, resulting in a published paper in Medical Physics journal'
date: '2012-02-01'
category: 'Other'
role: 'Junior Research Fellow'
institution: 'Indian Institute of Science'
websiteUrl: 'https://www.iisc.ac.in/'
duration: 'Jun 2011 – Jan 2012'
location: 'Bangalore, India'
logo: '/logos/iisc.png'
techStack: ['MATLAB', 'Diffuse Optical Tomography', 'Image Reconstruction', 'Inverse Problems', 'Optimization Algorithms', 'Medical Imaging', 'Regularization Theory']
highlights: [
  'Developed a data-resolution matrix method (from the sensitivity/Jacobian model + regularization) to identify independent measurements. Used diagonal vs. off-diagonal structure to select informative measurements and reduce data-collection time.',
  'Achieved ~20% more independent measurements than singular-value selection while preserving reconstruction quality',
  'Published first-author paper in Medical Physics journal.'
]
featured: true
order: 3
---

## Overview

As a Junior Research Fellow at the Supercomputer Education and Research Centre, Indian Institute of Science, Bangalore, I worked on developing efficient algorithms for image reconstruction in Near Infrared (NIR) Diffuse Optical Tomography. My research focused on optimizing data-collection strategies to identify independent measurements, thereby reducing data acquisition time while maintaining reconstructed image quality. This work resulted in a first-author publication in Medical Physics, a leading journal in medical imaging.

## Publication

**[Data-resolution based optimization of the data-collection strategy for near infrared diffuse optical tomography](https://aapm.onlinelibrary.wiley.com/doi/10.1118/1.4736820)**

- **Authors**: Deepak Karkala and Phaneendra K. Yalavarthy
- **Journal**: Medical Physics, Vol. 39, No. 8, pp. 4715-4725 (August 2012)
- **DOI**: 10.1118/1.4736820
<!--
- **Received**: 18 January 2012
- **Accepted**: 19 June 2012
-->
- **Published**: 18 July 2012

## Research Problem

Diffuse Optical Tomography (DOT) is an emerging non-invasive medical imaging modality that uses near-infrared light (600-1000 nm wavelength) to reconstruct internal distributions of optical properties in tissues. It has applications in:
- Breast cancer imaging
- Brain functional imaging
- Small animal imaging studies

**Key Challenges:**
1. **Ill-posed Inverse Problem**: Light scattering dominance in soft tissue makes the reconstruction problem nonlinear, ill-posed, and sometimes underdetermined
2. **Redundant Measurements**: Existing optimization techniques could identify the number of useful measurements but not specific information about which measurements are independent
3. **Data Collection Efficiency**: No method existed to determine whether a particular measurement is independent or redundant, leading to unnecessary data collection time

## Key Contributions

### 1. Data-Resolution Matrix Based Optimization Method

Developed a novel optimization technique using the data-resolution matrix to identify specific independent measurements among total measurements in a data-collection strategy.

**Technical Innovation:**

The data-resolution matrix (N) is computed based on the sensitivity/Jacobian matrix (J) and the regularization parameter (λ) used in the reconstruction:

```
N = JJ^T [JJ^T + λI]^(-1)
```

**Key Properties:**
- **Diagonal Entries**: Indicate the importance/weight of each measurement (values between 0 and 1)
- **Off-Diagonal Entries**: Show the dependency of measurements on each other
- **Model-Based**: Depends only on the sensitivity matrix and regularization, independent of noise characteristics

**Algorithm for Identifying Independent Measurements:**

1. Compute Jacobian (J) using uniform initial guess
2. Set threshold (th) between 0.8 and 1.0 to indicate dependency level
3. Calculate data-resolution matrix: N = JJ^T [JJ^T + λI]^(-1)
4. For each row i of N:
   - If off-diagonal entry N(i,j) > th × N(i,i), mark measurement j as dependent on i
   - Skip analysis for already identified dependent measurements
5. Extract independent measurement indices
6. Construct reduced Jacobian with only independent measurements

### 2. Diffuse Optical Tomography: Forward and Inverse Problems

**Forward Problem:**

Modeled continuous wave NIR light propagation in biological tissue using the diffusion equation:

```
-∇·D(r)∇Φ(r) + μₐ(r)Φ(r) = Q₀(r)
```

Where:
- D(r): Optical diffusion coefficient
- μₐ(r): Absorption coefficient (imaging parameter to reconstruct)
- Φ(r): Photon fluence density
- Q₀(r): Isotropic light source

**Implementation:**
- Used Finite Element Method (FEM) to solve the diffusion equation
- Applied Type-III boundary condition for refractive index mismatch
- Generated modeled data under Rytov approximation (natural logarithm of intensity)

**Inverse Problem:**

Reconstructed absorption coefficients from boundary measurements using iterative least-squares optimization:

**Levenberg-Marquardt Optimization:**

Minimized objective function: Ω = ||y - G(μₐ)||²

Update equation at iteration i:
```
Δμₐⁱ = J^T [JJ^T + λI]^(-1) δⁱ⁻¹
```

Where:
- y: Natural logarithm of experimental amplitude data
- G(μₐ): Modeled data
- δ: Data-model misfit (δ = y - G(μₐ))
- J: Jacobian/sensitivity matrix (dimension: NM × NN)
- λ: Regularization parameter (stabilizes solution)

**Reduced Jacobian Approach:**

After identifying NK independent measurements, the reduced Jacobian becomes:
```
Jₙ = J(independent_indices, :)  (dimension: NK × NN)
```

New update equation:
```
Δμₐⁱ = Jₙ^T [JₙJₙ^T + λI]^(-1) δⁱ⁻¹
```

### 3. Experimental Validation

**Numerical Simulations:**

Tested on multiple 3D geometries:
1. **Cylindrical Domain**:
   - Diameter: 86 mm, Height: 100 mm
   - Mesh: 24,161 nodes, 116,757 tetrahedral elements
   - Data collection: 48 fibers in 3 layers → 2,256 measurements
   - Spherical target (20 mm diameter) at 10 mm depth

2. **Patient Breast Mesh**:
   - Mesh: 18,723 nodes, 94,936 tetrahedral elements
   - Data collection: 16 fibers in circular arrangement → 240 measurements

**Optical Properties:**
- Background: μₐ = 0.01 mm⁻¹, μₛ' = 1.0 mm⁻¹
- Target: μₐ = 0.03 mm⁻¹, μₛ' = 1.0 mm⁻¹
- Added 1% Gaussian noise to simulate experimental conditions

**Experimental Phantom:**

Fabricated cylindrical gelatin-based phantom:
- Dimensions: 86 mm diameter × 60 mm height
- Background: μₐ = 0.008 mm⁻¹, μₛ' = 0.9 mm⁻¹
- Cylindrical target (16 mm diameter): μₐ = 0.02 mm⁻¹, μₛ' = 1.0 mm⁻¹
- Data collected at 785 nm wavelength

## Results and Impact

### 1. Increased Independent Measurements

Compared to traditional singular value analysis:

| Imaging Domain | Total Measurements | Singular Value Analysis | Data-Resolution Matrix (th=0.9) | Improvement |
|----------------|-------------------|------------------------|--------------------------------|-------------|
| Cylinder: 1 layer | 240 | 89 | 111 | +25% |
| Cylinder: 3 layers, in plane | 720 | 231 | 331 | +43% |
| Cylinder: 3 layers, out of plane | 2,256 | 282 | 1,093 | +288% |
| Patient breast mesh | 240 | 101 | 121 | +20% |
| Experimental phantom | 240 | 94 | 162 | +72% |

**Key Finding**: Data-resolution matrix analysis identified 20-288% more independent measurements than traditional singular value analysis.

### 2. Maintained Image Quality

**Threshold Analysis:**
- **th = 1.0**: All measurements used (baseline)
- **th = 0.9**: 121 independent measurements
  - Relative error: 0.41% compared to baseline
  - Data-model misfit difference: <3% across all iterations
- **th = 0.8**: 106 independent measurements
  - Relative error: 3.89%
- **th = 0.7**: 97 independent measurements
  - Relative error increases significantly

**Optimal Choice**: Threshold of 0.9 maintains image quality (error <1%) while reducing measurements by ~50%.

### 3. Random Selection Comparison

When 162 randomly selected measurements (same as independent set) were used:
- Poor image quality with major boundary artifacts
- Reduced contrast recovery
- Significantly worse than using 162 independent measurements

**Conclusion**: Specific selection of independent measurements is critical, not just the count.

### 4. Computational Efficiency

**Computation Time per Iteration** (Cylinder: 3 layers):
- All measurements (th=1.0): 476.04 seconds
- Independent only (th=0.9): 462.12 seconds
- Reduction: ~3%
- Overhead for data-resolution analysis: 37.98 seconds (one-time cost)

**Memory Benefits**:
- Reduced Jacobian dimensions from NM × NN to NK × NN
- Lower storage requirements for sensitivity matrix

### 5. Effect of Regularization Parameter

Number of independent measurements varies with λ (for patient mesh, th=0.9):
- λ = 0.01: 143 measurements
- λ = 0.1: 138 measurements
- λ = 1: 121 measurements
- λ = 10: 119 measurements
- λ = 100: 116 measurements

**Trend**: Higher regularization → fewer independent measurements (more measurement dependency).

<!--
## Technical Implementation

### MATLAB Implementation

**Key Components:**

1. **Forward Model**:
   - Finite Element Method for solving diffusion equation
   - Type-III boundary conditions
   - Jacobian computation via adjoint method

2. **Inverse Problem**:
   - Levenberg-Marquardt optimization
   - Regularization parameter: λ = max(diag(JJ^T))
   - λ decreased by small factor each iteration
   - Stopping criterion: L2 norm of data-model misfit improves by <2%

3. **Data-Resolution Matrix Computation**:
   - One-time computation at first iteration
   - Matrix inversion: (JJ^T + λI)^(-1)
   - Computational cost: <8% of total iteration time

4. **Independent Measurement Selection**:
   - Row-by-row analysis of data-resolution matrix
   - Threshold-based dependency identification
   - Reduced Jacobian construction

### Mathematical Formulations

**Alternative Update Form Derivation:**

Using Sherman-Morrison-Woodbury identity:
```
(A + C^T BC)^(-1) = A^(-1) - A^(-1)C^T(B^(-1) + CA^(-1)C^T)^(-1)CA^(-1)
```

Proved equivalence:
```
(J^T J + λI)^(-1)J^T = J^T(JJ^T + λI)^(-1)
```

This enables efficient computation for underdetermined problems.

## Research Significance

### Novel Contributions

1. **First Method** to provide specific information about which measurements are independent (not just count)
2. **Universal Framework**: Independent of noise characteristics, relies only on model and regularization
3. **Practical Impact**: Reduces data acquisition time without compromising image quality
4. **Instrumentation Value**: Enables optimal design of data-collection systems

### Applicability Beyond DOT

The data-resolution matrix methodology is applicable to:
- Electrical Impedance Tomography
- Electrical Capacitance Tomography
- Fluorescence Optical Tomography
- Bioluminescence Tomography
- Any inverse problem using model-based reconstruction with regularization

## Skills Developed

### Mathematical & Computational Methods
- Inverse problem theory and regularization techniques
- Finite Element Method (FEM) for solving partial differential equations
- Levenberg-Marquardt optimization
- Matrix algebra and numerical linear algebra
- Sherman-Morrison-Woodbury identity applications

### Medical Imaging
- Near-infrared diffuse optical tomography principles
- Light propagation modeling in biological tissues
- Image reconstruction algorithms
- Phantom design and experimental validation

### Research & Publication
- Scientific writing for peer-reviewed journals
- Experimental design and validation
- Quantitative analysis and visualization
- MATLAB programming for computational biomedical research

## Technologies & Tools

**Programming & Computation:**
- MATLAB (primary implementation language)
- Finite Element Method solvers
- Numerical optimization libraries
- Matrix computation and linear algebra routines

**Medical Imaging:**
- NIR optical tomography systems
- Gelatin-based tissue-mimicking phantoms
- Continuous wave (CW) optical measurements
- Calibration procedures for experimental data

**Research Tools:**
- LaTeX for manuscript preparation
- Scientific visualization and plotting
- Statistical analysis tools

## Impact

### Academic Impact
- **Citation Count**: Paper has been cited extensively in diffuse optical imaging literature
- **Journal**: Published in Medical Physics (official journal of American Association of Physicists in Medicine)
- **Contribution**: Advanced the field of data-collection strategy optimization for optical tomography

### Practical Applications
- Reduced protocol time for clinical diffuse optical imaging
- Improved efficiency of data collection systems
- Foundation for designing optimized instrumentation
- Applicable to breast cancer screening, brain imaging, and small animal studies

### Methodological Innovation
- Introduced data-resolution matrix as an optimization tool
- Provided specific measurement selection capability
- Demonstrated superiority over singular value analysis (20-288% more independent measurements)
-->
## Conclusion

This research fellowship at IISc provided valuable experience in developing computational algorithms for medical imaging, working on inverse problems, and publishing in high-impact journals. The data-resolution matrix based optimization method I developed addressed a critical gap in diffuse optical tomography - identifying which specific measurements are independent rather than just knowing the count. This work has practical implications for reducing data acquisition time in clinical optical imaging systems while maintaining image quality, contributing to more efficient and economically viable medical imaging protocols.
