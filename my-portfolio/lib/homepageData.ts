export interface HomeContentItem {
  title: string;
  description: string;
  link: string;
}

export function getProductsForHomepage(): HomeContentItem[] {
  return [
    {
      title: 'Agentic MLOps Platform',
      description: 'AI agents that auto-generate complete MLOps infrastructure - from requirements to production-ready pipelines with monitoring, CI/CD, and cost optimization',
      link: '/products/agentic-mlops'
    },
    {
      title: 'AI Scriptwriter for The Office',
      description: 'Fine-tuned open-source LLM that generates authentic sitcom screenplays with character-specific dialogue and comedy beats using RLHF and chain-of-thought reasoning',
      link: '/products/ai-scriptwriter'
    },
    {
      title: 'Kannada Physics Tutor',
      description: 'AI physics tutor delivering Feynman-style explanations in Kannada language with visual analogies, RAG-powered content, and LLM-as-judge evaluation',
      link: '/products/ai-feynman-kannada-tutor'
    }
  ];
}

export function getPlaybooksForHomepage(): HomeContentItem[] {
  return [
    {
      title: 'MLOps in Production',
      description: 'Comprehensive guide to building, deploying, and maintaining ML systems in production environments with real-world examples and best practices',
      link: '/playbooks/mlops-production-guide'
    },
    {
      title: 'AI Agents Playbook',
      description: 'A multi-chapter guide covering the fundamentals and operational practices for deploying autonomous AI agents in production',
      link: '/playbooks/agents'
    },
    {
      title: 'GenAI Applications',
      description: 'Practical guide to building production-ready generative AI applications, covering architecture, optimization, and real-world deployment strategies',
      link: '/playbooks/genai-applications'
    },
    {
      title: 'Statistics for ML',
      description: 'A practical guide to statistical concepts essential for deploying and monitoring ML systems in production',
      link: '/playbooks/stats-for-mlops'
    }
  ];
}

export function getIllustratedGuidesForHomepage(): HomeContentItem[] {
  return [
    {
      title: 'RLHF Illustrated',
      description: 'Interactive web platform transforming complex RLHF concepts into engaging visual learning experiences with 30+ visualizations',
      link: '/illustrated-guides/illustrated-rlhf'
    },
    {
      title: 'Stats for MLOps Illustrated',
      description: 'Interactive platform teaching production ML statistics through narrative storytelling, live visualizations, and real-world case studies',
      link: '/illustrated-guides/stats-for-mlops'
    }
  ];
} export function getAgenticAIProductsForHomepage(): HomeContentItem[] {
  return [
    {
      title: 'Technical Playbook',
      description: 'Production patterns for reliability, safety, evals, observability, and governance',
      link: '/agentic-ai-products/technical-strategies'
    },
    {
      title: 'Business Playbook',
      description: 'How to pick winning agent wedges, design adoption + distribution loops, price safely, and govern rollout',
      link: '/agentic-ai-products/product-business'
    },
    {
      title: 'Evaluation of AI Agents',
      description: 'A Tech-Lead playbook for evaluating agent behavior over time, not just answer quality',
      link: '/agentic-ai-products/agentic-ai-evals'
    },
    {
      title: 'Agentic RL',
      description: 'Optimize the whole workflow policy (tool calls, intermediate decisions) using RFT for measurable lift',
      link: '/agentic-ai-products/agentic-rl'
    },
    {
      title: 'Context Engineering',
      description: 'A systems-first guide to keeping agent context small, relevant, reliable, and auditable',
      link: '/agentic-ai-products/context-engineering'
    },
    {
      title: 'Product Proposals',
      description: '4 domain proposals using a reusable consulting methodology (Product + Tech + Governance)',
      link: '/agentic-ai-products/product-proposals'
    }
  ];
}

export function getAgenticCodingForHomepage(): HomeContentItem[] {
  return [
    {
      title: 'Spec-Driven Development',
      description: 'Control system designs for turning specs into incremental code changes',
      link: '/agentic-coding/spec-driven-development'
    },
    {
      title: 'Effective Claude Code',
      description: 'Senior engineer mental models for composable primitives and team workflows',
      link: '/agentic-coding/claude-code-howto'
    },
    {
      title: 'Claude Agent SDK',
      description: 'Comprehensive guide to building production-ready agentic AI systems using the Claude Agent SDK',
      link: '/agentic-coding/claude-agent-sdk'
    },
    {
      title: 'How to Build Coding Agents',
      description: 'Complete playbook covering architecture, training, evals, and observability',
      link: '/agentic-coding/how-to-build-coding-agents'
    }
  ];
}
