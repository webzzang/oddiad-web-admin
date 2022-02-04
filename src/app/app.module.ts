import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import localeKo from '@angular/common/locales/ko';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ResponsiveModule} from 'ngx-responsive';
import {AppRoutes} from './app.routing';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SideModule} from './contents/side/side.module';
import {LayoutModule} from './layout/layout.module';
import {AgGridModule} from 'ag-grid-angular';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FlatpickrModule} from 'angularx-flatpickr';
import {HttpRequestInterceptor} from './service/HttpRequestInterceptor';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MemberListComponent} from './contents/customer/member/member-list/member-list.component';
import {MemberMngComponent} from './contents/customer/member/member-mng/member-mng.component';
import {JudgeListComponent} from './contents/advertisement/judge/judge-list/judge-list.component';
import {JudgeMngComponent} from './contents/advertisement/judge/judge-mng/judge-mng.component';
import {PlanListComponent} from './contents/advertisement/plan/plan-list/plan-list.component';
import {PlanMngComponent} from './contents/advertisement/plan/plan-mng/plan-mng.component';
import {LivestreamMngComponent} from './contents/advertisement-content/livestream/livestream-mng/livestream-mng.component';
import {EnvrightbannerListComponent} from './contents/advertisement-content/envrightbanner/envrightbanner-list/envrightbanner-list.component';
import {EnvrightbannerMngComponent} from './contents/advertisement-content/envrightbanner/envrightbanner-mng/envrightbanner-mng.component';
import {EnvbottombannerMngComponent} from './contents/advertisement-content/envbottombanner/envbottombanner-mng/envbottombanner-mng.component';
import {EnvbottombannerListComponent} from './contents/advertisement-content/envbottombanner/envbottombanner-list/envbottombanner-list.component';
import {EnvironmentListComponent} from './contents/environment/environment-list/environment-list.component';
import {EnvironmentMngComponent} from './contents/environment/environment-mng/environment-mng.component';
import {AccountListComponent} from './contents/administrator/account/account-list/account-list.component';
import {AccountMngComponent} from './contents/administrator/account/account-mng/account-mng.component';
import {GroupListComponent} from './contents/administrator/group/group-list/group-list.component';
import {GroupMngComponent} from './contents/administrator/group/group-mng/group-mng.component';
import {ServiceListComponent} from './contents/clause/service/service-list/service-list.component';
import {ServiceMngComponent} from './contents/clause/service/service-mng/service-mng.component';
import {PrivacyListComponent} from './contents/clause/privacy/privacy-list/privacy-list.component';
import {PrivacyMngComponent} from './contents/clause/privacy/privacy-mng/privacy-mng.component';
import {ProvideListComponent} from './contents/clause/provide/provide-list/provide-list.component';
import {ProvideMngComponent} from './contents/clause/provide/provide-mng/provide-mng.component';
import {MarketingMngComponent} from './contents/clause/marketing/marketing-mng/marketing-mng.component';
import {MarketingListComponent} from './contents/clause/marketing/marketing-list/marketing-list.component';
import {ProfileMngComponent} from './contents/mypage/profile-mng/profile-mng.component';
import {ContentsComponent} from "./contents/contents.component";
import {AccountComponent} from './contents/administrator/account/account.component';
import {CommonPipeModule} from "./shared/pipe/common-pipe.module";
import {MarketingComponent} from './contents/clause/marketing/marketing.component';
import {PrivacyComponent} from './contents/clause/privacy/privacy.component';
import {ProvideComponent} from './contents/clause/provide/provide.component';
import {ServiceComponent} from './contents/clause/service/service.component';
import {ContentPreviewComponent} from './contents/clause/content-preview/content-preview.component';
import {ApplyComponent} from './contents/clause/apply/apply.component';
import {ApplyListComponent} from './contents/clause/apply/apply-list/apply-list.component';
import {ApplyMngComponent} from './contents/clause/apply/apply-mng/apply-mng.component';
import {PasswordMngComponent} from './contents/mypage/password-mng/password-mng.component';
import {GroupComponent} from './contents/administrator/group/group.component';
import {MemberComponent} from './contents/customer/member/member.component';
import {QnaComponent} from './contents/customer-service/qna/qna.component';
import {FaqComponent} from './contents/customer-service/faq/faq.component';
import {PartnerQnaComponent} from './contents/customer-service/partner-qna/partner-qna.component';
import {FaqListComponent} from './contents/customer-service/faq/faq-list/faq-list.component';
import {FaqMngComponent} from './contents/customer-service/faq/faq-mng/faq-mng.component';
import {NoticeComponent} from "./contents/customer-service/notice/notice.component";
import {PartnerQnaListComponent} from './contents/customer-service/partner-qna/partner-qna-list/partner-qna-list.component';
import {QnaListComponent} from './contents/customer-service/qna/qna-list/qna-list.component';
import {QnaMngComponent} from './contents/customer-service/qna/qna-mng/qna-mng.component';
import {NoticeListComponent} from "./contents/customer-service/notice/notice-list/notice-list.component";
import {NoticeMngComponent} from "./contents/customer-service/notice/notice-mng/notice-mng.component";
import {ButtonRendererComponent} from "./shared/component/buttonRenderer/button-renderer.component";
import {JudgeComponent} from './contents/advertisement/judge/judge.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {AdvOddizoneComponent} from './contents/advertisement-place/adv-oddizone/adv-oddizone.component';
import {AdvOddizoneListComponent} from './contents/advertisement-place/adv-oddizone/adv-oddizone-list/adv-oddizone-list.component';
import {AdvOddizoneMngComponent} from './contents/advertisement-place/adv-oddizone/adv-oddizone-mng/adv-oddizone-mng.component';
import {AdvSubwayzoneComponent} from './contents/advertisement-place/adv-subwayzone/adv-subwayzone.component';
import {AdvSubwayzoneListComponent} from './contents/advertisement-place/adv-subwayzone/adv-subwayzone-list/adv-subwayzone-list.component';
import {AdvSubwayzoneMngComponent} from './contents/advertisement-place/adv-subwayzone/adv-subwayzone-mng/adv-subwayzone-mng.component';
import {PlanComponent} from './contents/advertisement/plan/plan.component';
import {LivestreamComponent} from './contents/advertisement-content/livestream/livestream.component';
import {AdvPlaceSearchComponent} from './contents/share/adv-place-search/adv-place-search.component';
import {EnvrightbannerComponent} from './contents/advertisement-content/envrightbanner/envrightbanner.component';
import {EnvbottombannerComponent} from './contents/advertisement-content/envbottombanner/envbottombanner.component';
import {SitetopbannerComponent} from './contents/advertisement-content/sitetopbanner/sitetopbanner.component';
import {SitetopbannerMngComponent} from "./contents/advertisement-content/sitetopbanner/sitetopbanner-mng/sitetopbanner-mng.component";
import {SitetopbannerListComponent} from "./contents/advertisement-content/sitetopbanner/sitetopbanner-list/sitetopbanner-list.component";
import {SitepopupComponent} from './contents/advertisement-content/sitepopup/sitepopup.component';
import {SitepopupListComponent} from "./contents/advertisement-content/sitepopup/sitepopup-list/sitepopup-list.component";
import {SitepopupMngComponent} from "./contents/advertisement-content/sitepopup/sitepopup-mng/sitepopup-mng.component";
import {OddizoneComponent} from './contents/purchase/oddizone/oddizone.component';
import {SubwayzoneComponent} from './contents/purchase/subwayzone/subwayzone.component';
import {OddizoneMngComponent} from "./contents/purchase/oddizone/oddizone-mng/oddizone-mng.component";
import {SubwayzoneMngComponent} from "./contents/purchase/subwayzone/subwayzone-mng/subwayzone-mng.component";
import {BundlepurchaseComponent} from "./contents/purchase/bundlepurchase/bundlepurchase.component";
import {BundlepurchaseListComponent} from "./contents/purchase/bundlepurchase/bundlepurchase-list/bundlepurchase-list.component";
import {BundlepurchaseMngComponent} from "./contents/purchase/bundlepurchase/bundlepurchase-mng/bundlepurchase-mng.component";
import {MessageSendComponent} from './contents/notification/message-send/message-send.component';
import {MessageHistComponent} from './contents/notification/message-hist/message-hist.component';
import {MessageHistListComponent} from './contents/notification/message-hist/message-hist-list/message-hist-list.component';
import {CustomerSearchComponent} from './contents/share/customer-search/customer-search.component';
import {AdvhistoryComponent} from './contents/sales/advhistory/advhistory.component';
import {PaymentComponent} from './contents/sales/payment/payment.component';
import {AdvhistoryListComponent} from './contents/sales/advhistory/advhistory-list/advhistory-list.component';
import {PaymentListComponent} from "./contents/sales/payment/payment-list/payment-list.component";
import {MessageSendMngComponent} from "./contents/notification/message-send/message-send-mng/message-send-mng.component";
import {MessageGroupSearchComponent} from "./contents/notification/message-send/message-group-search/message-group-search.component";
import {EnvironmentComponent} from './contents/environment/environment.component';
import {PromotionComponent} from './contents/purchase/promotion/promotion.component';
import {PromotionListComponent} from './contents/purchase/promotion/promotion-list/promotion-list.component';
import {PromotionMngComponent} from './contents/purchase/promotion/promotion-mng/promotion-mng.component';
import {SignupcouponMngComponent} from './contents/purchase/promotion/signupcoupon-mng/signupcoupon-mng.component';
import {ExcelExporterComponent} from './contents/share/excel-exporter/excel-exporter.component';
import {NgChartsModule} from "ng2-charts";
import {TextMaskModule} from "angular2-text-mask";

