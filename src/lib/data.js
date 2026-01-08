export const zones = [
  {
    id: 'industrial_zone_A',
    name: 'Industrial Zone A',
    type: 'Industrial',
    placement: { lat: 28.61, lng: 77.23 },
    baseEmissions: 2000,
  },
  {
    id: 'transport_corridor_1',
    name: 'Transport Corridor 1',
    type: 'Transport',
    placement: { lat: 19.07, lng: 72.87 },
    baseEmissions: 1100,
  },
  {
    id: 'downtown_commercial',
    name: 'Downtown Commercial',
    type: 'Commercial',
    placement: { lat: 22.57, lng: 88.36 },
    baseEmissions: 1000,
  },
  {
    id: 'residential_east',
    name: 'Residential East',
    type: 'Residential',
    placement: { lat: 13.08, lng: 80.27 },
    baseEmissions: 620,
  },
];

export const interventions = [
  {
    id: 'ccs001_industrial_zone_A',
    systemId: 'CCS001',
    zoneId: 'industrial_zone_A',
    type: 'Amine Scrubber',
    status: 'Simulated',
    placement: { lat: 28.7041, lng: 77.1025 }, // Delhi
    estimatedImpact: 45,
  },
  {
    id: 'dac001_transport_corridor_1',
    systemId: 'DAC001',
    zoneId: 'transport_corridor_1',
    type: 'Roadside DAC',
    status: 'Proposed',
    placement: { lat: 19.0760, lng: 72.8777 }, // Mumbai
    estimatedImpact: 0, // No estimated impact available
  },
  {
    id: 'vg001_downtown_commercial',
    systemId: 'VG001',
    zoneId: 'downtown_commercial',
    type: 'Vertical Garden',
    status: 'Deployed',
    placement: { lat: 22.5726, lng: 88.3639 }, // Kolkata
    estimatedImpact: 2,
  },
];

export const initialAlerts = [
  {
    id: 'alert001',
    zoneId: 'industrial_zone_A',
    zoneName: 'Industrial Zone A',
    level: 'Warning',
    message: 'Predicted CO2 spike of 20% in Industrial Zone A within 6 hours due to high industrial activity forecast.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    predictedValue: 1800,
    baselineValue: 1500,
    actionRecommended: 'Consider activating standby capture units.',
  },
  {
    id: 'alert002',
    zoneId: 'transport_corridor_1',
    zoneName: 'Transport Corridor 1',
    level: 'Info',
    message: 'Predicted low CO2 emissions in Transport Corridor 1. Baseline: 950t, Predicted: 665t.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'Active',
    predictedValue: 665,
    baselineValue: 950,
    actionRecommended: 'No action needed, or consider maintenance for capture systems.',
  },
];

export const scenarios = [
    {
      id: 'scenario_1',
      name: 'Aggressive Urban Greening',
      description: 'Focuses on deploying Vertical Gardens and Algal Bioreactors across commercial and residential zones.',
      interventions: ['vg001_downtown_commercial'],
    },
    {
      id: 'scenario_2',
      name: 'Industrial & Transport Focus',
      description: 'Prioritizes high-impact interventions like Amine Scrubbers and Roadside DAC in industrial areas and transport corridors.',
      interventions: ['ccs001_industrial_zone_A', 'dac001_transport_corridor_1'],
    },
    {
      id: 'scenario_3',
      name: 'City-Wide DAC Deployment',
      description: 'A simulation of placing Roadside DAC units in all major zones to model broad impact.',
      interventions: ['dac001_transport_corridor_1'],
    },
  ];
