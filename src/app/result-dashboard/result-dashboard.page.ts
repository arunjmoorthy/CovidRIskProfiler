import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { SendMailService } from '../service/send-mail.service';
import { Location } from '@angular/common';
import { SelectLangService } from '../service/select-lang.service';
import { TranslateService } from '@ngx-translate/core';
import { ResultQuetion } from './result.config';




@Component({
  selector: 'app-result-dashboard',
  templateUrl: './result-dashboard.page.html',
  styleUrls: ['./result-dashboard.page.scss'],
})
export class ResultDashboardPage implements OnInit {
  resultValue: any;
  typeOfRecommendation: string;
  subjectRecomendation: string;
  userName = '';
  emailId = '';
  userComment = '';
  maxDate: string = new Date().toISOString();
  dateOfBirth = '';
  covideDOB = '';
  loadingMask: any;
  covid19Test: any;
  isCovidDateDisplay = false;
  feelingToday = '';

  feelingPositive = "";
  feelingNegative = "";

  // tslint:disable-next-line: max-line-length
  regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  queOneList;
  queTwoList;
  queThreeList;
  queFourList;
  userResponseHTML1 = [
    this.queOneList = '',
    this.queTwoList = '',
    this.queThreeList = '',
    this.queFourList = ''
  ];

  newUserResponse = '';
  htmlResponseSendToUser = '';
  normal: any;
  monitor: any;
  isolate: any;
  Emergency: any;

  feelingValue = {
    "0": "Not at all",
    "1": "Several days",
    "2": "More than half days",
    "3": "Nearly every day",
  }

  // tslint:disable-next-line: max-line-length
  constructor(public alertController: AlertController, public loadingController: LoadingController, public activatedRoute: ActivatedRoute, private location: Location, public router: Router, public toastController: ToastController, private sendMailService: SendMailService, private translate: TranslateService, public selectLangService: SelectLangService) {
    this.maxDate = this.formatDate(new Date());
  }

  ngOnInit() {
    if (!localStorage.getItem('language')) {
      this.selectLangService.setLang('en');
    }
    this.normal = ResultQuetion[0]['en'][0].normal;
    this.monitor = ResultQuetion[0]['en'][0].monitor;
    this.isolate = ResultQuetion[0]['en'][0].isolate;
    this.Emergency = ResultQuetion[0]['en'][0].Emergency;

    if (document.URL.startsWith('http')) {
      if (localStorage.getItem('email') != null) {
        this.emailId = localStorage.getItem('email');
      }
    }
    const result = JSON.parse(localStorage.getItem('YourResponse'));
    if (!result) {
      let alertMsg2 = '';
      this.translate.get('Result.failedResponse').subscribe(value => {
        alertMsg2 = value;
      });
      this.presentAlert(alertMsg2);
      return;
    }
    this.resultValue = result.param;
    result.QuestionAnswer.forEach((QuestionAnswer, i) => {
      QuestionAnswer.AnswerOptions.forEach((AnswerOptions, j) => {
        result.originalEnglishQuetionAnswer[i].AnswerOptions[j].isChecked = AnswerOptions.isChecked
        console.log(result.originalEnglishQuetionAnswer[i].AnswerOptions[j].isChecked, i, j)
      });
    });
    result.QuestionAnswer = result.originalEnglishQuetionAnswer;
    this.typeOfRecommendation = result.Recommendation;
    this.subjectRecomendation = result.Recommendation;
    if (this.typeOfRecommendation === 'Normal') {
      this.typeOfRecommendation = this.normal;
    } else if (this.typeOfRecommendation === 'Monitor patient') {
      this.typeOfRecommendation = this.monitor;
    } else if (this.typeOfRecommendation === 'Isolate patient') {
      this.typeOfRecommendation = this.isolate;
    } else if (this.typeOfRecommendation === 'Consider Emergency Room recommendation') {
      this.typeOfRecommendation = this.Emergency;
    }
    const startLi = "<li style='font-size: 14px; line-height: 1.2; mso-line-height-alt: 17px;color:black;'>";
    const endLi = '</li>';
    for (let i = 0; i < result.QuestionAnswer.length; i++) {
      this.newUserResponse = '';
      this.newUserResponse += '<br><span style="color:black;">Question ' + (i + 1) + ': ' + result.QuestionAnswer[i].Title + '</span><ol style="list-style-type: lower-alpha;">'
      for (let j = 0; j < result.QuestionAnswer[i].AnswerOptions.length; j++) {
        if (result.QuestionAnswer[i].AnswerOptions[j].isChecked) {
          this.newUserResponse += startLi + result.QuestionAnswer[i].AnswerOptions[j].DisplayValue + endLi;
          if (result.QuestionAnswer[i].AnswerOptions[j].DisplayShortDescription !== '') {
            this.newUserResponse += "<ul><li style='font-size: 14px;color:black; line-height: 1.2; mso-line-height-alt: 17px;'><i>"
              + result.QuestionAnswer[i].AnswerOptions[j].DisplayShortDescription + '</i></li></ul>';
          }
        }
      }
      this.htmlResponseSendToUser += this.newUserResponse + '</ol>';
      // console.log(this.htmlResponseSendToUser);
    }
  }

