'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  HiOutlineCode,
  HiOutlineCog,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineScale,
  HiOutlineTerminal,
  HiOutlineClipboardCheck,
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineExclamationCircle,
  HiOutlineChatAlt,
  HiOutlinePhotograph,
  HiOutlineDocument,
  HiOutlineMicrophone,
  HiOutlineStar,
  HiOutlineChartSquareBar
} from 'react-icons/hi';

export default function APIDevPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('prediction');
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  const endpoints = {
    prediction: {
      title: 'Prediction API',
      method: 'POST',
      endpoint: '/api/v1/predict',
      description: 'Generate AI-powered predictions based on your data with support for multiple models and configurations',
      request: `{
  "model": "gpt-4",
  "input": {
    "text": "Your input text here",
    "parameters": {
      "temperature": 0.7,
      "max_tokens": 150,
      "top_p": 0.9,
      "frequency_penalty": 0.2,
      "presence_penalty": 0.1
    }
  },
  "options": {
    "stream": false,
    "return_prompt": false,
    "return_metadata": true
  }
}`,
      response: `{
  "prediction": "Generated prediction text",
  "confidence": 0.95,
  "processing_time": "0.234s",
  "metadata": {
    "model_version": "gpt-4-0613",
    "tokens_used": 127,
    "finish_reason": "stop"
  },
  "alternatives": [
    {
      "text": "Alternative prediction",
      "confidence": 0.85
    }
  ]
}`
    },
    workflow: {
      title: 'Workflow API',
      method: 'POST',
      endpoint: '/api/v1/workflow',
      description: 'Create and manage sophisticated AI workflows with parallel processing and conditional branching',
      request: `{
  "workflow_name": "document_processing",
  "version": "1.0",
  "steps": [
    {
      "id": "extract",
      "type": "text_extraction",
      "config": { 
        "language": "en",
        "ocr_enabled": true,
        "layout_analysis": true
      }
    },
    {
      "id": "classify",
      "type": "classification",
      "config": { 
        "model": "classifier-v2",
        "threshold": 0.85
      },
      "depends_on": ["extract"]
    },
    {
      "id": "summarize",
      "type": "text_summarization",
      "config": {
        "max_length": 200,
        "style": "bullet_points"
      },
      "depends_on": ["classify"],
      "condition": "classification_score > 0.9"
    }
  ],
  "error_handling": {
    "retry_count": 3,
    "fallback_strategy": "skip_step"
  }
}`,
      response: `{
  "workflow_id": "wf_123abc",
  "status": "created",
  "estimated_time": "2m",
  "steps_scheduled": 3,
  "webhook_url": "https://api.optiflow.ai/webhooks/wf_123abc",
  "monitoring_url": "/api/v1/workflow/wf_123abc/status"
}`
    },
    monitoring: {
      title: 'Monitoring API',
      method: 'GET',
      endpoint: '/api/v1/metrics',
      description: 'Comprehensive monitoring and analytics for your API usage with detailed performance metrics',
      request: `{
  "timeframe": "24h",
  "metrics": [
    "requests_count",
    "average_latency",
    "error_rate",
    "success_rate",
    "token_usage",
    "concurrent_requests"
  ],
  "dimensions": [
    "endpoint",
    "model",
    "status_code"
  ],
  "filters": {
    "status_code": ["200", "400", "429", "500"],
    "endpoint": ["/api/v1/predict", "/api/v1/workflow"]
  }
}`,
      response: `{
  "metrics": {
    "requests_count": 15234,
    "average_latency": "156ms",
    "error_rate": "0.12%",
    "success_rate": "99.88%",
    "token_usage": 1250000,
    "concurrent_requests": {
      "peak": 250,
      "average": 85
    }
  },
  "breakdown": {
    "by_endpoint": {
      "/api/v1/predict": {
        "requests_count": 10234,
        "average_latency": "145ms"
      },
      "/api/v1/workflow": {
        "requests_count": 5000,
        "average_latency": "178ms"
      }
    },
    "by_status_code": {
      "200": 15215,
      "400": 12,
      "429": 5,
      "500": 2
    }
  },
  "period": "last_24h"
}`
    },
    batch: {
      title: 'Batch Processing API',
      method: 'POST',
      endpoint: '/api/v1/batch',
      description: 'Process large volumes of data efficiently with our batch processing API',
      request: `{
  "job_name": "bulk_predictions",
  "input_source": {
    "type": "s3",
    "bucket": "your-bucket",
    "prefix": "inputs/",
    "format": "jsonl"
  },
  "output_destination": {
    "type": "s3",
    "bucket": "your-bucket",
    "prefix": "outputs/",
    "format": "jsonl"
  },
  "processing_config": {
    "max_concurrent_items": 100,
    "timeout_per_item": "30s",
    "retry_config": {
      "max_attempts": 3,
      "backoff": "exponential"
    }
  },
  "notification_config": {
    "on_complete": {
      "type": "webhook",
      "url": "https://your-domain.com/webhooks/batch-complete"
    },
    "on_error": {
      "type": "email",
      "address": "admin@your-domain.com"
    }
  }
}`,
      response: `{
  "batch_job_id": "batch_xyz789",
  "status": "queued",
  "estimated_completion_time": "15m",
  "input_file_count": 1000,
  "monitoring_url": "/api/v1/batch/batch_xyz789/status",
  "created_at": "2024-03-20T10:30:00Z"
}`
    }
  };

  const features = [
    {
      title: "RESTful APIs",
      description: "Modern REST APIs with comprehensive endpoints for all AI operations, following OpenAPI specifications",
      icon: <HiOutlineCode className="w-8 h-8" />
    },
    {
      title: "Real-time Processing",
      description: "High-performance infrastructure with WebSocket support for real-time AI processing and streaming responses",
      icon: <HiOutlineLightningBolt className="w-8 h-8" />
    },
    {
      title: "Security & Auth",
      description: "Enterprise-grade security with OAuth2, API keys, and RBAC support, plus automated security scanning",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />
    },
    {
      title: "Auto-scaling",
      description: "Intelligent auto-scaling with predictive scaling policies and multi-region deployment options",
      icon: <HiOutlineCog className="w-8 h-8" />
    },
    {
      title: "Documentation",
      description: "Interactive documentation with OpenAPI/Swagger support and code samples in multiple languages",
      icon: <HiOutlineDocumentText className="w-8 h-8" />
    },
    {
      title: "Rate Limiting",
      description: "Flexible rate limiting with burst support and fair usage policies across different tiers",
      icon: <HiOutlineScale className="w-8 h-8" />
    },
    {
      title: "Monitoring & Analytics",
      description: "Real-time monitoring with detailed analytics, custom alerts, and performance insights",
      icon: <HiOutlineChartBar className="w-8 h-8" />
    },
    {
      title: "Version Control",
      description: "API versioning support with backward compatibility and gradual rollout capabilities",
      icon: <HiOutlineCollection className="w-8 h-8" />
    },
    {
      title: "Error Handling",
      description: "Comprehensive error handling with detailed error messages and debugging support",
      icon: <HiOutlineExclamationCircle className="w-8 h-8" />
    }
  ];

  const sdkExamples = {
    python: {
      title: "Python",
      code: `from optiflow import Client

client = Client(api_key="your-api-key")

# Make a prediction
response = client.predict(
    text="Your input text",
    model="gpt-4",
    temperature=0.7
)

print(f"Prediction: {response.text}")
print(f"Confidence: {response.confidence}")

# Create a workflow
workflow = client.workflow.create(
    name="document_processing",
    steps=[
        {
            "type": "text_extraction",
            "config": {"language": "en"}
        },
        {
            "type": "classification",
            "config": {"model": "classifier-v2"}
        }
    ]
)

# Monitor the workflow
status = workflow.wait()
results = workflow.get_results()`
    },
    javascript: {
      title: "JavaScript",
      code: `import { OptiflowClient } from '@optiflow/sdk';

const client = new OptiflowClient({
  apiKey: 'your-api-key'
});

// Make a prediction
async function getPrediction() {
  try {
    const response = await client.predict({
      text: 'Your input text',
      model: 'gpt-4',
      temperature: 0.7
    });

    console.log('Prediction:', response.text);
    console.log('Confidence:', response.confidence);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Create and monitor a workflow
async function runWorkflow() {
  const workflow = await client.workflow.create({
    name: 'document_processing',
    steps: [
      {
        type: 'text_extraction',
        config: { language: 'en' }
      },
      {
        type: 'classification',
        config: { model: 'classifier-v2' }
      }
    ]
  });

  workflow.on('completed', (results) => {
    console.log('Workflow completed:', results);
  });

  workflow.on('error', (error) => {
    console.error('Workflow error:', error);
  });
}`
    },
    curl: {
      title: "cURL",
      code: `# Make a prediction
curl -X POST https://api.optiflow.ai/v1/predict \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "input": {
      "text": "Your input text",
      "parameters": {
        "temperature": 0.7
      }
    }
  }'

# Create a workflow
curl -X POST https://api.optiflow.ai/v1/workflow \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflow_name": "document_processing",
    "steps": [
      {
        "type": "text_extraction",
        "config": { "language": "en" }
      },
      {
        "type": "classification",
        "config": { "model": "classifier-v2" }
      }
    ]
  }'`
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full left-1/4 top-1/4 bg-[#3CDFFF] opacity-10 blur-[120px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full right-1/4 bottom-1/3 bg-[#4AFFD4] opacity-10 blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              API{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Development
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Build powerful AI applications with our comprehensive API suite
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="#documentation" 
                className="px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-xl text-black text-lg font-semibold hover:opacity-90 transition-all duration-300"
              >
                View Documentation
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 border-2 border-[#3CDFFF] text-[#3CDFFF] rounded-xl text-lg font-semibold hover:bg-[#3CDFFF]/10 transition-all duration-300"
              >
                Get API Key
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              API Features
            </h2>
            <p className="text-lg text-gray-300">
              Everything you need to build powerful AI applications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className="text-[#3CDFFF] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Documentation */}
      <section id="documentation" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#3CDFFF]/5 to-black" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Interactive API Documentation
            </h2>
            <p className="text-lg text-gray-300">
              Explore our API endpoints with live examples
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <nav className="space-y-2">
                  {Object.entries(endpoints).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedEndpoint(key)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                        selectedEndpoint === key
                          ? 'bg-[#3CDFFF]/10 border border-[#3CDFFF]/30 text-white'
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      {value.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Documentation Content */}
            <div className="lg:col-span-3">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                {/* Endpoint Header */}
                <div className="border-b border-white/10 p-6">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      endpoints[selectedEndpoint].method === 'GET'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {endpoints[selectedEndpoint].method}
                    </span>
                    <code className="text-gray-300">
                      {endpoints[selectedEndpoint].endpoint}
                    </code>
                  </div>
                  <p className="mt-3 text-gray-400">
                    {endpoints[selectedEndpoint].description}
                  </p>
                </div>

                {/* Request/Response Examples */}
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                  {/* Request */}
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-4">REQUEST</h4>
                    <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-gray-300">
                        {endpoints[selectedEndpoint].request}
                      </code>
                    </pre>
                  </div>

                  {/* Response */}
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-4">RESPONSE</h4>
                    <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-gray-300">
                        {endpoints[selectedEndpoint].response}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Getting Started
            </h2>
            
            <div className="space-y-8">
              {/* Authentication */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <HiOutlineShieldCheck className="w-6 h-6 mr-2 text-[#3CDFFF]" />
                  Authentication
                </h3>
                <p className="text-gray-300 mb-4">
                  All API requests must include your API key in the headers:
                </p>
                <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-300">
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
                  </code>
                </pre>
              </div>

              {/* Rate Limits */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <HiOutlineScale className="w-6 h-6 mr-2 text-[#3CDFFF]" />
                  Rate Limits
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Free tier: 1,000 requests/day</li>
                  <li>Pro tier: 10,000 requests/day</li>
                  <li>Enterprise tier: Custom limits</li>
                </ul>
              </div>

              {/* Code Examples */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <HiOutlineTerminal className="w-6 h-6 mr-2 text-[#3CDFFF]" />
                  Code Example
                </h3>
                <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-300">
{`const response = await fetch('https://api.optiflow.ai/v1/predict', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    input: {
      text: 'Your input text',
      parameters: {
        temperature: 0.7
      }
    }
  })
});

const data = await response.json();`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDK Examples */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#3CDFFF]/5 to-black" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Official SDKs
            </h2>
            <p className="text-lg text-gray-300">
              Get started quickly with our official SDKs and code examples
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2 mb-6">
              {Object.entries(sdkExamples).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLanguage(key)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedLanguage === key
                      ? 'bg-[#3CDFFF]/10 border border-[#3CDFFF]/30 text-white'
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {value.title}
                </button>
              ))}
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm text-gray-300">
                  {sdkExamples[selectedLanguage].code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Use Cases
            </h2>
            <p className="text-lg text-gray-300">
              Discover how our API powers various AI applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Natural Language Processing",
                description: "Build chatbots, content generators, and text analysis tools with our NLP endpoints",
                icon: <HiOutlineChatAlt className="w-8 h-8" />
              },
              {
                title: "Computer Vision",
                description: "Create image recognition, object detection, and visual search applications",
                icon: <HiOutlinePhotograph className="w-8 h-8" />
              },
              {
                title: "Document Processing",
                description: "Automate document analysis, extraction, and classification workflows",
                icon: <HiOutlineDocument className="w-8 h-8" />
              },
              {
                title: "Voice & Speech",
                description: "Implement speech recognition, synthesis, and voice-based interactions",
                icon: <HiOutlineMicrophone className="w-8 h-8" />
              },
              {
                title: "Recommendation Systems",
                description: "Build personalized recommendation engines for content and products",
                icon: <HiOutlineStar className="w-8 h-8" />
              },
              {
                title: "Time Series Analysis",
                description: "Develop forecasting and anomaly detection systems for time-series data",
                icon: <HiOutlineChartSquareBar className="w-8 h-8" />
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className="text-[#3CDFFF] mb-4">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-300">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Version Support */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3CDFFF]/5 to-[#4AFFD4]/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              API Versions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <span className="text-[#3CDFFF] mr-2">v2</span>
                    Latest Version
                  </h3>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                    Stable
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Our current stable version with all the latest features and improvements.
                </p>
                <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-300">
                    Base URL: https://api.optiflow.ai/v2
                  </code>
                </pre>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <span className="text-[#3CDFFF] mr-2">v1</span>
                    Legacy Support
                  </h3>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
                    Maintained
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Legacy version with long-term support. Will be maintained until 2025.
                </p>
                <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-300">
                    Base URL: https://api.optiflow.ai/v1
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Update CTA section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3CDFFF]/5 to-[#4AFFD4]/5" />
        <div className="absolute w-[600px] h-[600px] rounded-full left-1/4 -top-1/2 bg-[#3CDFFF] opacity-10 blur-[120px]" />
        <div className="absolute w-[600px] h-[600px] rounded-full right-1/4 -bottom-1/2 bg-[#4AFFD4] opacity-10 blur-[120px]" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Build with Our{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                API?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers building the next generation of AI applications with our powerful API suite.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/contact" 
                className="px-10 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-xl text-black text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Get Your API Key
              </Link>
              <Link 
                href="https://docs.optiflow.ai" 
                className="px-10 py-4 border-2 border-[#3CDFFF] text-[#3CDFFF] rounded-xl text-lg font-semibold hover:bg-[#3CDFFF]/10 transition-all duration-300"
              >
                View Full Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 