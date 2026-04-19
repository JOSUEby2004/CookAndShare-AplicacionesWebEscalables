import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRecetaComponent } from './crear-receta-component';

describe('CrearRecetaComponent', () => {
  let component: CrearRecetaComponent;
  let fixture: ComponentFixture<CrearRecetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearRecetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearRecetaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