  async submitUserInfo() {
    if (this.userName.trim() === '') {
      let alertMsg = '';
      this.translate.get('Result.errorName').subscribe(value => {
        alertMsg = value;
      });
      this.presentToast(alertMsg);
    } else if (this.dateOfBirth === '') {
      let alertMsg = '';
      this.translate.get('Result.errorDOB').subscribe(value => {
        alertMsg = value;
      });
      this.presentToast(alertMsg);
    } else if (this.emailId.trim() === '' || !this.regex.test(this.emailId)) {
      let alertMsg = '';
      this.translate.get('Result.errorEmail').subscribe(value => {
        alertMsg = value;
      });
      this.presentToast(alertMsg);
    } else if (this.feelingPositive === '') {
      let alertMsg = '';
      this.translate.get('Result.PositiveQuestionError').subscribe(value => {
        alertMsg = value;
      });
      this.presentToast(alertMsg);
    } else if (this.feelingNegative === '') {
      let alertMsg = '';
      this.translate.get('Result.NegativeQuestionError').subscribe(value => {
        alertMsg = value;
      });
      this.presentToast(alertMsg);
    } else if (this.covideDOB === '' && this.isCovidDateDisplay) {
      let alertMsg = '';
      this.translate.get('Result.CovidTestDateError').subscribe(value => {
        alertMsg = value;
      });
      this.presentToast(alertMsg);
    } else {
      let alertMsg = '';
      this.translate.get('Result.pleasewait').subscribe(value => {
        alertMsg = value;
      });
      const loading = await this.loadingController.create({
        message: alertMsg
      });
      await loading.present();
      const req = {
        userResponseHTML: this.htmlResponseSendToUser,
        typeOfRecommendation: this.typeOfRecommendation,
        subjectRecomendation: this.subjectRecomendation,
        userName: this.userName,
        userEmailId: this.emailId,
        userDOB: this.dateOfBirth,
        userComment: this.userComment.trim() === '' ? '' : '<b>Comment: </b>' + this.userComment,
        covide19Test: ''
      };
      const feelingString = '<b><br>Over the last 2 weeks, how often have you been bothered by the following problems?</b><br>1. Little interest or pleasure in doing things: <b>' + this.feelingValue[this.feelingPositive] + "</b><br>2. Feeling down, depressed or hopeless: <b>" + this.feelingValue[this.feelingNegative] + '</b>';
      if (this.isCovidDateDisplay) {
        req.covide19Test = '<b>Do you have a COVID19 test pending? </b>: Yes. <b>COVID19 test date:</b> ' + this.covideDOB + '<br>' + feelingString
      } else {
        req.covide19Test = '<b>Do you have a COVID19 test pending? </b>: No. <br>' + feelingString
      }

      this.sendMailService.sendMail(req).toPromise().then(async res => {
        await loading.dismiss();
        localStorage.clear();
        let alertMsg1 = '';
        this.translate.get('Result.SubmitResponse').subscribe(value => {
          alertMsg1 = value;
        });
        this.presentAlert(alertMsg1);
      }).catch(async (err) => {
        localStorage.clear();
        await loading.dismiss();
        let alertMsg2 = '';
        this.translate.get('Result.failedResponse').subscribe(value => {
          alertMsg2 = value;
        });
        this.presentAlert(alertMsg2);
      });

    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500
    });
    toast.present();
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: '',
      message: msg,
      buttons: [{
        text: 'Okay',
        handler: () => {
          this.router.navigate(['home']);
        }
      }]
    });
    await alert.present();
  }

  formatDate(date) {
    let d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  covide19Selected(event: any) {
    console.log(event.srcElement.id);
    if (event.srcElement.id == "No") {
      this.isCovidDateDisplay = false;
    } else {
      this.isCovidDateDisplay = true;
    }
  }

  selectPositiveValue(value) {
    this.feelingPositive = value;
  }

  selectNegativeValue(value) {
    this.feelingNegative = value;
  }

}
