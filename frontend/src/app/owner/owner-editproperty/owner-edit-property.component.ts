import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-owner-edit-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './owner-edit-property.component.html',
  styleUrls: ['./owner-edit-property.component.css']
})
export class OwnerEditPropertyComponent implements OnInit {

  private apiUrl = 'http://localhost:3000/api/properties';
  propertyId = 0;
  isLoading = true;
  propertyForm!: FormGroup;

  amenitiesList = [
    { key: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
    { key: 'parking', label: 'Parking', icon: 'local_parking' },
    { key: 'ac', label: 'Air Conditioning', icon: 'ac_unit' },
    { key: 'furnished', label: 'Furnished', icon: 'weekend' },
    { key: 'gym', label: 'Gym', icon: 'fitness_center' },
    { key: 'pool', label: 'Swimming Pool', icon: 'pool' },
    { key: 'security', label: '24/7 Security', icon: 'security' },
    { key: 'elevator', label: 'Elevator', icon: 'swap_vert' },
    { key: 'garden', label: 'Garden', icon: 'park' },
    { key: 'balcony', label: 'Balcony', icon: 'balcony' },
    { key: 'power', label: 'Power Backup', icon: 'bolt' },
    { key: 'water', label: '24/7 Water Supply', icon: 'water_drop' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.propertyId) {
      this.loadProperty();
    } else {
      this.isLoading = false;
    }
  }

  initForm(): void {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      bhk: ['', Validators.required],
      rent: ['', Validators.required],
      location: ['', Validators.required],
      city: [''],
      state: [''],
      status: ['available', Validators.required],
      description: [''],
      amenities: this.fb.group({
        wifi: false,
        parking: false,
        ac: false,
        furnished: false,
        gym: false,
        pool: false,
        security: false,
        elevator: false,
        garden: false,
        balcony: false,
        power: false,
        water: false
      })
    });
  }

  loadProperty(): void {
    this.http.get<any>(`${this.apiUrl}/${this.propertyId}`).subscribe({
      next: (property) => {
        const amenities = typeof property.amenities === 'string' 
          ? JSON.parse(property.amenities) 
          : property.amenities || [];
        
        this.propertyForm.patchValue({
          title: property.title,
          type: property.property_type,
          bhk: property.bhk,
          rent: property.rent,
          location: property.location,
          city: property.city,
          state: property.state,
          status: property.status,
          description: property.description
        });

        const amenitiesGroup = this.propertyForm.get('amenities') as FormGroup;
        amenities.forEach((a: string) => {
          const key = a.toLowerCase().replace(/[^a-z]/g, '');
          if (amenitiesGroup.get(key)) {
            amenitiesGroup.get(key)?.setValue(true);
          }
        });

        const photos = typeof property.photos === 'string' 
          ? JSON.parse(property.photos) 
          : property.photos || [];
        this.images = photos;
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.isLoading = false;
        alert('Failed to load property');
        this.router.navigate(['/owner/properties']);
      }
    });
  }
images: string[] = [];

onImagesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.images.push(reader.result as string);
    };
    reader.readAsDataURL(file);
  });

  input.value = '';
}

removeImage(index: number): void {
  this.images.splice(index, 1);
}
isSidebarCollapsed = false;

toggleSidebar(): void {
  this.isSidebarCollapsed = !this.isSidebarCollapsed;
}


  get selectedAmenitiesCount(): number {
    return Object.values(
      this.propertyForm.get('amenities')?.value || {}
    ).filter(Boolean).length;
  }

  updateProperty(): void {
    if (this.propertyForm.valid) {
      const formData = this.propertyForm.value;
      const selectedAmenities = Object.entries(formData.amenities)
        .filter(([_, selected]) => selected)
        .map(([key, _]) => {
          const amenity = this.amenitiesList.find(a => a.key === key);
          return amenity ? amenity.label : key;
        });

      const propertyData = {
        title: formData.title,
        description: formData.description,
        rent: Number(formData.rent),
        location: formData.location,
        city: formData.city,
        state: formData.state,
        property_type: formData.type,
        bhk: formData.bhk,
        status: formData.status,
        amenities: selectedAmenities,
        photos: this.images
      };

      this.http.put(`${this.apiUrl}/${this.propertyId}`, propertyData).subscribe({
        next: () => {
          alert('Property updated successfully!');
          this.router.navigate(['/owner/properties']);
        },
        error: (error) => {
          alert('Failed to update property');
          console.error(error);
        }
      });
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/owner/properties']);
  }
}
