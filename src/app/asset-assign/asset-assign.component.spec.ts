import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAssignComponent } from './asset-assign.component';

describe('AssetAssignComponent', () => {
  let component: AssetAssignComponent;
  let fixture: ComponentFixture<AssetAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
