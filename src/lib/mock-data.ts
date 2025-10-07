

export type Service = {
  id: string;
  title: string;
  imageUrl: string;
  short_description: string;
  long_description: string;
  featured?: boolean;
  key_benefits: string[];
  pricing: {
    plan: string;
    price: string;
    features: string[];
  }[];
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  technologies: string[];
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_date: string;
  imageUrl: string;
  featured?: boolean;
};

export type GalleryImage = {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  category: 'Tech Conferences' | 'Client Meetups' | 'Product Launches' | 'Workshops & Training' | 'Award & Recognition' | 'People' | 'Technology' | 'Event';
};

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  is_past: boolean;
  imageUrl: string;
  promotional: boolean;
};

export type Feedback = {
  id: string;
  name: string;
  company: string;
  country?: string;
  role: string;
  message: string;
  rating?: number;
  status: 'pending' | 'approved' | 'rejected';
  featured?: boolean;
};

export type ContactSubmission = {
    id: string;
    name: string;
    email: string;
    company: string;
    country: string;
    jobTitle: string;
    message: string;
    created_at: Date;
    read_status: boolean;
}

export type QuoteRequest = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  fullName: string;
  email: string;
  selectedPlan: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'closed';
}

export const services: Service[] = [
  {
    id: '1',
    title: 'Predictive Analytics',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
    short_description: 'Unlock future trends and make data-driven decisions.',
    long_description: 'Our Predictive Analytics service leverages machine learning models to forecast future outcomes based on historical data. We help you identify risks, discover opportunities, and optimize your strategies for maximum impact.',
    featured: true,
    key_benefits: [
        "Increased ROI",
        "Risk Mitigation",
        "Operational Efficiency",
        "Competitive Advantage"
    ],
    pricing: [
        {
            plan: 'Starter',
            price: '$1,999/mo',
            features: ['1 Predictive Model', 'Monthly Data Refresh', 'Basic Dashboard', 'Email Support']
        },
        {
            plan: 'Business',
            price: '$4,999/mo',
            features: ['5 Predictive Models', 'Weekly Data Refresh', 'Advanced Dashboard', 'Priority Support']
        },
        {
            plan: 'Enterprise',
            price: 'Custom',
            features: ['Unlimited Models', 'Real-time Data Sync', 'Custom Dashboards', 'Dedicated Account Manager']
        }
    ]
  },
  {
    id: '2',
    title: 'AI Chatbot Solutions',
    imageUrl: 'https://images.unsplash.com/photo-1593349480503-685d3733a17c?q=80&w=2670&auto=format&fit=crop',
    short_description: 'Engage customers 24/7 with intelligent, automated conversations.',
    long_description: 'We design and deploy custom AI-powered chatbots that provide instant customer support, generate leads, and streamline user interactions. Our chatbots are tailored to your brand voice and business objectives.',
    featured: true,
    key_benefits: [
        "24/7 Customer Support",
        "Lead Generation",
        "Cost Reduction",
        "Improved User Engagement"
    ],
    pricing: [
        {
            plan: 'Basic',
            price: '$499/mo',
            features: ['1 Chatbot', '1,000 Interactions/mo', 'Basic Integrations', 'Standard Support']
        },
        {
            plan: 'Pro',
            price: '$1,499/mo',
            features: ['3 Chatbots', '10,000 Interactions/mo', 'Advanced Integrations', 'Priority Support']
        },
        {
            plan: 'Enterprise',
            price: 'Custom',
            features: ['Unlimited Chatbots', 'Unlimited Interactions', 'Custom Integrations', 'Dedicated Support']
        }
    ]
  },
  {
    id: '3',
    title: 'Custom AI Model Development',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-aebc69223525?q=80&w=2669&auto=format&fit=crop',
    short_description: 'Bespoke AI models tailored to your unique business challenges.',
    long_description: 'From natural language processing to computer vision, our team of experts builds custom AI models from the ground up. We work closely with you to understand your needs and deliver a solution that provides a competitive edge.',
    featured: true,
    key_benefits: [
        "Tailored to Your Needs",
        "Competitive Advantage",
        "Scalable Solution",
        "Full Ownership"
    ],
    pricing: [
       {
            plan: 'Proof of Concept',
            price: 'Starting at $10,000',
            features: ['Feasibility Study', 'Basic Model Prototype', 'Performance Report', 'Consultation']
        },
        {
            plan: 'Full Development',
            price: 'Starting at $50,000',
            features: ['End-to-End Model Dev', 'System Integration', 'Deployment & Monitoring', 'Ongoing Support']
        }
    ]
  },
];

