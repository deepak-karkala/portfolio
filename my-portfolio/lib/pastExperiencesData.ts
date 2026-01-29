export type PastExperienceEntry = {
  id: string;
  type: 'experience' | 'education';
  title: string;
  organization: string;
  dateRange: string;
  location?: string;
  summary: string;
  details: string;
  logo?: string;
};

export const pastExperiences: PastExperienceEntry[] = [
  {
    id: 'ecom-ml',
    type: 'experience',
    title: 'Senior ML Engineer (Contract)',
    organization: 'Mid-sized European E-commerce Marketplace (Client - NDA)',
    dateRange: 'Aug 2022 - Nov 2025',
    location: 'Remote',
    summary:
      `Built 4 production ML systems for a European e-commerce marketplace (75K SKUs, 50K DAU, 2.5K orders/day) driving measurable business impact. Led end-to-end ML lifecycle from problem formulation to deployment and monitoring. 
      
      **BUSINESS IMPACT**:
• **12% higher marketing ROI** via [CLV prediction](/experiences/ecom_customer_lifetime_value)
• **5% conversion uplift** through [purchase intent scoring](/experiences/ecom_purchase_intent_scoring)
• **4% search-to-purchase improvement** with [RAG discovery](/experiences/ecom_rag_product_catalog)
• **60% cost reduction** in [review summarization](/experiences/ecom_reviews_summarisation)

**MLOPS OWNERSHIP**:
Led full lifecycle: evaluation (LLM-as-judge, CI/CD), production debugging (calibration), stakeholder management (legal, experiments), operational excellence (SLOs, drift monitoring, A/B testing). Cost-bounded infrastructure with business impact.
`,
    details: `


SYSTEMS BUILT:

**[CLV Prediction](/experiences/ecom_customer_lifetime_value)**
   - Segmented models (early/established); RMSE 15-20% improvement, Gini 0.47→0.62
   - Diagnosed/resolved feedback loop via cross-functional experiment
   - Weekly batch scoring 300K+ profiles with segment monitoring
   - XGBoost, SageMaker, Glue, S3

**[Purchase Intent Scoring](/experiences/ecom_purchase_intent_scoring)**
   - Sub-second scoring 60K+ daily predictions (Feast + Redis); 50K+ events/hour via Spark
   - Resolved calibration breakdown; segment-wise analysis + post-hoc calibration restored trust
   - A/B testing delivered 5% uplift; 40% p99 latency reduction
   - LightGBM, Feast, Redis, Kinesis, SageMaker

**[RAG Search & Discovery](/experiences/ecom_rag_product_catalog)**
   - Hybrid retrieval (embeddings + BM25) + re-ranking; LLM-driven golden dataset
   - 3M queries/month, p99 <500ms, EUR 0.001 per query; 4% search-to-purchase uplift
   - OpenAI, Pinecone, GPT-4, fine-tuned re-ranker

**[Review Summarization](/experiences/ecom_reviews_summarisation)**
   - Mistral-7B on 100K+ reviews (LoRA + vLLM); partnered with legal for governance
   - Automated quality checks (hallucination/toxicity); 60% cost vs. GPT-4
   - Mistral-7B, vLLM, LoRA, SageMaker

**Tech Stack**: Python, LightGBM, XGBoost | AWS (SageMaker, Glue, Kinesis, Lambda) | Terraform | Feast + Redis | OpenAI, Mistral`,
    logo: '/logos/ecommerce.png',
  },
  {
    id: 'ventures',
    type: 'experience',
    title: 'Founder',
    organization: '[Spiticart](https://spiticart.com/),  [Rumi Schools](https://www.rumischools.org/)',
    dateRange: 'Jan 2021 - Jul 2022',
    location: 'India',
    summary: `Founded two social impact ventures:
    • [Spiticart](/ventures/ecommerce-indian-handicrafts) - E-commerce platform for traditional Indian handicrafts
    • [Rumi Schools](/ventures/ngo-rural-education) - Digital-first rural education initiative`,
    details: `

[Spiticart](/ventures/ecommerce-indian-handicrafts) - E-commerce platform for traditional Indian handicrafts
   - Direct-to-consumer model supporting rural artisans
   - Products: Shantiniketan leather, Channapatna toys, Agra marble carvings
   - Mission: Preserving traditional crafts and improving artisan livelihoods

[Rumi Schools](/ventures/ngo-rural-education) - Digital-first rural education initiative
   - Designed comprehensive curriculum spanning academics, co-curricular activities (tech, arts, sports), and life skills
   - Developed prototype leveraging digital technologies and remote mentorship for scalable impact
   - Part of larger "Model Village" vision for sustainable rural communities`,
    logo: '/logos/ventures.png',
  },
  {
    id: 'iot-ml',
    type: 'experience',
    title: 'ML Engineer',
    organization: '[eSMART Technologies](https://myesmart.com/en/) Renens, Switzerland',
    dateRange: 'Jun 2018 - Dec 2020',
    location: 'Remote',
    summary:
      `Owned end-to-end IoT ML systems for smart building operations across 3,000 apartments. Built predictive maintenance and energy forecasting models spanning data quality checks, evaluation, monitoring, and scheduled retraining.

      **BUSINESS IMPACT**:
• [Predictive Maintenance](/experiences/iot_anomaly): **20% reduction** in emergency maintenance callouts
• [Energy Forecasting](/experiences/iot_forecasting): **<10% MAPE** energy forecasting accuracy, **10pp** increase in solar self-consumption`,
    details: `.

**SYSTEMS BUILT**:

**[Predictive Maintenance](/experiences/iot_anomaly) (Anomaly Detection + HITL)**
   - Deployed anomaly detection + alert triage for heating systems
   - Diagnosed alert fatigue issue; partnered with maintenance teams to redesign as prioritization tool vs. automated detector
   - Evolved from unsupervised (residuals + LOF) to supervised as labels grew via technician human-in-the-loop
   - 75% precision@50 for high-priority alerts; restored stakeholder trust
   - Python, scikit-learn, time-series analytics, MLOps pipelines

**[Energy Forecasting](/experiences/iot_forecasting) (Smart Energy Advisor)**
   - 24-hour ahead demand forecasting (XGBoost + weather, lag, rolling windows, holiday features)
   - Powered resident-facing recommendations; 10pp solar self-consumption increase
   - Tiered cold-start strategy for new buildings: physics-informed heuristics → archetype models → individualized forecasts
   - Walk-forward validation, baselines (ARIMA/Prophet), drift monitoring
   - Python, XGBoost, time-series pipelines

Tech Stack: Python, scikit-learn, XGBoost, ARIMA | PostgreSQL | Pandas | Docker`,
    logo: '/logos/esmart.png',
  },
  {
    id: 'epfl',
    type: 'education',
    title: 'Master of Science - Communication Systems',
    organization: '[EPFL](https://www.epfl.ch/en/) Lausanne, Switzerland',
    dateRange: 'Aug 2015 - May 2018',
    location: 'Lausanne, Switzerland',
    summary: `CGPA: 5.25 / 6.0   
[Master's Thesis: Data Analysis and Anomaly Detection in Buildings Using Sensor Data](/education/masters_thesis.pdf)
 Focus: Machine Learning, Applied Data Analysis, Computer Vision, Algorithms `,
    details: `

[Thesis](/education/masters_thesis.pdf): Data Analysis and Anomaly Detection in Buildings Using Sensor Data
- Developed unsupervised learning methods for IoT anomaly detection
- Applied to real building management systems
- Foundation for later production IoT ML work at eSMART Technologies

[Relevant Coursework](/experiences/masters):
• Machine Learning
• Applied Data Analysis
• Computer Vision
• Natural Language Processing
• Algorithms

This degree provided rigorous foundation in ML theory and practical application that enabled rapid transition to production ML engineering.`,
    logo: '/logos/epfl.png',
  },
  {
    id: 'nec-intern',
    type: 'experience',
    title: 'ML Research Intern',
    organization: '[NEC Labs America](https://www.nec-labs.com/) Princeton, USA',
    dateRange: 'Feb 2017 - Jul 2017',
    location: 'Princeton, NJ, USA',
    summary:
      `Conducted computer vision research for real-time object detection and scene understanding in traffic surveillance systems.
      • Fine-tuned YOLOv2 for tandem motorbike detection in traffic surveillance video
      • Built PyTorch relationship detector with scene graph outputs (subject-predicate-object)`,
    details: ` **RESEARCH CONTRIBUTIONS**

[Traffic Surveillance Object Detection](/experiences/intern_nec)
   - Fine-tuned YOLOv2 for tandem motorbike detection in traffic surveillance video
   - Tuned anchor boxes/heads with targeted augmentation to surface candidate "tandem near pedestrian" incident windows for human review

[Scene Understanding (Visual Relationship Detection)](/experiences/intern_nec)
   - Built PyTorch relationship detector with scene graph outputs (subject-predicate-object)
   - Engineered spatial features and explored graph/message-passing + translation embedding formulations
   - Improved predicate classification robustness for downstream incident reasoning

Tech Stack: Python, PyTorch, YOLOv2`,
    logo: '/logos/nec.png',
  },
  {
    id: 'signalchip',
    type: 'experience',
    title: 'Signal Processing Engineer',
    organization: '[Signalchip Innovations](https://www.signalchip.com/)',
    dateRange: 'Feb 2012 - May 2015',
    location: 'Bangalore, India',
    summary:
      `Developed advanced signal processing algorithms for wireless base stations (WCDMA/LTE). Joined as the 5th employee at this semiconductor startup, contributing to core IP.
      [Patent US-9602240-B1: System for symbol level interference cancellation at a receiver for multiuser detection](https://patents.google.com/patent/US9602240B1/en?oq=9602240) (2017)`,
    details: ` **KEY ACHIEVEMENTS**
- Developed and validated WCDMA uplink receiver algorithms (Path Searcher, RAKE, Multiuser Detection)
- Achieved 3GPP NodeB receiver conformance (BER <0.001) across multipath/interference channel conditions
- Reduced storage and computational complexity in baseband receivers through novel algorithm design

**PATENTS**
- [US-9602240-B1](https://patents.google.com/patent/US9602240B1/en?oq=9602240) (Granted Patent, 2017): Symbol-level interference cancellation for WCDMA uplink receivers. Reuses soft-bit estimates across iterative decoding (serial or parallel IC) to cut memory/compute while maintaining detection accuracy in multiuser scenarios.

- [US-20160365991-A1](https://patents.google.com/patent/US20160365991A1/en?oq=20160365991) (Published Application, 2016): Two-stage channel estimation for WCDMA: a coarse search finds regions of interest in the uncertainty window, then a fine search runs only in those regions. This reduces correlation operations and hardware complexity while preserving estimation accuracy.

This role provided deep foundation in algorithms, optimization, and systems-level engineering that later translated to ML systems work.

Tech Stack: MATLAB, Octave, Signal Processing, WCDMA, LTE`,
    logo: '/logos/signalchip.png',
  },
  {
    id: 'iisc',
    type: 'experience',
    title: 'Junior Research Fellow',
    organization: '[Indian Institute of Science (IISc)](https://www.iisc.ac.in/)',
    dateRange: 'Jun 2011 - Jan 2012',
    location: 'Bangalore, India',
    summary:
      `Conducted research on diffuse optical tomography at IISc Bangalore. 
      Published first-author paper in [Medical Physics journal: Data-resolution based optimization of the data-collection strategy for near infrared diffuse optical tomography](https://aapm.onlinelibrary.wiley.com/doi/10.1118/1.4736820).
      `,
    details: ` **RESEARCH CONTRIBUTIONS**
   - Developed a data-resolution matrix method (from the sensitivity/Jacobian model + regularization) to identify independent measurements
   - Used diagonal vs. off-diagonal structure to select informative measurements and reduce data-collection time
   - Achieved ~20% more independent measurements than singular-value selection while preserving reconstruction quality

Tech Stack: MATLAB, Optimization algorithms, Inverse problems`,
    logo: '/logos/iisc.png',
  },
  {
    id: 'rvce',
    type: 'education',
    title: 'Bachelor of Engineering - BE, Electronics and Communication',
    organization: '[RV College of Engineering](https://rvce.edu.in/)',
    dateRange: 'Aug 2007 - Jun 2011',
    location: 'Bangalore, India',
    summary: `Focus: Signal Processing, Communications, Algorithms, Mathematics
    CGPA: 9.23 / 10.0`,
    details: `
Strong foundation in mathematics, signal processing, and algorithms that provided the technical base for later work in ML and wireless communications.`,
    logo: '/logos/rvce.png',
  },
];
