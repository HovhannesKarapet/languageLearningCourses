import {Component, DoCheck, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {LevelsService} from '../../services/levels.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit, DoCheck {

  isCollapsed = [];
  navbar      = true;
  levels      : any;
  able_levels = [];

  constructor(
    private authService : AuthService,
    private levelService: LevelsService,
    private router      : Router
  ) {
    this.ableLevels();
  }

  ngOnInit() {
    this.getLevels();
  }

  ngDoCheck(): void {
    this.ableLevels();
  }

  getLevels() {
    this.levelService.getLevels().subscribe(res => {
      this.levels = res;
    })
  }

  setLesson(id) {
    this.router.navigate([`/home/lesson/${id}`])
  }

  setTest(id) {
    this.router.navigate([`/home/test/${id}`])
  }

  ableLevels() {
    this.able_levels = [];
    for(let i = 0; i < JSON.parse(localStorage.getItem('user')).level; i++) {
      this.able_levels.push(true);
    }
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/'])
  }

}
