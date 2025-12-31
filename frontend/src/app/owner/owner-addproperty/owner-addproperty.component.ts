import { Component, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-owner-addproperty',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    MatIconModule
  ],
  templateUrl: './owner-addproperty.component.html',
  styleUrls: ['./owner-addproperty.component.css']
})
export class OwnerAddPropertyComponent implements AfterViewInit, OnDestroy {

  private apiUrl = 'http://localhost:3000/api/properties';
  
  isSidebarCollapsed = false;
  isSubmitting = false;
  errorMessage = '';
  propertyForm: FormGroup;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  latitude: number | null = null;
  longitude: number | null = null;
  locationEnabled = false;
  locationLoading = false;
  locationError = '';
  locationAccuracy: number | null = null;

  storedImages: File[] = [];
  imagePreviews: string[] = [];
  selectedAmenities: string[] = [];
  selectedImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      propertyType: ['', Validators.required],
      bhk: ['', Validators.required],
      furnishing: ['', Validators.required],
      rent: ['', Validators.required],
      deposit: [''],
      area: [''],
      floor: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pin: [''],
      description: [''],
      contactName: [''],
      contactPhone: [''],
      contactEmail: ['']
    });
  }


  ngAfterViewInit(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  initLeafletMap(lat: number, lng: number): void {
    setTimeout(() => {
      const mapElement = document.getElementById('locationMap');
      if (!mapElement) return;

      if (this.map) {
        this.map.remove();
      }

      this.map = L.map('locationMap').setView([lat, lng], 17);

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

      this.marker = L.marker([lat, lng], { icon: redIcon, draggable: true }).addTo(this.map);
      this.marker.bindPopup('<b>Property Location</b><br>Drag to adjust').openPopup();

      this.marker.on('dragend', (e: any) => {
        this.ngZone.run(() => {
          const pos = e.target.getLatLng();
          this.latitude = pos.lat;
          this.longitude = pos.lng;
        });
      });

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.ngZone.run(() => {
          this.latitude = e.latlng.lat;
          this.longitude = e.latlng.lng;
          if (this.marker) {
            this.marker.setLatLng(e.latlng);
          }
        });
      });
    }, 300);
  }

  enableLocation(): void {
    this.locationLoading = true;
    this.locationError = '';

    if (!navigator.geolocation) {
      this.fallbackToIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.ngZone.run(() => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationAccuracy = position.coords.accuracy;
          this.locationEnabled = true;
          this.locationLoading = false;
          this.locationError = '';
          this.initLeafletMap(this.latitude, this.longitude);
        });
      },
      (error) => {
        console.log('GPS Error:', error.code, error.message);
        this.fallbackToIPLocation();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  fallbackToIPLocation(): void {
    this.http.get<any>('https://ipapi.co/json/').subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          if (data.latitude && data.longitude) {
            this.latitude = data.latitude;
            this.longitude = data.longitude;
            this.locationAccuracy = 5000; // IP location is ~5km accurate
            this.locationEnabled = true;
            this.locationLoading = false;
            this.locationError = '';
            this.initLeafletMap(data.latitude, data.longitude);
            alert('GPS unavailable. Using approximate location from IP. Drag the marker to set exact location.');
          } else {
            this.locationLoading = false;
            this.locationError = 'Could not get location. Please enter coordinates manually.';
          }
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.locationLoading = false;
          this.locationError = 'Location failed. Please enter coordinates manually below.';
        });
      }
    });
  }

  removeLocation(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.marker = null;
    this.latitude = null;
    this.longitude = null;
    this.locationEnabled = false;
    this.locationAccuracy = null;
  }

  refreshLocation(): void {
    this.locationLoading = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.ngZone.run(() => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationAccuracy = position.coords.accuracy;
          this.locationLoading = false;
          if (this.marker && this.map) {
            this.marker.setLatLng([this.latitude, this.longitude]);
            this.map.setView([this.latitude, this.longitude], 17);
          }
        });
      },
      () => {
        this.ngZone.run(() => {
          this.locationLoading = false;
          this.locationError = 'Failed to refresh';
        });
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );
  }

  setManualLocation(lat: string, lng: string): void {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      this.locationError = 'Enter valid coordinates';
      return;
    }
    this.latitude = latNum;
    this.longitude = lngNum;
    this.locationEnabled = true;
    this.locationError = '';
    this.initLeafletMap(latNum, lngNum);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }


  submit(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    const user = localStorage.getItem('currentUser');
    if (!user) {
      this.errorMessage = 'Please login first';
      return;
    }

    const userData = JSON.parse(user);
    const formData = this.propertyForm.value;

    const propertyData = {
      owner_id: userData.id,
      title: formData.title,
      description: formData.description || '',
      rent: Number(formData.rent),
      location: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pin,
      property_type: formData.propertyType,
      bhk: formData.bhk,
      furnishing: formData.furnishing,
      area: formData.area ? Number(formData.area) : null,
      floor_number: formData.floor ? Number(formData.floor) : null,
      amenities: this.selectedAmenities,
      photos: this.imagePreviews,
      contact_name: formData.contactName || userData.name,
      contact_phone: formData.contactPhone || userData.phone,
      contact_email: formData.contactEmail || userData.email,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.http.post(this.apiUrl, propertyData).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Property added successfully!');
        this.router.navigate(['/owner/properties']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.error || 'Failed to add property';
      }
    });
  }

  handleImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      this.storedImages.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  openImage(img: string): void {
    this.selectedImage = img;
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.storedImages.splice(index, 1);
  }

  toggleAmenity(amenity: string): void {
    const idx = this.selectedAmenities.indexOf(amenity);
    if (idx > -1) {
      this.selectedAmenities.splice(idx, 1);
    } else {
      this.selectedAmenities.push(amenity);
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities.includes(amenity);
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
