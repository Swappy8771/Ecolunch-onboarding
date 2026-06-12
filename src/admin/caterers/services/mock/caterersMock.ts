export type Status   = 'pre-onboarding' | 'en-cours' | 'soumis' | 'corrections' | 'approuves' | 'go-live'
export type Vertical = 'Schools' | 'Daycares' | 'Camps' | 'CSS'

export interface Caterer {
  id: string
  name: string
  city: string
  status: Status
  verticals: Vertical[]
  progress: number
  admin: string
  updatedAt: string
  validations: number
  tickets: number
}

export const CATERERS: Caterer[] = [
  { id:'1', name:'Concept Gourmet', city:'Montréal, QC',   status:'en-cours',       verticals:['Schools','Daycares','CSS','Camps'], progress:62,  admin:'Elise Bouchard',  updatedAt:'2026-06-05', validations:3, tickets:2 },
  { id:'2', name:'FL',              city:'Lévis, QC',      status:'corrections',    verticals:['Schools'],                          progress:38,  admin:'Hugo Bernier',    updatedAt:'2026-06-04', validations:4, tickets:3 },
  { id:'3', name:'MSN',             city:'Saguenay, QC',   status:'pre-onboarding', verticals:['Schools','Camps'],                  progress:12,  admin:'Sandrine Lavoie', updatedAt:'2026-06-03', validations:0, tickets:0 },
  { id:'4', name:'ABC Catering',    city:'Québec, QC',     status:'soumis',         verticals:['Daycares','CSS'],                   progress:80,  admin:'Elise Bouchard',  updatedAt:'2026-06-06', validations:1, tickets:1 },
  { id:'5', name:'Brasserie Nord',  city:'Laval, QC',      status:'approuves',      verticals:['Schools','Daycares'],               progress:95,  admin:'Hugo Bernier',    updatedAt:'2026-06-05', validations:0, tickets:0 },
  { id:'6', name:'Café Réseau',     city:'Sherbrooke, QC', status:'en-cours',       verticals:['Schools','CSS'],                    progress:55,  admin:'Sandrine Lavoie', updatedAt:'2026-06-04', validations:2, tickets:1 },
  { id:'7', name:'Les Saveurs',     city:'Gatineau, QC',   status:'corrections',    verticals:['Camps','Daycares'],                 progress:44,  admin:'Elise Bouchard',  updatedAt:'2026-06-02', validations:5, tickets:2 },
  { id:'8', name:'NutriServ',       city:'Longueuil, QC',  status:'go-live',        verticals:['Schools','Daycares','Camps','CSS'],  progress:100, admin:'Hugo Bernier',    updatedAt:'2026-06-06', validations:0, tickets:0 },
]
