import React from 'react';
import '../styles/Subscription.css';

const Subscription = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'Upload up to 3 PDFs',
        'Generate 50 questions/month',
        'Basic question types',
        'Email support'
      ],
      recommended: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      features: [
        'Upload up to 10 PDFs',
        'Generate 200 questions/month', 
        'All question types',
        'Priority email support',
        'Custom chapter marking'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      features: [
        'Unlimited PDF uploads',
        'Unlimited questions',
        'All question types',
        '24/7 Priority support',
        'Custom chapter marking',
        'API access',
        'Team collaboration'
      ],
      recommended: false
    }
  ];

  const handleSubscribe = (planName) => {
    // Handle subscription logic here
    console.log(`Subscribing to ${planName} plan`);
  };

  return (
    <div className="subscription-container">
      <h1>Choose Your Plan</h1>
      <p className="subtitle">Select the perfect plan for your PDF question generation needs</p>
      
      <div className="plans-container">
        {plans.map((plan) => (
          <div key={plan.name} className={`plan-card ${plan.recommended ? 'recommended' : ''}`}>
            {plan.recommended && <div className="recommended-badge">Most Popular</div>}
            <h2 className="plan-name">{plan.name}</h2>
            <div className="plan-price">{plan.price}<span>/month</span></div>
            
            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              className={`subscribe-button ${plan.recommended ? 'recommended-btn' : ''}`}
              onClick={() => handleSubscribe(plan.name)}
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      <div className="guarantee">
        <p>30-day money-back guarantee • Cancel anytime • Secure payment</p>
      </div>
    </div>
  );
};

export default Subscription;
