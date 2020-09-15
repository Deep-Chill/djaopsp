import {
  QUESTION_COMMENT_TYPE,
  QUESTION_EMPLOYEE_COUNT,
  QUESTION_ENERGY_CONSUMED,
  QUESTION_FRAMEWORK,
  QUESTION_RANGE_TYPE,
  QUESTION_RELEVANT_QUANTITY,
  QUESTION_REVENUE_GENERATED,
  QUESTION_WASTE_GENERATED,
  QUESTION_WATER_CONSUMED,
  QUESTION_YES_NO_TYPE,
} from '../../config/questionFormTypes'

export default [
  {
    id: '1',
    path: null,
    title: 'Boxes & enclosures',
    indent: 0,
  },
  {
    id: '2',
    path: null,
    title: 'Governance & management',
    picture: 'https://envconnect.s3.amazonaws.com/media/management-basics.png',
    indent: 1,
  },
  {
    id: '3',
    path: null,
    title: 'Assessment',
    indent: 2,
  },
  {
    id: '4',
    path:
      '/metal/boxes-and-enclosures/management-basics/assessment/the-assessment-process-is-rigorous',
    title: 'The assessment process is rigorous and thorough*',
    default_metric: QUESTION_COMMENT_TYPE,
    indent: 3,
    environmental_value: 1,
    business_value: 1,
    profitability: 1,
    implementation_ease: 1,
    avg_value: 1,
  },
  {
    id: '5',
    path: null,
    title: 'General',
    indent: 2,
  },
  {
    id: '6',
    path:
      '/metal/boxes-and-enclosures/management-basics/general/report-externally',
    title:
      'Report externally, on an annual basis, on program elements, key environmental issues and goals, challenges, and continual improvement efforts.',
    default_metric: QUESTION_ENERGY_CONSUMED,
    indent: 3,
    environmental_value: 1,
    business_value: 1,
    profitability: 1,
    implementation_ease: 1,
    avg_value: 1,
  },
  {
    id: '7',
    path:
      '/metal/boxes-and-enclosures/management-basics/general/test-question-type-employee-counted',
    title: 'Sustainability Department Staff',
    default_metric: QUESTION_EMPLOYEE_COUNT,
    indent: 3,
    environmental_value: 3,
    business_value: 2,
    profitability: 1,
    implementation_ease: 1,
    avg_value: 2,
  },
  {
    id: '8',
    path:
      '/metal/boxes-and-enclosures/management-basics/general/test-question-type-revenue-generated',
    title: 'Company Revenue',
    default_metric: QUESTION_REVENUE_GENERATED,
    indent: 3,
    environmental_value: 1,
    business_value: 1,
    profitability: 1,
    implementation_ease: 1,
    avg_value: 1,
  },
  {
    id: '9',
    path: null,
    title: 'Design',
    picture: 'https://envconnect.s3.amazonaws.com/media/design.png',
    indent: 1,
  },
  {
    id: '10',
    path: '/metal/boxes-and-enclosures/design/product-design',
    title: 'Product Design',
    default_metric: QUESTION_WATER_CONSUMED,
    indent: 2,
    environmental_value: 1,
    business_value: 1,
    profitability: 1,
    implementation_ease: 1,
    avg_value: 1,
  },
  {
    id: '11',
    path: '/metal/boxes-and-enclosures/design/packaging-design',
    title: 'Packaging Design',
    default_metric: QUESTION_WASTE_GENERATED,
    indent: 2,
    environmental_value: 2,
    business_value: 2,
    profitability: 2,
    implementation_ease: 2,
    avg_value: 2,
  },
  {
    id: '12',
    path: null,
    title: 'Production',
    picture: 'https://envconnect.s3.amazonaws.com/media/production.png',
    indent: 1,
  },
  {
    id: '13',
    path: null,
    title: 'Energy Efficiency',
    indent: 2,
  },
  {
    id: '14',
    path: null,
    title: 'Process heating',
    indent: 3,
  },
  {
    id: '15',
    path: null,
    title: 'Combustion',
    indent: 4,
  },
  {
    id: '16',
    path:
      '/metal/boxes-and-enclosures/production/energy-efficiency/process-heating/combustion/adjust-air-fuel-ratio',
    title: 'Adjust air/fuel ratio',
    default_metric: QUESTION_FRAMEWORK,
    indent: 5,
    environmental_value: 1,
    business_value: 1,
    profitability: 3,
    implementation_ease: 1,
    avg_value: 1,
  },
  {
    id: '17',
    path:
      '/metal/boxes-and-enclosures/production/energy-efficiency/process-heating/combustion/reduce-combustion-air-flow-to-optimum',
    title: 'Reduce combustion air flow to optimum',
    default_metric: QUESTION_YES_NO_TYPE,
    indent: 5,
    environmental_value: 1,
    business_value: 1,
    profitability: 1,
    implementation_ease: 2,
    avg_value: 1,
  },
  {
    id: '18',
    path: null,
    title: 'Hot Water System',
    indent: 3,
  },
  {
    id: '19',
    path:
      '/metal/boxes-and-enclosures/production/energy-efficiency/process-heating/hot-water-system/recover-heat-from-hot-waste-water',
    title: 'Recover heat from hot waste water',
    default_metric: QUESTION_RANGE_TYPE,
    indent: 4,
    environmental_value: 1,
    business_value: 2,
    profitability: 1,
    implementation_ease: 1,
    avg_value: 1,
  },
  {
    id: '20',
    path:
      '/metal/boxes-and-enclosures/production/energy-efficiency/process-heating/hot-water-system/fuel-and-energy-related-activities',
    title: 'Fuel-and-energy-related activities',
    default_metric: QUESTION_RELEVANT_QUANTITY,
    indent: 4,
    environmental_value: 2,
    business_value: 1,
    profitability: 1,
    implementation_ease: 1,
    avg_value: 1,
  },
  {
    id: '21',
    path: null,
    title: 'Targets',
    picture: 'https://envconnect.s3.amazonaws.com/media/distribution.png',
    indent: 1,
  },
  {
    id: '22',
    path: null,
    title: 'Energy Improvement Target in Place',
    indent: 2,
  },
  {
    id: '23',
    path:
      '/metal/boxes-and-enclosures/targets/energy-improvement-target/energy-target',
    title: 'Energy Reduction Target',
    default_metric: QUESTION_RANGE_TYPE,
    indent: 3,
    environmental_value: 1,
    business_value: 1,
    profitability: 1,
    implementation_ease: 1,
    avg_value: 0,
  },
]
