export type Zone = {
  id: string;
  name: string;
  type: 'Industrial' | 'Transport' | 'Residential' | 'Commercial' | 'Urban Park' | 'Power Plant' | 'Waterfront' | 'University';
  placement: { lat: number; lng: number };
  baseEmissions: number;
};

export type Intervention = {
  id: string;
  systemId: string;
  zoneId: string;
  shortReason?: string;
  type: 'Amine Scrubber' | 'Roadside DAC' | 'Vertical Garden' | 'Algal Bioreactor' | 'Biofilter';
  status: 'Proposed' | 'Deployed' | 'Simulated';
  placement: { lat: number; lng: number };
  estimatedImpact: number;
  parameters?: {
    ratedAirflow?: number;
    removalEfficiency?: number;
    energyUse?: number;
  }
  simulatedImpact?: {
    tco2CapturedPerDay: number;
    co2ReductionPPM: number;
    costPerTonCO2: number;
    energyConsumptionPerDay: number;
  };
};

export type Scenario = {
  id: string;
  name: string;
  description: string;
  interventions: string[]; // Array of intervention IDs
};

export type Alert = {
  id: string;
  zoneId: string;
  zoneName?: string;
  level: 'Warning' | 'Critical' | 'Info';
  message: string;
  timestamp: string;
  status: 'Active' | 'Resolved';
  predictedValue: number;
  baselineValue: number;
  actionRecommended: string;
};

export type Recommendation = {
  zoneId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  interventionType: string;
  expectedImpact: {
    tco2CapturedPerDay: number;
    costPerTonCO2: number;
    energyConsumptionPerDay: number;
  };
  reasoning: string;
};
