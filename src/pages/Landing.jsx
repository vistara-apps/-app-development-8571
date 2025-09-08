import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Zap, 
  Target, 
  Users, 
  Workflow, 
  BarChart3, 
  ArrowRight,
  Check,
  Star
} from 'lucide-react'

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">LeadFlow AI</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-text-secondary hover:text-text-primary">Features</a>
              <a href="#pricing" className="text-text-secondary hover:text-text-primary">Pricing</a>
              <a href="#about" className="text-text-secondary hover:text-text-primary">About</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/app" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-text-secondary hover:text-text-primary">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6 leading-tight">
              Automate your sales outreach,
              <span className="text-accent"> amplify your conversions</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              A web application that helps early-stage founders and solo builders enhance their CRM management through automated lead scoring and smart outreach sequences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-3">
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-5xl mx-auto">
              <div className="bg-gray-900 rounded-lg p-6 text-white">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 font-medium">Hot Leads</span>
                      <span className="text-2xl font-bold">23</span>
                    </div>
                    <div className="text-sm text-gray-400">+12% this week</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 font-medium">Active Sequences</span>
                      <span className="text-2xl font-bold">5</span>
                    </div>
                    <div className="text-sm text-gray-400">2 launching today</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 font-medium">Response Rate</span>
                      <span className="text-2xl font-bold">34%</span>
                    </div>
                    <div className="text-sm text-gray-400">Above average</div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="h-24 bg-gradient-to-r from-accent/20 to-primary/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Everything you need to supercharge your sales
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Focus on the most promising leads, automate repetitive tasks, and optimize your outreach with AI-powered insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Automated Lead Scoring</h3>
              <p className="text-text-secondary">
                Intelligent scores based on website activity, email engagement, and custom criteria.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Smart Segmentation</h3>
              <p className="text-text-secondary">
                Automatically categorize leads into Hot, Warm, Cold, and Nurture segments.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Workflow className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Outreach Automation</h3>
              <p className="text-text-secondary">
                Build multi-step email sequences with personalized follow-ups at scale.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Performance Analytics</h3>
              <p className="text-text-secondary">
                Track open rates, click-through rates, and conversions to optimize campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-text-secondary">
              Start free, scale as you grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-2">Free</h3>
              <div className="text-4xl font-bold text-text-primary mb-6">
                $0<span className="text-lg font-normal text-text-secondary">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Up to 100 leads</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic lead scoring</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>1 active sequence</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
              <Link to="/signup" className="w-full btn-secondary block text-center">
                Get Started
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-accent relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Pro</h3>
              <div className="text-4xl font-bold text-text-primary mb-6">
                $49<span className="text-lg font-normal text-text-secondary">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Up to 5,000 leads</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Advanced AI scoring</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited sequences</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Analytics dashboard</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link to="/signup" className="w-full btn-primary block text-center">
                Start Free Trial
              </Link>
            </div>
            
            {/* Business Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-2">Business</h3>
              <div className="text-4xl font-bold text-text-primary mb-6">
                $199<span className="text-lg font-normal text-text-secondary">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited leads</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>White-label options</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Link to="/signup" className="w-full btn-secondary block text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">LeadFlow AI</span>
              </div>
              <p className="text-gray-400">
                Automate your sales outreach, amplify your conversions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LeadFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}