export const featuredProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Recommendation Engine',
    summary: 'Increased customer engagement by 30% with a personalized product recommendation system.',
    imageUrl: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2670&auto=format&fit=crop',
    technologies: ['Python', 'TensorFlow', 'React'],
  },
  {
    id: '2',
    title: 'Automated Fraud Detection',
    summary: 'Reduced fraudulent transactions by 95% for a leading fintech company using a real-time AI model.',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2670&auto=format&fit=crop',
    technologies: ['scikit-learn', 'Django', 'PostgreSQL'],
  },
  {
    id: '3',
    title: 'Healthcare Diagnostics AI',
    summary: 'Developed an AI tool to assist radiologists in identifying anomalies in medical images with 98% accuracy.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop',
    technologies: ['PyTorch', 'Next.js', 'AWS'],
  },
];

export const testimonials: Feedback[] = [
   {
    id: '1',
    name: 'Sijan Shrestha',
    company: 'Ghadi Corp',
    country: 'USA',
    role: 'CEO',
    message: 'Great experience with this IT company! The team is professional, reliable, and quick to solve problems. Highly recommend their services.',
    rating: 4,
    status: 'approved',
    featured: true,
  },
   {
    id: '3',
    name: 'Emily White',
    company: 'Future Gadgets',
    country: 'UK',
    role: 'Product Manager',
    message: 'Working with AI-Solutions was a fantastic experience. They delivered a high-quality custom model on time and on budget.',
    rating: 5,
    status: 'approved',
    featured: true,
  },
];

export const articles: Article[] = [
    {
        id: '1',
        title: 'The Future of AI in Business',
        excerpt: 'Exploring how artificial intelligence is reshaping industries and what it means for your business...',
        content: 'Artificial Intelligence (AI) is no longer a futuristic concept; it\'s a present-day reality that is transforming industries across the board. From healthcare to finance, AI is driving innovation, automating processes, and unlocking unprecedented insights from data. This article explores the current landscape of AI in business and what leaders should be thinking about to stay ahead of the curve. We will delve into key areas such as machine learning, natural language processing, and computer vision, and discuss how they are being applied to solve real-world problems. We also examine the ethical considerations and challenges that come with deploying AI at scale, offering a framework for responsible innovation. Whether you are a business leader, a technologist, or simply an AI enthusiast, this article will provide you with a comprehensive overview of the transformative power of AI.',
        author: 'Dr. Alex Chen',
        published_date: '2024-07-15',
        imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2574&auto=format&fit=crop',
        featured: true,
    },
    {
        id: '2',
        title: 'Getting Started with Machine Learning',
        excerpt: 'A beginner-friendly guide to the fundamental concepts of machine learning and its applications...',
        content: 'Machine Learning (ML) is a subset of artificial intelligence that gives computers the ability to learn without being explicitly programmed. If you\'re new to the field, the terminology and concepts can seem daunting. This guide is here to help. We break down the fundamental concepts of ML, including supervised, unsupervised, and reinforcement learning. We walk through a simple, hands-on example to demonstrate how a model is trained and evaluated. We also cover the essential tools and libraries in the Python ecosystem, such as scikit-learn, TensorFlow, and PyTorch, that every aspiring ML practitioner should know. By the end of this article, you\'ll have a solid foundation and a clear roadmap for your machine learning journey.',
        author: 'Maria Garcia',
        published_date: '2024-07-10',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-ff980877a244?q=80&w=2670&auto=format&fit=crop',
        featured: true,
    },
    {
        id: '3',
        title: 'The Ethics of AI: Navigating the Grey Areas',
        excerpt: 'A deep dive into the ethical considerations and challenges that come with developing and deploying AI systems...',
        content: 'As artificial intelligence becomes more integrated into our daily lives, the ethical implications of these powerful systems are more important than ever to consider. This article provides a deep dive into the complex ethical landscape of AI. We explore issues such as algorithmic bias, data privacy, accountability, and the societal impact of automation. Through a series of case studies, we examine the real-world consequences of AI systems that have been deployed without sufficient ethical oversight. We also propose a framework for organizations to develop and implement ethical AI guidelines, ensuring that their technologies are fair, transparent, and aligned with human values. This is a must-read for anyone involved in the creation or deployment of AI.',
        author: 'Dr. Alex Chen',
        published_date: '2024-07-05',
        imageUrl: 'https://images.unsplash.com/photo-1531771686278-2514a44009a44?q=80&w=2574&auto=format&fit=crop',
        featured: true,
    }
];

