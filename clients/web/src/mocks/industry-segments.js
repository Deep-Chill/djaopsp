const DELAY = 100

export function getIndustrySegments() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          text: 'Architectural design',
          value: 'architecture-design',
        },
        {
          text: 'Aviation services',
          value: 'aviation-services',
        },
        {
          text: 'Construction',
          value: 'construction',
        },
        {
          text: 'Consulting/Advisory services',
          value: 'consulting',
        },
        {
          text: 'Distribution/ Logistics & Shipping',
          value: 'distribution-industry',
        },
        {
          text: 'Energy efficiency contracting',
          value: 'energy-efficiency-contracting',
        },
        {
          text: 'Engineering',
          value: 'engineering',
        },
        {
          text: 'Engineering, Procurement, Construction',
          value: 'epc',
        },
        {
          text: 'Enviro. consulting, engineering, construction',
          value: 'ecec',
        },
        {
          header: 'Facilities Management',
        },
        {
          text: 'Full facilities management service',
          value: 'facilities-management-industry',
        },
        {
          text: 'Grounds maintenance',
          value: 'grounds-maintenance',
        },
        {
          text: 'Janitorial services',
          value: 'janitorial-services',
        },
        { divider: true },
        {
          text: 'Freight & shipping',
          value: 'freight-and-shipping',
        },
        {
          text: 'Fuel supply',
          value: 'fuel-supply',
        },
        {
          text: 'General contracting',
          value: 'general-contractors',
        },
        {
          text: 'Interior design',
          value: 'interior-design',
        },
        {
          text: 'Lab services',
          value: 'lab-services',
        },
        {
          header: 'Manufacturing',
        },
        {
          text: 'Boxes & enclosures',
          value: 'boxes-and-enclosures',
        },
        {
          text: 'Distribution transformers',
          value: 'distribution-transformers',
        },
        {
          text: 'Fabricated metals',
          value: 'fabricated-metals',
        },
        {
          text: 'General manufacturing',
          value: 'general-manufacturing',
        },
        {
          text: 'Wire & cable',
          value: 'wire-and-cable',
        },
        {
          divider: true,
        },
        {
          text: 'Marketing & communications',
          value: 'marketing-and-communications',
        },
        {
          text: 'Print services',
          value: 'print-services',
        },
        {
          text: 'Professional services',
          value: 'office-space-only',
        },
        {
          text: 'Rental equipment & parts',
          value: 'vehicle-equipment-and-parts',
        },
        {
          text: 'Value added reselling',
          value: 'shipping-and-logistics',
        },
        {
          text: 'Vegetation management',
          value: 'vegetation-industry',
        },
        {
          text: 'Waste management',
          value: 'waste-industry',
        },
      ])
    }, DELAY)
  })
}

export function getPreviousIndustrySegments() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([])
    }, DELAY)
  })
}
