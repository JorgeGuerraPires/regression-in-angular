import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleregressionComponent } from './simpleregression.component';

describe('SimpleregressionComponent', () => {
  let component: SimpleregressionComponent;
  let fixture: ComponentFixture<SimpleregressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleregressionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleregressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
