import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LevelsService} from '../../../../services/levels.service';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  header          : null;
  questions       : any;
  question        : any;
  selected_answer : number;
  page            = 0;
  questions_count = 0;
  right_count     = 0;
  wrong_count     = 0;
  test_time       : number;
  question_time   = 15;
  stop_timer      = false;
  show_result     = false;
  show_test       = false;
  result_text     = 'failed';

  constructor(
    private route       : ActivatedRoute,
    private levelService: LevelsService,
    private authService : AuthService
  ) { }

  ngOnInit() {}

  startTest(){
    this.show_test = true;
    this.route.params.subscribe(params => {
      this.getTest(params.id);
    });
  }

  getTest(id) {
    this.levelService.getTest(id).subscribe( res => {
      this.header = Object(res).header;
      this.questions = Object(res).questions;
      this.questions_count = this.questions.length;
      this.test_time = this.questions.length*15;
      this.question = this.questions[this.page];
      this.questionTimer();
      this.testTimer();
    });
  }

  nextPage():void {
    if(this.questions[this.page + 1]) {
      this.page++;
      this.pageChanged();
    }
  }

  previousPage():void {
    if(this.questions[this.page - 1]) {
      this.page--;
      this.pageChanged();
    }
  }

  pageChanged(): void {
    this.question = this.questions[this.page];
    this.selected_answer = null;
    this.question_time = 15;
  }

  counter(): void {
    if(this.question.answers[this.selected_answer]) {
      this.question.answers[this.selected_answer].is_right ? this.right_count++ : this.wrong_count++;
    } else {
      this.wrong_count++;
    }
    if(this.wrong_count >= this.questions.length*2/5) {
      this.stop_timer = true;
      return;
    }
    if(this.right_count >= this.questions.length*3/5) {
      this.result_text = 'success';
    }
  }

  confirm():void {
    if(!this.selected_answer) {
      return console.log('choose an answer');
    }
    this.autoConfirm();
  }

  autoConfirm():void {
    this.counter();
    if(this.questions[this.page + 1]) {
      this.questions.splice(this.page--, 1);
      this.nextPage();
    } else if (this.questions[this.page - 1]) {
      this.questions.splice(this.page, 1);
      this.previousPage();
    } else {
      this.stop_timer = true;
    }
  }

  newLevelAccess() {
    if(this.right_count >= this.questions.length*3/5) {
      let user = JSON.parse(localStorage.getItem('user'));
      user.level++;
      localStorage.setItem('user', JSON.stringify(user));
      this.authService.updateUser(user.id, user).subscribe();
    }
  }

  testTimer() {
    let timer = setInterval(() => {
      this.test_time--;
      if(!this.test_time || this.stop_timer) {
        clearInterval(timer);
        this.show_result = true;
        this.newLevelAccess();
      }
    }, 1000);
  }

  questionTimer() {
    let timer = setInterval(() => {
      this.question_time--;
      if(this.stop_timer) {
        clearInterval(timer);
        this.show_result = true;
      }
      if(!this.question_time) {
        clearInterval(timer);
        this.autoConfirm();
        this.question_time = 15;
        this.questionTimer();
      }
    }, 1000);
  }

}
