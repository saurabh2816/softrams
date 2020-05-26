import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';

// This interface may be useful in the times ahead...
interface Member {
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  id: any;
   

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router, private route: ActivatedRoute) {
    this.memberModel = {
      firstName: '', 
      lastName: '',  
      jobTitle: '',
      team: '',
      status: ''
    };  
  
  }

  ngOnInit() {

    if (!this.appService.username) {
      this.router.navigate(['/login']);
    }

    else {
  
      // fetch teams to populate dropdown
      this.appService.getTeams().subscribe(teams => {
        this.teams = teams;
        console.log("teams: ", this.teams);
      }
        );
      
      this.id = this.route.snapshot.params["id"];
  
      // check if page contains an ID
      // if ID!=0 => update; 
      // if ID==0, addMember()
  
      if( this.id != 0 ) { 
        // update
        // load the model to prepopulate the form and update
        this.appService.getMembersByID(this.id).subscribe( member => {
  
          this.memberModel = {
            firstName: member.firstName,
            lastName: member.lastName,
            jobTitle: member.jobTitle,
            team: member.team,
            status: member.status,
          }
  
        });
      }
      
    }

  }

  ngOnChanges() {}

  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    this.memberModel = form.value;

    if( this.id != 0) {
      console.log("updating");
      console.log("member model" , this.memberModel);
      this.memberModel['id'] = this.id;
      
      this.appService.updateMember(this.memberModel).subscribe(result => {
        this.router.navigate(['/members']);
      });
    }
    else {
      console.log("adding a member");
      this.appService.addMember(this.memberModel).subscribe(response => {
        console.log('navigating to members');
        this.router.navigate(["members"]);
      });
    }

  }


}
