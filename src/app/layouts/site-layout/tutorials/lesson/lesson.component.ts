import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LevelsService} from '../../../../services/levels.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit {

  lesson    : any;

  constructor(
    private route         : ActivatedRoute,
    private levelService  : LevelsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getLesson(params.id);
    });
  }

  getLesson(id) {
    this.levelService.getLesson(id).subscribe( res => {
      this.lesson = res;
    });
  }

}
