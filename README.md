# LeadFlow AI

**Automate your sales outreach, amplify your conversions.**

LeadFlow AI is a web application that helps early-stage founders and solo builders enhance their CRM management through automated lead scoring and smart outreach sequences.

## 🚀 Features

### Core Features

- **Automated Lead Scoring**: AI-powered lead scoring based on customizable criteria
- **Smart Lead Segmentation**: Automatic categorization into Hot, Warm, Cold, and Nurture segments
- **Outreach Sequence Automation**: Multi-step email sequences with personalized follow-ups
- **Sequence Performance Analytics**: Track open rates, click-through rates, and conversions

### Technical Features

- **Real-time Database**: Powered by Supabase with Row Level Security
- **AI Integration**: OpenAI GPT for lead scoring and content generation
- **Subscription Management**: Stripe integration for tiered pricing
- **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-3.5/4 for lead scoring and content generation
- **Payments**: Stripe for subscription management
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- An OpenAI API key
- A Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/-app-development-8571.git
cd -app-development-8571
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Fill in your environment variables in `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=LeadFlow AI
```

### 4. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL to create all tables, indexes, and security policies

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your application running!

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User profiles and subscription information
- **leads**: Lead data with scoring and segmentation
- **sequences**: Email sequence definitions
- **sequence_steps**: Individual steps in sequences
- **lead_activities**: Activity tracking for leads
- **sequence_executions**: Tracks leads through sequences

## 🔐 Authentication & Security

- **Supabase Auth**: Email/password authentication with JWT tokens
- **Row Level Security**: Database-level security ensuring users only access their data
- **API Security**: All API calls are authenticated and authorized
- **Environment Variables**: Sensitive data stored securely

## 💳 Subscription Plans

### Free Plan
- Up to 100 leads
- Basic lead scoring
- 1 active sequence
- Email support

### Pro Plan ($49/month)
- Up to 1,000 leads
- Advanced AI lead scoring
- Unlimited sequences
- Email automation
- Analytics dashboard
- Priority support

### Business Plan ($199/month)
- Unlimited leads
- Advanced AI features
- Unlimited sequences
- Team collaboration
- Custom integrations
- Dedicated support

## 🤖 AI Features

### Lead Scoring
- Analyzes email domains, job titles, company information
- Considers recent activity and engagement
- Fallback algorithm when AI is unavailable

### Content Generation
- Personalized email content based on lead data
- Template-based generation with AI enhancement
- Maintains brand voice and tone

## 📊 Analytics

Track key metrics including:
- Lead conversion rates by segment
- Sequence performance metrics
- Open rates, click rates, reply rates
- ROI and revenue attribution

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify Deployment

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── components/      # Reusable UI components
├── contexts/        # React contexts for state management
├── lib/            # Utility libraries and services
├── pages/          # Page components
├── styles/         # CSS and styling
└── main.jsx        # Application entry point

database/
└── schema.sql      # Database schema and setup

public/             # Static assets
```

## 🧪 Testing

The application includes comprehensive error handling and fallback mechanisms:

- Database connection failures fall back to local state
- AI service failures use fallback algorithms
- Graceful degradation for offline scenarios

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Email**: Contact support for Pro/Business plan users

## 🔮 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] Mobile app
- [ ] Advanced AI features
- [ ] White-label options

---

Built with ❤️ for founders and sales teams who want to automate their outreach and focus on closing deals.
