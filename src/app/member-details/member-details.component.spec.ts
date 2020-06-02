import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDetailsComponent } from './member-details.component';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { of } from 'rxjs';
import dummyMember from '../data/dummyMember.json';
import dummyTeams from "../data/dummyTeams.json";
import { By } from '@angular/platform-browser';
import { Member } from '../data/members.js';

// Bonus points!
describe('MemberDetailsComponent', () => {
  let component: MemberDetailsComponent;
  let fixture: ComponentFixture<MemberDetailsComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  let route: ActivatedRoute;
  const appServiceSpy = jasmine.createSpyObj('AppService', ['getMembers', 'addMember', 'getTeams', 'getMembersByID', 'updateMember', 'deleteMember'])
  let routerSpy;
  let activatedRouteSpy;
  const formBuilderSpy: FormBuilder = new FormBuilder();
  let teams: any = [];

  beforeEach(async(() => {

    routerSpy = { navigate: jasmine.createSpy('navigate') };
    activatedRouteSpy = { snapshot: { params: { 'id': 1 } } };

    // setup 
    TestBed.configureTestingModule({
      declarations: [MemberDetailsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        HttpClient,
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
        { provide: Router, useValue: routerSpy },
        { provide: AppService, useValue: appServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {

    // instantiate
    // appServiceSpy.username = "saurabh";
    appServiceSpy.getTeams.and.returnValue(of(dummyTeams));
    appServiceSpy.getMembersByID.and.returnValue(of(dummyMember));

    // setup
    fixture = TestBed.createComponent(MemberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.memberForm = formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      jobTitle: new FormControl('', Validators.required),
      team: new FormControl(null, Validators.required),
      status: new FormControl('', Validators.required)
    });

    component.teams = [];
    component.submitted = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if not logged in', () => {
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  })

  it('form is invalid when empty', () => {
    expect(component.memberForm.valid).toBeFalsy();
  })

  it('form is invalid when only first name is given', () => {
    component.memberForm.controls['firstName'].setValue('Saurabh');
    expect(component.memberForm.valid).toBeFalsy();
  })

  it('form is valid when all fields are present', () => {
    component.memberForm.controls['firstName'].setValue('Softrams');
    component.memberForm.controls['lastName'].setValue('Racing');
    component.memberForm.controls['jobTitle'].setValue('developer');
    component.memberForm.controls['team'].setValue('software');
    component.memberForm.controls['status'].setValue('Active');
    expect(component.memberForm.valid).toBeTruthy();
  })

  it('form is created with all the controls', () => {
    const firstName = fixture.debugElement.query(By.css('#firstName')).nativeElement;
    const lastName = fixture.debugElement.query(By.css('#lastName')).nativeElement;
    const jobTitle = fixture.debugElement.query(By.css('#jobTitle')).nativeElement;
    const team = fixture.debugElement.query(By.css('#team')).nativeElement;
    const status = fixture.debugElement.query(By.css('#activeStatus')).nativeElement;
    const submitBtn = fixture.debugElement.query(By.css('.memberbutton')).nativeElement;
    expect(firstName).toBeDefined();
    expect(lastName).toBeDefined();
    expect(jobTitle).toBeDefined();
    expect(team).toBeDefined();
    expect(status).toBeDefined();
    expect(submitBtn).toBeDefined();
  })

  it('should return teams data', () => {
    appServiceSpy.getTeams().subscribe(res => {
      component.teams = res;
    })
    expect(component.teams).toEqual(dummyTeams);
  })

  it('should return member data', () => {
    let member: Member;

    appServiceSpy.getMembersByID('1').subscribe(res => {
      member = res;
    })
    expect(member.firstName).toEqual('Saurabh');
  })
 

});
 