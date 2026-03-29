import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Jewellery } from '../../shared/models/jewellery';
import { tag } from '../../shared/models/tag';

@Injectable({
  providedIn: 'root',
})
export class JewelleryService {

  // ✅ Dummy data (backend replace)
  private jewelleryList: Jewellery[] = [{
    
         id: '1',
        name: 'Diamond Ring',
        price: 5000,
        tags: ['ring', 'diamond', 'luxury'],
        favorite: true,
        stars: 4.5,
        imageUrl: '/assets/diamond-ring.webp',
        origins: ['Italy', 'India'],
    },
    {
        id: '2',
        name: 'Gold Necklace',      
        price: 3000,
        tags: ['necklace', 'gold', 'elegant'],
        favorite: false,
        stars: 4.0,
        imageUrl: '/assets/gold-necklace.jpeg',
        origins: ['Egypt', 'Turkey'],
    },
    {
        id: '3',
        name: 'Silver Bracelet',
        price: 1500,
        tags: ['bracelet', 'silver', 'stylish'],
        favorite: true,
        stars: 4.2,
        imageUrl: '/assets/silver-bracelet.jpeg',
        origins: ['Mexico', 'Spain'],
    },
    {
        id: '4',
        name: 'Pearl Earrings',
        price: 2000,
        tags: ['earrings', 'pearl', 'classic'],
        favorite: false,
        stars: 4.8,
        imageUrl: '/assets/pearl-earrings.webp',
        origins: ['Japan', 'Australia'],
    },
    {
        id: '5',
        name: 'Sapphire Pendant',
        price: 4000,
        tags: ['pendant', 'sapphire', 'elegant'],
        favorite: true,
        stars: 4.6,
        imageUrl: '/assets/sapphire-pendant.webp',
        origins: ['Sri Lanka', 'Thailand'],

    },
    {
        id: '6',
        name: 'Emerald Brooch',
        price: 3500,
        tags: ['brooch', 'emerald', 'vintage'],
        favorite: false,
        stars: 4.3,
        imageUrl: '/assets/emerald-brooch.webp',
        origins: ['Colombia', 'Zambia'],
    },
    {
        id: '7',
        name: 'Ruby Anklet',
        price: 2500,    
        tags: ['anklet', 'ruby', 'trendy'],
        favorite: true,
        stars: 4.1,
        imageUrl: '/assets/ruby-anklet.webp',
        origins: ['Myanmar', 'Madagascar'],
    },
    {
        id: '8',
        name: 'Amethyst Cufflinks',
        price: 1800,
        tags: ['cufflinks', 'amethyst', 'sophisticated'],
        favorite: false,
        stars: 4.4,
        imageUrl: '/assets/amethyst-cufflinks.webp',
        origins: ['Brazil', 'Uruguay'],
    },
    {
        id: '9',
        name:'bridal payal',
        price: 2200,
        tags: ['payal', 'bridal', 'traditional'],
        favorite: true,
        stars: 4.7,
        origins: ['India'],
        imageUrl: '/assets/bridal-payal.webp',
    },
    {
        id: '10',
        name: 'golden glint',
        price: 2500,
        tags: ['earrings', 'gold', 'elegant'],
        favorite: true,
        stars: 4.6,
        imageUrl: '/assets/golden-glint.webp',
        origins: ['India'],
    },
    {
        id: '11',
        name:'kandora',
        price: 3000,
        tags: ['kandora', 'traditional', 'elegant'],    
        favorite: false,
        stars: 4.2,
        imageUrl: '/assets/kandora.webp',
        origins: ['UAE'],
    },
    {
        id: '12',
        name:'silver shimmer',
        price: 2000,
        tags: ['bracelet', 'silver', 'stylish'],
        favorite: true,
        stars: 4.3,
        imageUrl: '/assets/silver-bracelet.jpg',
        origins: ['Mexico', 'Spain'],
    }
  ];

  private nextId = 13;  // Numeric counter for IDs

  constructor() {}

  // CRUD Methods (mock)
  createJewellery(data: Omit<Jewellery, 'id'>): Observable<Jewellery> {
    const newItem: Jewellery = {
      id: (this.nextId++).toString(),
      ...data
    };
    this.jewelleryList.push(newItem);
    return of(newItem);
  }

  updateJewellery(id: string, data: Partial<Jewellery>): Observable<Jewellery> {
    const index = this.jewelleryList.findIndex(j => j.id === id);
    if (index === -1) throw new Error('Jewellery not found');
    this.jewelleryList[index] = { ...this.jewelleryList[index], ...data };
    return of(this.jewelleryList[index]);
  }

  deleteJewellery(id: string): Observable<void> {
    const index = this.jewelleryList.findIndex(j => j.id === id);
    if (index > -1) {
      this.jewelleryList.splice(index, 1);
    }
    return of(void 0);
  }

  // SAME Observable structure ✅
  getAll(): Observable<Jewellery[]> {
    return of([...this.jewelleryList]);  // Return copy to prevent mutation
  }

  getAllBySearchTerm(searchTerm: string): Observable<Jewellery[]> {
    const result = this.jewelleryList.filter(j =>
      j.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(result);
  }

  getAllTags(): Observable<tag[]> {
    const tags: tag[] = [
    {name:'ring',count:1},
    {name:'necklace',count:1},
    {name:'bracelet',count:2},
    {name:'pendant',count:1},
    {name:'brooch',count:1},
    {name:'cufflinks',count:1},
    ];
    return of(tags);
  }

  getJewelleryByTag(tagName: string): Observable<Jewellery[]> {
    if (tagName === 'All') return of(this.jewelleryList);

    const result = this.jewelleryList.filter(j =>
      j.tags?.includes(tagName)
    );
    return of(result);
  }

  getJewelleryById(jewelleryId: string): Observable<Jewellery> {
    const item = this.jewelleryList.find(j => j.id === jewelleryId)!;
    return of(item);
  }
}