export const galleryImages: GalleryImage[] = [
    {id: '1', title: 'Our Team at AI Conf 2024', imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=2670&auto=format&fit=crop', caption: 'A great moment of collaboration and learning.', category: 'Tech Conferences'},
    {id: '2', title: 'Office Brainstorming Session', imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop', caption: 'Where great ideas are born.', category: 'Workshops & Training'},
    {id: '3', title: 'Data Center Infrastructure', imageUrl: 'https://images.unsplash.com/photo-1590859808308-3d2d64594784?q=80&w=2671&auto=format&fit=crop', caption: 'The heart of our AI operations.', category: 'Technology'},
    {id: '4', title: 'Client Workshop', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop', caption: 'Partnering with clients to build the future.', category: 'Client Meetups'},
    {id: '5', title: 'Product Launch Event', imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=2576&auto=format&fit=crop', caption: 'Announcing our new product.', category: 'Product Launches'},
];

export const events: Event[] = [
    {id: '1', title: 'AI in Fintech Summit', date: '2025-09-20', time: '10:00 AM', location: 'London, UK', description: 'Join us as we discuss the future of AI in the financial sector, covering topics from algorithmic trading to blockchain innovations.', imageUrl: 'https://picsum.photos/seed/1/600/400', is_past: false, promotional: true},
    {id: '2', title: 'Innovate AI 2025', date: '2025-10-15', time: '9:00 AM', location: 'San Francisco, USA', description: 'A premier conference for AI professionals, researchers, and enthusiasts to explore the latest trends and breakthroughs.', imageUrl: 'https://picsum.photos/seed/2/600/400', is_past: false, promotional: false},
    {id: '5', title: 'AI in Healthcare', date: '2025-11-05', time: '2:00 PM', location: 'Boston, USA', description: 'Exploring the impact of AI on patient care and medical research.', imageUrl: 'https://picsum.photos/seed/5/600/400', is_past: false, promotional: false},
    {id: '6', title: 'Machine Learning Week', date: '2025-11-20', time: '11:00 AM', location: 'Berlin, Germany', description: 'A week-long series of workshops and talks on the latest in machine learning.', imageUrl: 'https://picsum.photos/seed/6/600/400', is_past: false, promotional: false},
    {id: '3', title: 'Global AI Conference', date: '2024-06-12', time: 'All Day', location: 'Virtual', description: 'Our CEO presented on the ethics of AI, discussing the importance of responsible development and deployment.', imageUrl: 'https://picsum.photos/seed/3/600/400', is_past: true, promotional: false},
    {id: '4', title: 'Tech Innovators Meetup', date: '2024-04-05', time: '6:00 PM', location: 'New York, USA', description: 'A networking event where our team shared insights on implementing machine learning in small businesses.', imageUrl: 'https://picsum.photos/seed/4/600/400', is_past: true, promotional: false},
    {id: '7', title: 'Data Science Symposium', date: '2024-01-20', time: '9:00 AM', location: 'Paris, France', description: 'A symposium focused on the latest research in data science and analytics.', imageUrl: 'https://picsum.photos/seed/7/600/400', is_past: true, promotional: false},
];

export const contactSubmissions: ContactSubmission[] = [
    {id: '1', name: 'Potential Client A', email: 'client.a@example.com', company: 'Big Corp', country: 'USA', jobTitle: 'CEO', message: 'I would like to know more about your chatbot solutions.', created_at: new Date(), read_status: false},
    {id: '2', name: 'Potential Client B', email: 'client.b@example.com', company: 'Startup Inc', country: 'Canada', jobTitle: 'CTO', message: 'We have a large dataset and would like to explore predictive analytics.', created_at: new Date(Date.now() - 86400000), read_status: true},
];

export const quoteRequests: QuoteRequest[] = [
    {id: '1', serviceId: '1', serviceTitle: 'Predictive Analytics', fullName: 'John Doe', email: 'john@example.com', selectedPlan: 'Business', message: 'Interested in the business plan for predictive analytics.', createdAt: new Date(), status: 'new'}
]
    

    

    













