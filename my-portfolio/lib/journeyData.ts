export interface JourneyItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  highlight: string;
  category: 'education' | 'work' | 'research' | 'venture';
  logo: string;
  slug: string; // For linking to /experiences/[slug]
}

export const journeyItems: JourneyItem[] = [
  {
    id: '1',
    company: 'RVCE',
    role: 'Bachelor of Engineering',
    duration: '2007 - 2011',
    location: 'Bangalore, India',
    highlight: 'Electronics & Communication • CGPA 9.23/10.0',
    category: 'education',
    logo: '/logos/rvce.png',
    slug: 'bachelors'
  },
  {
    id: '2',
    company: 'IISc',
    role: 'Junior Research Fellow',
    duration: '2011 - 2012',
    location: 'Bangalore, India',
    highlight: 'Published in Medical Physics (IF 3.2) • Diffuse Optical Tomography',
    category: 'research',
    logo: '/logos/iisc.png',
    slug: 'iisc-research'
  },
  {
    id: '3',
    company: 'Signalchip',
    role: 'Signal Processing Engineer',
    duration: '2012 - 2015',
    location: 'Bangalore, India',
    highlight: '2 US Patents • 5th employee at semiconductor startup',
    category: 'work',
    logo: '/logos/signalchip.png',
    slug: 'signalchip'
  },
  {
    id: '4',
    company: 'EPFL',
    role: 'Master of Science',
    duration: '2015 - 2018',
    location: 'Lausanne, Switzerland',
    highlight: 'Communication Systems • Grade 5.25/6.0',
    category: 'education',
    logo: '/logos/epfl.png',
    slug: 'masters'
  },
  {
    id: '5',
    company: 'NEC Labs',
    role: 'ML Research Intern',
    duration: 'Feb - Jul 2017',
    location: 'Princeton, USA',
    highlight: 'Computer Vision • YOLOv2 for traffic surveillance',
    category: 'work',
    logo: '/logos/nec.png',
    slug: 'nec-labs'
  },
  {
    id: '6',
    company: 'eSMART',
    role: 'ML Engineer',
    duration: '2018 - 2020',
    location: 'Remote',
    highlight: '20% reduction in maintenance costs • IoT predictive maintenance',
    category: 'work',
    logo: '/logos/esmart.png',
    slug: 'iot_anomaly'
  },
  {
    id: '7',
    company: 'Spiticart + Rumi Schools',
    role: 'Founder & Co-Founder',
    duration: '2021 - 2022',
    location: 'India',
    highlight: 'Social impact ventures • E-commerce & Rural education',
    category: 'venture',
    logo: '/logos/ventures.png',
    slug: 'ecommerce-indian-handicrafts'
  },
  {
    id: '8',
    company: 'E-commerce Marketplace',
    role: 'Consultant ML Engineer',
    duration: '2022 - 2025',
    location: 'Remote - Europe',
    highlight: '18% marketing ROI improvement • 4 production ML systems',
    category: 'work',
    logo: '/logos/ecommerce.png',
    slug: 'ecom_customer_lifetime_value'
  }
];