@NgModule({
  declarations: [
    AppComponent,
    ContentsComponent,
    MemberListComponent,
    MemberMngComponent,
    JudgeListComponent,
    JudgeMngComponent,
    PlanListComponent,
    PlanMngComponent,
    LivestreamMngComponent,
    EnvrightbannerListComponent,
    EnvrightbannerMngComponent,
    EnvbottombannerMngComponent,
    EnvbottombannerListComponent,
    SitetopbannerMngComponent,
    EnvironmentListComponent,
    EnvironmentMngComponent,
    AccountComponent,
    AccountListComponent,
    AccountMngComponent,
    GroupListComponent,
    GroupMngComponent,
    ServiceListComponent,
    ServiceMngComponent,
    PrivacyListComponent,
    PrivacyMngComponent,
    ProvideListComponent,
    ProvideMngComponent,
    MarketingMngComponent,
    MarketingListComponent,
    ProfileMngComponent,
    MarketingComponent,
    PrivacyComponent,
    ProvideComponent,
    ServiceComponent,
    ContentPreviewComponent,
    ApplyComponent,
    ApplyListComponent,
    ApplyMngComponent,
    PasswordMngComponent,
    GroupComponent,
    MemberComponent,
    QnaComponent,
    FaqComponent,
    PartnerQnaComponent,
    FaqListComponent,
    FaqMngComponent,
    NoticeComponent,
    NoticeListComponent,
    NoticeMngComponent,
    PartnerQnaListComponent,
    QnaListComponent,
    QnaMngComponent,
    ButtonRendererComponent,
    JudgeComponent,
    AdvOddizoneComponent,
    AdvOddizoneListComponent,
    AdvOddizoneMngComponent,
    AdvSubwayzoneComponent,
    AdvSubwayzoneListComponent,
    AdvSubwayzoneMngComponent,
    PlanComponent,
    LivestreamComponent,
    AdvPlaceSearchComponent,
    EnvrightbannerComponent,
    EnvbottombannerComponent,
    SitetopbannerComponent,
    SitetopbannerListComponent,
    SitetopbannerMngComponent,
    SitepopupComponent,
    SitepopupListComponent,
    SitepopupMngComponent,
    OddizoneComponent,
    OddizoneMngComponent,
    SubwayzoneComponent,
    SubwayzoneMngComponent,
    BundlepurchaseComponent,
    BundlepurchaseListComponent,
    BundlepurchaseMngComponent,
    MessageSendComponent,
    MessageSendMngComponent,
    MessageGroupSearchComponent,
    MessageHistComponent,
    MessageHistListComponent,
    CustomerSearchComponent,
    AdvhistoryComponent,
    AdvhistoryListComponent,
    PaymentComponent,
    PaymentListComponent,
    EnvironmentComponent,
    PromotionComponent,
    PromotionListComponent,
    PromotionMngComponent,
    SignupcouponMngComponent,
    ExcelExporterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule.forRoot(AppRoutes, {onSameUrlNavigation: 'reload'}),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ResponsiveModule.forRoot(),
    TranslateModule.forRoot(),
    SharedModule.forRoot(),
    SideModule,
    LayoutModule,
    AgGridModule.withComponents([]),
    NgxSpinnerModule,
    FlatpickrModule.forRoot(),
    TextMaskModule,
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
    NgChartsModule,
    NgbModule,
    CommonPipeModule,
    DragDropModule
  ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'ko' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }

registerLocaleData(localeKo);
