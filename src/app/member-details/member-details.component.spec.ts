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
import { Member } from '../data/member';
import { By } from '@angular/platform-browser';
import { componentFactoryName } from '@angular/compiler';

// import teamsData = require('../src/data/teams.json');
// import membersData = require('../src/data/members.json');

const dummyTeams = [
  {
    "id": 1,
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
const dummymember = {
  id: 1,
  firstName: "Saurabh",
  lastName: "test",
  jobTitle: "dev",
  team: "Formula 1 - Car 8",
  status: "Active"
};

// Bonus points!
describe('MemberDetailsComponent', () => {
  let component: MemberDetailsComponent;
  let fixture: ComponentFixture<MemberDetailsComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  // let appService: AppService;
  // let router: Router;
  let route: ActivatedRoute;
  // let routerSpy ;
  // const routerActivatedSpy = {snapshot: jasmine.createSpy('snapshot')};
  const appServiceSpy = jasmine.createSpyObj('AppService', ['getMembers', 'addMember', 'getTeams', 'getMembersByID', 'updateMember', 'deleteMember'])
  // let activatedRouteSpy;

  const formBuilderSpy: FormBuilder = new FormBuilder();
  let teams: any = [];
  let appservice: AppService;


  beforeEach(async(() => {

    let routerSpy = { navigate: jasmine.createSpy('navigate') };
    let activatedRouteSpy = { snapshot: { params: { 'id': 1 } } };

    // setup 
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
          useValue: activatedRouteSpy,
        },
        { provide: Router, useValue: routerSpy },
        { provide: AppService, useValue: appServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // instantiate


    appServiceSpy.username = 'saurabh';

    appServiceSpy.getTeams.and.returnValue(of(dummyTeams));
    appServiceSpy.getMembersByID.and.returnValue(of(dummymember));

    // setup
    fixture = TestBed.createComponent(MemberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appservice = TestBed.get(AppService);

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

  it('form is invalid when empty', () => {
    expect(component.memberForm.valid).toBeFalsy();
  })

  it('form is invalid when only first name is given', () => {
    component.memberForm.controls['firstName'].setValue('Saurabh');
    expect(component.memberForm.valid).toBeFalsy();
  })

  it('form is valid when all fields are present', () => {
    component.memberForm.controls['firstName'].setValue('a');
    component.memberForm.controls['lastName'].setValue('a');
    component.memberForm.controls['jobTitle'].setValue('a');
    component.memberForm.controls['team'].setValue('a');
    component.memberForm.controls['status'].setValue('Active');
    expect(component.memberForm.valid).toBeTruthy();
  })

  it('form is created with all the controls', () => {
    const firstNameContainer = fixture.debugElement.query(By.css('#firstName')).nativeElement;
    const lastNameContainer = fixture.debugElement.query(By.css('#lastName')).nativeElement;
    const jobTitleContainer = fixture.debugElement.query(By.css('#jobTitle')).nativeElement;
    const teamContainer = fixture.debugElement.query(By.css('#team')).nativeElement;
    const statusContainer = fixture.debugElement.query(By.css('#activeStatus')).nativeElement;
    const submitBtnContainer = fixture.debugElement.query(By.css('.memberbutton')).nativeElement;
    expect(firstNameContainer).toBeDefined();
    expect(lastNameContainer).toBeDefined();
    expect(jobTitleContainer).toBeDefined();
    expect(teamContainer).toBeDefined();
    expect(statusContainer).toBeDefined();
    expect(submitBtnContainer).toBeDefined();
  })

  it('should return teams data', () => {
    appServiceSpy.getTeams().subscribe(res => {
      component.teams = res;
    })
    expect(component.teams).toEqual(dummyTeams);
  })

  // it('returning null teamdata', () => {
  //   appServiceSpy.getTeams.and.returnValue( of(null) ) ;
  //   component.teams = [];
  //   appServiceSpy.getTeams().subscribe( res => {
  //     component.teams = res;
  //   })
  //   expect(component.teams.length).toBe(0);
  // })

  it('should return member data', () => {
    let member: Member;

    appServiceSpy.getMembersByID('1').subscribe(res => {
      member = res;
    })
    expect(member.firstName).toEqual('Saurabh');
  })


});
