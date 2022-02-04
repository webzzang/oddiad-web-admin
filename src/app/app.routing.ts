import {Routes} from '@angular/router';
import {BlankLayoutComponent} from './layout/BlankLayout/BlankLayout.component';
import {SimpleLayoutComponent} from './layout/SimpleLayout/SimpleLayout.component';
// Layouts
import {SessionGuard} from "./contents/session/session.guard";
import {ContentsComponent} from "./contents/contents.component";
import {AccountComponent} from "./contents/administrator/account/account.component";
import {ServiceComponent} from "./contents/clause/service/service.component";
import {PrivacyComponent} from "./contents/clause/privacy/privacy.component";
import {ProvideComponent} from "./contents/clause/provide/provide.component";
import {MarketingComponent} from "./contents/clause/marketing/marketing.component";
import {ApplyComponent} from "./contents/clause/apply/apply.component";
import {GroupComponent} from "./contents/administrator/group/group.component";
import {MemberComponent} from "./contents/customer/member/member.component";
import {QnaComponent} from "./contents/customer-service/qna/qna.component";
import {NoticeComponent} from "./contents/customer-service/notice/notice.component";
import {FaqComponent} from "./contents/customer-service/faq/faq.component";
import {PartnerQnaComponent} from "./contents/customer-service/partner-qna/partner-qna.component";
import {JudgeComponent} from "./contents/advertisement/judge/judge.component";
import {AdvOddizoneComponent} from "./contents/advertisement-place/adv-oddizone/adv-oddizone.component";
import {AdvSubwayzoneComponent} from "./contents/advertisement-place/adv-subwayzone/adv-subwayzone.component";
import {PlanComponent} from "./contents/advertisement/plan/plan.component";
import {LivestreamComponent} from "./contents/advertisement-content/livestream/livestream.component";
import {EnvrightbannerComponent} from "./contents/advertisement-content/envrightbanner/envrightbanner.component";
import {EnvbottombannerComponent} from "./contents/advertisement-content/envbottombanner/envbottombanner.component";
import {SitetopbannerComponent} from "./contents/advertisement-content/sitetopbanner/sitetopbanner.component";
import {SitepopupComponent} from "./contents/advertisement-content/sitepopup/sitepopup.component";
import {OddizoneComponent} from "./contents/purchase/oddizone/oddizone.component";
import {SubwayzoneComponent} from "./contents/purchase/subwayzone/subwayzone.component";
import {BundlepurchaseComponent} from "./contents/purchase/bundlepurchase/bundlepurchase.component";
import {MessageHistComponent} from "./contents/notification/message-hist/message-hist.component";
import {MessageSendComponent} from "./contents/notification/message-send/message-send.component";
import {AdvhistoryComponent} from "./contents/sales/advhistory/advhistory.component";
import {PaymentComponent} from "./contents/sales/payment/payment.component";
import {EnvironmentComponent} from "./contents/environment/environment.component";
import {PromotionComponent} from "./contents/purchase/promotion/promotion.component";

export const AppRoutes: Routes = [
  {
    path: 'session',
    component: BlankLayoutComponent,
    loadChildren: () => import('./contents/session/session.module').then(m => m.SessionModule)
  },
  {
    path: '',
    component: SimpleLayoutComponent,
    canActivate: [SessionGuard],
    children: [
      {
        path: '',
        component: ContentsComponent,
        children: [
          {
            path: MemberComponent.PATH,
            component: MemberComponent
          },
          {
            path: JudgeComponent.PATH,
            component: JudgeComponent
          },
          {
            path: PlanComponent.PATH,
            component: PlanComponent
          },
          {
            path: AdvOddizoneComponent.PATH,
            component: AdvOddizoneComponent
          },
          {
            path: AdvSubwayzoneComponent.PATH,
            component: AdvSubwayzoneComponent
          },
          {
            path: LivestreamComponent.PATH,
            component: LivestreamComponent
          },
          {
            path: EnvrightbannerComponent.PATH,
            component: EnvrightbannerComponent
          },
          {
            path: EnvbottombannerComponent.PATH,
            component: EnvbottombannerComponent
          },
          {
            path: SitetopbannerComponent.PATH,
            component: SitetopbannerComponent
          },
          {
            path: SitepopupComponent.PATH,
            component: SitepopupComponent
          },
          {
            path: NoticeComponent.PATH,
            component: NoticeComponent
          },
          {
            path: QnaComponent.PATH,
            component: QnaComponent
          },
          {
            path: FaqComponent.PATH,
            component: FaqComponent
          },
          {
            path: PartnerQnaComponent.PATH,
            component: PartnerQnaComponent
          },
          {
            path: AccountComponent.PATH,
            component: AccountComponent
          },
          {
            path: GroupComponent.PATH,
            component: GroupComponent
          },
          {
            path: EnvironmentComponent.PATH,
            component: EnvironmentComponent
          },
          {
            path: BundlepurchaseComponent.PATH,
            component: BundlepurchaseComponent
          },
          {
            path: OddizoneComponent.PATH,
            component: OddizoneComponent
          },
          {
            path: SubwayzoneComponent.PATH,
            component: SubwayzoneComponent
          },
          {
            path: ServiceComponent.PATH,
            component: ServiceComponent
          },
          {
            path: PrivacyComponent.PATH,
            component: PrivacyComponent
          },
          {
            path: ProvideComponent.PATH,
            component: ProvideComponent
          },
          {
            path: MarketingComponent.PATH,
            component: MarketingComponent
          },
          {
            path: ApplyComponent.PATH,
            component: ApplyComponent
          },
          {
            path: MessageSendComponent.PATH,
            component: MessageSendComponent
          },
          {
            path: MessageHistComponent.PATH,
            component: MessageHistComponent
          },
          {
            path: AdvhistoryComponent.PATH,
            component: AdvhistoryComponent
          },
          {
            path: PaymentComponent.PATH,
            component: PaymentComponent
          },
          {
            path: PromotionComponent.PATH,
            component: PromotionComponent
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: 'session/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'session/error'
  }
];
