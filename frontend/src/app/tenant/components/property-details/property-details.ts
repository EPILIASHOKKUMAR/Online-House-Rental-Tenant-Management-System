import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  city: string;
  state: string;
  pincode: string;
  rent: number;
  security_deposit: number;
  property_type: string;
  bhk: string;
  furnishing: string;
  area: number;
  floor_number: number;
  amenities: string[];
  photos: string[];
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  status: string;
  isBooked: boolean;
  bookedBy: string | null;
  latitude: number | null;
  longitude: number | null;
}

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, MatIconModule],
  templateUrl: './property-details.html',
  styleUrls: ['./property-details.css']
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {

  private apiUrl = 'https://online-house-rental-tenant-management.onrender.com/api/properties';
  private map: L.Map | null = null;

  property: Property | null = null;
  isLoading = true;
  selectedImage = 0;
  isSidebarCollapsed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(Number(id));
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  loadProperty(id: number): void {
    this.http.get<Property>(`${this.apiUrl}/${id}`).subscribe({
      next: (property) => {
        this.property = {
          ...property,
          amenities: typeof property.amenities === 'string' ? JSON.parse(property.amenities) : property.amenities || [],
          photos: typeof property.photos === 'string' ? JSON.parse(property.photos) : property.photos || []
        };
        this.isLoading = false;
        
        if (this.property.latitude && this.property.longitude) {
          setTimeout(() => this.initLeafletMap(), 200);
        }
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.isLoading = false;
      }
    });
  }

  initLeafletMap(): void {
    if (!this.property || !this.property.latitude || !this.property.longitude) return;

    const mapElement = document.getElementById('propertyMap');
    if (!mapElement) return;

    this.map = L.map('propertyMap').setView([this.property.latitude, this.property.longitude], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([this.property.latitude, this.property.longitude], { icon: redIcon })
      .addTo(this.map)
      .bindPopup(`<b>${this.property.title}</b><br>${this.property.location}<br><b style="color:#10b981">₹${this.property.rent}/month</b>`)
      .openPopup();
  }

  selectImage(index: number): void {
    this.selectedImage = index;
  }

  goBack(): void {
    this.router.navigate(['/tenant/properties']);
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
