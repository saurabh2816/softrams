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

// import teamsData = require('../src/data/teams.json');
// import membersData = require('../src/data/members.json');


// Bonus points!
describe('MemberDetailsComponent', () => {
  let component: MemberDetailsComponent;
  let fixture: ComponentFixture<MemberDetailsComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  let appService: AppService;
  // let router: Router;
  let route: ActivatedRoute;
  const routerSpy = {navigate: jasmine.createSpy('navigate')};
  const routerActivatedSpy = {snapshot: jasmine.createSpy('snapshot')};

  let member={
    id:20,
    firstName: "trying",
    lastName: "test",
    jobTitle: "dev",
    team: "Formula 1 - Car 8",
    status: "Active"
};

  beforeEach(async(() => {

    // setup 
    // const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate', 'snapshot']);
    // const routerActivateSpy = jasmine.createSpyObj('route', ['snapshot']);
    
    TestBed.configureTestingModule({
      declarations: [MemberDetailsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot([]),
        // RouterTestingModule
      ],
      providers: [
        HttpClient,
        FormBuilder,
        {
          provide: ActivatedRoute,
          // ***** CHECK HERE *****
          useValue: {
            snapshot: {
              params: {
                'id': 1
              }
            }
          },
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useVale: routerActivatedSpy},
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // instantiate
    appService = TestBed.get(AppService);
    // router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

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

    // spyOn(router, 'navigate');

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* 
    1. user not logged in navigatee to /login 
    2. user logged in - should get teams
    3. onSubmit: invalid form - do not set the memberMode
    4. onSubmit: valid form - call addMember Method
    5. onSubmit: valid form - call updateMember Method
  */



 it('**no user logged in - should navigate to login screen', () => {
    fixture.detectChanges();
    // no user logged in -> navigate to login screen
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should create form with 5 controls', () => {
    expect(component.memberForm.contains('firstName')).toBe(true);
    expect(component.memberForm.contains('lastName')).toBe(true);
    expect(component.memberForm.contains('jobTitle')).toBe(true);
    expect(component.memberForm.contains('team')).toBe(true);
    expect(component.memberForm.contains('status')).toBe(true);
  });

  // empty string should not be valid 
  it('should make firstName control required', () => {
    let firstName = component.memberForm.get('firstName');
    firstName.setValue('');
    expect(firstName.valid).toBeFalsy();
  });

  it('should make lastName control required', () => {
    let control=component.memberForm.get('lastName');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });
  it('should make jobTitle control required', () => {
    let control=component.memberForm.get('jobTitle');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });
  it('should make team control required', () => {
    let control=component.memberForm.get('team');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });
  it('should make status control required', () => {
    let control=component.memberForm.get('status');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });

  // it('should create a new member', () => {
  //   component.memberForm.setValue(member);
  //   expect(component.memberForm.valid).toBeTruthy();
  // })

 
 it('**user logged in - should get teams - set action to Edit', () => {
  appService.username = 'user1'; // user logged in
  const dummyTeams  = [
    {
      id: 1,
      "teamName": "Formula 1 - Car 77"
    },
    {
      "id": 2,
      "teamName": "Formula 1 - Car 8"
    },
    {
      "id": 3,
      "teamName": "Formula 2 - Car 54"
    },
    {
      "id": 4,
      "teamName": "Formula 2 - Car 63"
    },
    {
      "id": 5,
      "teamName": "Deutsche Tourenwagen Masters - Car 117"
    },
    {
      "id": 6,
      "teamName": "Deutsche Tourenwagen Masters - Car 118"
    },
    {
      "id": 7,
      "teamName": "World Endurance Championship - Car 99"
    },
    {
      "id": 8,
      "teamName": "World Endurance Championship - Car 5"
    },
    {
      "id": 9,
      "teamName": "World Rally Championship - Car 77"
    },
    {
      "id": 10,
      "teamName": "World Rally Championship - Car 90"
    }
  ];

  const dummyMember = {
    firstName: 'name1',
    lastName: 'lastName1',
    jobTitle: 'jobTitle1',
    team: 'team1',
    status: 'status1'
  };

  spyOn(appService, 'getTeams').and.callFake(() => {
    return of(dummyTeams);
  });

  spyOn(appService, 'getMembers').and.callFake(() => {
    return of(dummyMember);
  });

  fixture.detectChanges();
  // expect(appService.getTeams).toHaveBeenCalled();
  // expect(component.teams).toEqual(dummyTeams);
  // expect(component.action).toEqual('Edit');
  expect(appService.getMembers).toHaveBeenCalled();

  // expect(appService.getMember).toHaveBeenCalled();
//   });

  });


});
