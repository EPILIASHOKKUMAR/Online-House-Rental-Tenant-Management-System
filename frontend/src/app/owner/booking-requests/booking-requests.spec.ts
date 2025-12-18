import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRequests } from './booking-requests';

describe('BookingRequests', () => {
  let component: BookingRequests;
  let fixture: ComponentFixture<BookingRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
