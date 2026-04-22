import CONFIGS from '@/constants/configs.json';

const PLANS = [
  {
    "name": "Free",
    "title": "Free",
    "features": [
      {"title": "Single Member", "color": "gray"},
      {"title": "Unlimited Artworks", "color": "green"},
      {"title": "Unlimited Locations", "color": "green"},
      {"title": `${CONFIGS.app.name} Branding`, "color": "gray"}
    ]
  },
  {
    "name": "Professional",
    "title": "Pro",
    "features": [
      {"title": "Unlimited Members", "color": "green"},
      {"title": "Unlimited Artworks", "color": "green"},
      {"title": "Unlimited Locations", "color": "green"},
      {"title": `Remove ${CONFIGS.app.name} Branding`, "color": "green"},
      {"title": "Priority Support", "color": "green"}
    ]
  }
]

export default PLANS;
